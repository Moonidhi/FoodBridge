import React, { useState } from 'react';
import { Award, Flame, Star, Utensils, Truck, Trophy, ShieldCheck } from 'lucide-react';
import RatingStars from './RatingStars';
import { useLanguage } from '../context/LanguageContext';

export default function LeaderboardStreaks({ users, listings }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('volunteers'); // 'volunteers' or 'donors'

  const donors = users.filter(u => u.role === 'donor').sort((a, b) => (b.completed_pickups || 0) - (a.completed_pickups || 0));
  const volunteers = users.filter(u => u.role === 'volunteer' || u.role === 'ngo').sort((a, b) => (b.completed_pickups || 0) - (a.completed_pickups || 0));

  const currentList = activeTab === 'volunteers' ? volunteers : donors;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>{t('leaderboard_title')}</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Celebrating community heroes keeping surplus food out of landfills.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'volunteers' ? 'bg-white text-emerald-700 font-extrabold shadow-xs' : 'text-slate-600'
            }`}
          >
            {t('top_volunteers')}
          </button>

          <button
            onClick={() => setActiveTab('donors')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'donors' ? 'bg-white text-emerald-700 font-extrabold shadow-xs' : 'text-slate-600'
            }`}
          >
            {t('top_donors')}
          </button>
        </div>
      </div>

      {/* Ranked User Cards */}
      <div className="space-y-3">
        {currentList.map((u, i) => {
          const rating = u.role === 'donor' ? (u.donor_rating || 4.9) : (u.volunteer_rating || 5.0);
          const ratingCount = u.role === 'donor' ? (u.donor_rating_count || 18) : (u.volunteer_rating_count || 32);
          const streak = u.streak_count || (4 - i);

          let medalBg = 'bg-slate-100 text-slate-600';
          if (i === 0) medalBg = 'bg-emerald-600 text-white font-extrabold shadow-xs';
          if (i === 1) medalBg = 'bg-slate-200 text-slate-800 font-bold';
          if (i === 2) medalBg = 'bg-slate-100 text-slate-700 font-medium';

          return (
            <div
              key={u.id}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                i === 0 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50/80 border-slate-200/70'
              }`}
            >
              {/* Rank & Profile */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${medalBg}`}>
                  #{i + 1}
                </div>

                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shrink-0" />
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-[140px] sm:max-w-[200px]">{u.name}</span>
                    
                    {/* STREAK BADGE */}
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 inline-flex items-center gap-1 shrink-0">
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{streak}-wk streak</span>
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    <RatingStars rating={rating} count={ratingCount} size="sm" />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right shrink-0 pl-3 border-l border-slate-200/60">
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                  {u.completed_pickups || 28} pickups
                </div>
                <div className="text-[11px] text-emerald-700 font-medium whitespace-nowrap">
                  ~{(u.completed_pickups || 28) * 4} meals saved
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
