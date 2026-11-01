'use client';

import React, { useState } from 'react';
import { Palette, Sparkles, Utensils, PartyPopper, Mail, Copy, Check, Lightbulb } from 'lucide-react';
import { PersonalizedIdeas as PersonalizedIdeasType } from '@/types/event';

interface PersonalizedIdeasProps {
  ideas: PersonalizedIdeasType;
  vibe: string;
}

export const PersonalizedIdeas: React.FC<PersonalizedIdeasProps> = ({ ideas, vibe }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(ideas.invitationCopySnippet);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Theme & Tagline Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Signature Theme Concept</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {ideas.themeName}
          </h2>
          <p className="text-base sm:text-lg text-rose-100/90 italic font-light">
            “{ideas.tagline}”
          </p>
          <div className="pt-2 text-xs text-rose-200/70">
            <span className="font-semibold text-rose-200">Desired Vibe:</span> {vibe}
          </div>
        </div>
      </div>

      {/* Color Palette Swatches */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-bold text-slate-900">Curated Color Palette</h3>
          </div>
          <span className="text-xs text-slate-400">Click swatch to copy HEX code</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ideas.colorPalette.map((color, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCopyHex(color.hex)}
              className="group relative flex flex-col items-center p-3 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition bg-slate-50/50"
              title={`Copy ${color.hex}`}
            >
              <div
                className="w-full h-14 rounded-xl shadow-inner border border-black/10 transition group-hover:scale-105"
                style={{ backgroundColor: color.hex }}
              />
              <span className="mt-2 text-xs font-bold text-slate-800 truncate w-full text-center">
                {color.name}
              </span>
              <span className="text-2xs font-mono text-slate-500 uppercase flex items-center gap-1">
                {color.hex}
                {copiedHex === color.hex ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Grid: Decor Concepts & Interactive Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decor Concepts */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-bold text-slate-900">Decor & Atmosphere Concepts</h3>
            </div>
            <ul className="space-y-3">
              {ideas.decorConcepts.map((decor, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{decor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive Activities & Entertainment */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PartyPopper className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">Interactive Guest Experiences</h3>
            </div>
            <ul className="space-y-3">
              {ideas.interactiveActivities.map((act, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Signature Food & Drinks & Invitation Phrasing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom Culinary & Beverage Concepts */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">Culinary & Drink Highlights</h3>
          </div>
          <ul className="space-y-3">
            {ideas.customFoodDrinkConcepts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                  🍽️
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Invitation Phrasing & RSVP Snippet */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Invitation & Card Phrasing</h3>
              </div>
              <button
                type="button"
                onClick={handleCopyInvite}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                {copiedInvite ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Phrasing</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/50 to-slate-50 border border-blue-100/70 text-slate-800 text-sm italic font-serif leading-relaxed">
              “{ideas.invitationCopySnippet}”
            </div>
          </div>

          {/* AI Suggestions Box */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Event Coordinator Pro-Tips:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              {ideas.aiSuggestions.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

