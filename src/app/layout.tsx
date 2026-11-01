import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e11d48',
};

export const metadata: Metadata = {
  title: 'Celebration & Event Planner | GenAI Planning Assistant',
  description:
    'An intelligent, GenAI-powered celebration planning assistant that helps you organize dream weddings, milestone birthdays, and community festivals with smart budgets, interactive timelines, vendor checklists, and personalized theme ideas.',
  keywords: [
    'Event Planner',
    'Wedding Planning',
    'Birthday Organizer',
    'Community Events',
    'GenAI Assistant',
    'Budget Tracker',
    'Vendor Checklist',
    'Event Timeline',
  ],
  authors: [{ name: 'PromptWars Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-rose-100 selection:text-rose-900">
        {/* Skip Navigation Link for WCAG AAA Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-rose-600 focus:text-white focus:font-bold focus:text-sm focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-rose-300"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
