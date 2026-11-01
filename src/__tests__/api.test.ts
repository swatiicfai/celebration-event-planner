import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, OPTIONS } from '@/app/api/generate-plan/route';
import { NextRequest } from 'next/server';
import { resetRateLimits } from '@/lib/security';

describe('API Route - /api/generate-plan', () => {
  beforeEach(() => {
    resetRateLimits();
    vi.clearAllMocks();
  });

  const createMockRequest = (body: unknown, headers: Record<string, string> = {}) => {
    return new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
        ...headers,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  };

  it('handles OPTIONS preflight request with correct CORS headers', async () => {
    const res = await OPTIONS();
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });

  it('successfully generates plan for valid wedding payload', async () => {
    const req = createMockRequest({
      eventType: 'wedding',
      title: 'Romantic Garden Wedding',
      eventDate: '2027-05-20',
      location: 'Glasshouse Estate',
      guestCount: 150,
      totalBudget: 30000,
      currency: 'USD',
      vibe: 'Fairy lights and acoustic soul',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.eventType).toBe('wedding');
    expect(json.data.totalBudget).toBe(30000);
    expect(json.data.ideas.themeName).toBeDefined();
    expect(json.data.budgetItems.length).toBeGreaterThan(0);
    expect(json.data.timeline.length).toBeGreaterThan(0);
    expect(json.data.vendors.length).toBeGreaterThan(0);
  });

  it('rejects invalid event type with 400 Bad Request', async () => {
    const req = createMockRequest({
      eventType: 'invalid-event-type',
      totalBudget: 5000,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain('Invalid event type');
  });

  it('rejects non-object or malformed JSON payloads with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'invalid-json-string{',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('blocks prototype pollution payload attempts with 400', async () => {
    const req = createMockRequest('{"__proto__":{"polluted":true},"eventType":"wedding"}');

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain('Forbidden property');
  });

  it('enforces rate limiting when too many requests arrive from same IP', async () => {
    const payload = {
      eventType: 'birthday',
      title: 'Party',
      eventDate: '2026-12-12',
      location: 'Club',
      guestCount: 50,
      totalBudget: 5000,
      currency: 'USD',
      vibe: 'Neon beats',
    };

    // Send 15 requests to reach threshold
    for (let i = 0; i < 15; i++) {
      const req = createMockRequest(payload, { 'x-forwarded-for': '192.168.1.100' });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 16th request must be rejected with 429
    const blockedReq = createMockRequest(payload, { 'x-forwarded-for': '192.168.1.100' });
    const blockedRes = await POST(blockedReq);
    expect(blockedRes.status).toBe(429);

    const json = await blockedRes.json();
    expect(json.error).toContain('Too many requests');
  });
});
