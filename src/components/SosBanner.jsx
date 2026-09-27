import React from 'react';
import { AlertTriangle, Clock, ArrowRight, Zap } from 'lucide-react';
import { getTimeRemaining } from '../utils/helpers';

export default function SosBanner({ listings, onSelectListing }) {
  const sosListings = listings.filter(l => {
    if (l.status !== 'available') return false;
    const { totalMins } = getTimeRemaining(l.expiry_time);
    return totalMins > 0 && totalMins <= 20;
  });

  if (sosListings.length === 0) return null;

  const topSos = sosListings[0];
  const { totalMins } = getTimeRemaining(topSos.expiry_time);

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-4 py-3 shadow-lg animate-sos-pulse relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-md animate-bounce">
            <AlertTriangle className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold uppercase tracking-wider text-amber-200 bg-red-950/40 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                SOS ESCALATION ({sosListings.length} Urgent)
              </span>
              <span className="font-medium text-red-100 hidden md:inline">
                Expiring in less than 20 minutes!
              </span>
            </div>
            <p className="font-semibold text-white text-base leading-tight mt-0.5">
              "{topSos.food_name}" from {topSos.donor_name} • <span className="underline decoration-yellow-300 font-bold">{topSos.meals_estimate} meals</span> at risk!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-400/30 text-xs font-mono font-bold text-yellow-300">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>{totalMins}m {Math.floor((new Date(topSos.expiry_time) - new Date()) / 1000) % 60}s left</span>
          </div>

          <button
            onClick={() => onSelectListing(topSos)}
            className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-4 py-1.5 rounded-lg text-xs transition-all shadow hover:scale-105 flex items-center gap-1 cursor-pointer"
          >
            <span>Claim SOS Pickup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
