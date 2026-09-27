import React from 'react';
import { Sparkles, MapPin, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { calculateDistance, getTimeRemaining } from '../utils/helpers';
import RatingStars from './RatingStars';

export default function SuggestedMatchBanner({ listing, currentUser, onClaim }) {
  if (!listing || currentUser.role === 'donor') return null;

  const timeInfo = getTimeRemaining(listing.expiry_time);
  const dist = calculateDistance(
    currentUser.location.lat,
    currentUser.location.lng,
    listing.pickup_location.lat,
    listing.pickup_location.lng
  );

  const rating = currentUser.volunteer_rating || currentUser.reliability_score || 5.0;

  return (
    <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Suggested Match
          </span>
          <span className="text-xs text-emerald-800 font-semibold">
            Single Best-Fit Volunteer
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900">
          "{listing.food_name}"
        </h3>

        <div className="text-xs text-slate-600 font-medium flex items-center gap-2 flex-wrap">
          <span>{listing.donor_name}</span>
          <span>·</span>
          <span className="font-semibold text-emerald-800">{dist} km away</span>
          <span>·</span>
          <span>⭐ {rating} Rating</span>
          <span>·</span>
          <span className="font-semibold">{timeInfo.text}</span>
        </div>
      </div>

      <button
        onClick={() => onClaim(listing.id)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
      >
        <span>Accept Match (~{listing.meals_estimate} Meals)</span>
        <ArrowRight className="w-4 h-4" />
      </button>

    </div>
  );
}
