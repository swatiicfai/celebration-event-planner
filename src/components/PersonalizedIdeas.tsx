'use client';

import React, { useState, memo } from 'react';
import { Palette, Sparkles, Utensils, PartyPopper, Mail, Copy, Check, Lightbulb } from 'lucide-react';
import { PersonalizedIdeas as PersonalizedIdeasType } from '@/types/event';

interface PersonalizedIdeasProps {
  ideas: PersonalizedIdeasType;
  vibe: string;
}

/**
 * Creative theme and personalization showcase displaying theme blueprints,
 * 5-color aesthetic palettes, decor concepts, guest activations, menus, and invitation snippets.
 */
export const PersonalizedIdeas: React.FC<PersonalizedIdeasProps> = memo(function PersonalizedIdeas({
  ideas,
  vibe,
}): React.ReactElement {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const handleCopyHex = (hex: string): void => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyInvite = (): void => {
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
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
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
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-rose-600" aria-hidden="true" />
            <h3 className="font-bold text-slate-900 text-base">Curated Color Palette</h3>
          </div>
          <span className="text-xs text-slate-400">Click any swatch to copy HEX</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" role="list" aria-label="Color palette swatches">
          {ideas.colorPalette.map((color) => {
            const isCopied = copiedHex === color.hex;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => handleCopyHex(color.hex)}
                aria-label={`Copy color code ${color.hex} for ${color.name}`}
                className="group relative flex flex-col items-center p-3 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-sm transition text-center focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <div
                  className="w-12 h-12 rounded-xl shadow-inner mb-2 transition transform group-hover:scale-105 flex items-center justify-center border border-black/10"
                  style={{ backgroundColor: color.hex }}
                >
                  {isCopied && <Check className="w-5 h-5 text-white drop-shadow-md" aria-hidden="true" />}
                </div>
                <span className="text-xs font-bold text-slate-800 line-clamp-1">{color.name}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">
                  {isCopied ? 'Copied!' : color.hex}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Feature Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decor & Atmosphere */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-600">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            <h3 className="font-bold text-slate-900 text-base">Decor & Atmosphere Concepts</h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            {ideas.decorConcepts.map((decor, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{decor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Activities */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-600">
            <PartyPopper className="w-5 h-5" aria-hidden="true" />
            <h3 className="font-bold text-slate-900 text-base">Interactive Guest Experiences</h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            {ideas.interactiveActivities.map((act, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Culinary & Drinks */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <Utensils className="w-5 h-5" aria-hidden="true" />
            <h3 className="font-bold text-slate-900 text-base">Culinary & Drink Highlights</h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            {ideas.customFoodDrinkConcepts.map((food, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{food}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Invitation & Phrasing Snippet */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-600 mb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" aria-hidden="true" />
                <h3 className="font-bold text-slate-900 text-base">Invitation & Card Phrasing</h3>
              </div>
              <button
                type="button"
                onClick={handleCopyInvite}
                aria-label="Copy invitation text to clipboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-1"
              >
                {copiedInvite ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm italic text-slate-700 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 leading-relaxed font-serif">
              “{ideas.invitationCopySnippet}”
            </p>
          </div>

          {/* AI Suggestions Box */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span>Event Coordinator Pro-Tips:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-500">
              {ideas.aiSuggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
