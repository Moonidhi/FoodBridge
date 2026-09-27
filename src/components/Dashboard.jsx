import React, { useState } from 'react';
import { 
  Utensils, 
  CheckCircle2, 
  Clock, 
  Activity, 
  TrendingUp, 
  Truck,
  Heart,
  Award,
  Sparkles,
  Leaf
} from 'lucide-react';
import PublicStoryFeed from './PublicStoryFeed';
import LeaderboardStreaks from './LeaderboardStreaks';
import ImpactCertificate from './ImpactCertificate';
import { calculateCo2Avoided } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard({ listings, activities, users, currentUser }) {
  const { t } = useLanguage();
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Compute Key Stats
  const deliveredListings = listings.filter(l => l.status === 'delivered');
  const totalMealsSaved = listings.reduce((sum, item) => {
    if (item.status === 'delivered' || item.status === 'picked_up' || item.status === 'claimed') {
      return sum + (item.meals_estimate || 0);
    }
    return sum;
  }, 1420); // base saved + active

  const activeCount = listings.filter(l => l.status === 'available' || l.status === 'claimed').length;
  const completedCount = deliveredListings.length + 38; // seeded baseline
  const totalKgSaved = Math.round(totalMealsSaved / 4);
  const totalCo2Avoided = calculateCo2Avoided(totalKgSaved);

  // 7-day trend sample data
  const chartData = [
    { day: 'Mon', meals: 140, weightKg: 35 },
    { day: 'Tue', meals: 210, weightKg: 52 },
    { day: 'Wed', meals: 180, weightKg: 45 },
    { day: 'Thu', meals: 290, weightKg: 72 },
    { day: 'Fri', meals: 340, weightKg: 85 },
    { day: 'Sat', meals: 420, weightKg: 105 },
    { day: 'Sun', meals: 380, weightKg: 95 }
  ];

  const maxMeals = Math.max(...chartData.map(d => d.meals));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Dashboard Title & Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>Humanized Community Impact Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Surplus Food Rescue Stories & Impact
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
            Real stories, community leaderboards, streaks, and verified CO₂e sustainability certificates.
          </p>
        </div>

        {/* Certificate Generator Trigger Button */}
        <button
          onClick={() => setIsCertificateOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md shadow-emerald-200 transition-all flex items-center gap-2 cursor-pointer hover:scale-102 shrink-0"
        >
          <Award className="w-4 h-4 text-yellow-300" />
          <span>Generate Shareable Certificate</span>
        </button>
      </div>

      {/* 4 Key Impact Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Total Meals Saved */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
              {t('total_meals_saved')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black mt-3 tracking-tight">
            {totalMealsSaved.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-100 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-yellow-300" />
            <span>+18% meals saved this week</span>
          </p>
        </div>

        {/* Stat 2: CO2e Avoided */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              {t('co2_avoided')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-teal-700 mt-3">
              {totalCo2Avoided} <span className="text-sm font-bold text-slate-500">kg</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Based on 2.5 kg CO₂e per 1 kg food
            </p>
          </div>
        </div>

        {/* Stat 3: Completed Deliveries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              {t('completed_deliveries')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 mt-3">
              {completedCount}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Successful shelter handoffs
            </p>
          </div>
        </div>

        {/* Stat 4: Active Rescue Pickups */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              {t('active_pickups')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 mt-3">
              {activeCount}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Broadcasted in real time
            </p>
          </div>
        </div>

      </div>

      {/* Main Grid: Requirement #2 (Public Story Feed) + Requirement #3 (Leaderboard & Streaks) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Requirement #2: PUBLIC IMPACT STORY FEED (2 Columns - DEFAULT VIEW) */}
        <div className="lg:col-span-2">
          <PublicStoryFeed
            activities={activities}
            listings={listings}
            users={users}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        </div>

        {/* Requirement #3: LEADERBOARD + STREAKS (1 Column) */}
        <div className="space-y-6">
          <LeaderboardStreaks
            users={users}
            listings={listings}
          />

          {/* 7-Day Deliveries Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>7-Day Volume Trend</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                1,960 Meals
              </span>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
              {chartData.map((d) => {
                const heightPercent = Math.round((d.meals / maxMeals) * 100);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                    <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden h-32 flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 transition-all rounded-t-lg"
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Auto-Generated Impact Certificate Modal */}
      <ImpactCertificate
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        donor={currentUser}
        monthlyMeals={totalMealsSaved}
        monthlyKg={totalKgSaved}
      />

    </div>
  );
}
