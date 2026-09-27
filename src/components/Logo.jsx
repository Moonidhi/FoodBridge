import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Logo({ className = "", size = "md" }) {
  const { t } = useLanguage();
  const iconSizes = {
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2.5"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Infinite Community Bowl Emblem */}
      <div className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200 shrink-0`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Warm Community Bowl Base */}
          <path
            d="M6 15C6 21 10.5 25 16 25C21.5 25 26 21 26 15H6Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Bowl Rim Accent */}
          <path
            d="M5 15H27"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Intertwined Rescue Loop / Infinity Ribbon */}
          <path
            d="M10 11C8.3 11 7 9.7 7 8C7 6.3 8.3 5 10 5C13.5 5 18.5 11 22 11C23.7 11 25 9.7 25 8C25 6.3 23.7 5 22 5C18.5 5 13.5 11 10 11Z"
            stroke="#34D399"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central Nourishment Sprout Node */}
          <circle cx="16" cy="18" r="2" fill="#34D399" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tight text-slate-900 ${textSizes[size]}`}>
          Food<span className="text-emerald-600 font-black">Bridge</span>
        </span>
        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          {t('logo_subtitle')}
        </span>
      </div>
    </div>
  );
}
