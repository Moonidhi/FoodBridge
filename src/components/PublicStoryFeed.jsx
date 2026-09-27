import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  Utensils, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Sparkles,
  MessageCircle,
  Award,
  Flame
} from 'lucide-react';
import { formatTimeAgo, calculateCo2Avoided } from '../utils/helpers';
import RatingStars from './RatingStars';

export default function PublicStoryFeed({ activities, listings, users, onOpenCertificate }) {
  // Social heart reaction counts stored per activity
  const [cheers, setCheers] = useState({
    act_1: 18,
    act_2: 24,
    act_3: 12,
    act_4: 9
  });

  const handleCheer = (actId) => {
    setCheers(prev => ({
      ...prev,
      [actId]: (prev[actId] || 0) + 1
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Story Feed Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 mb-1">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
            <span>Live Community Story Feed</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Recent Food Rescue Wins
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real stories of surplus meals delivered to shelters across the city today.
          </p>
        </div>

        <button
          onClick={() => onOpenCertificate && onOpenCertificate()}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">View Impact Certificate</span>
        </button>
      </div>

      {/* Social Story Feed Cards */}
      <div className="space-y-4">
        {activities.map((act) => {
          const listing = listings.find(l => l.id === act.listing_id);
          const actor = users.find(u => u.id === act.actor_id);
          const cheerCount = cheers[act.id] || 8;
          const co2 = listing ? calculateCo2Avoided(listing.quantity_kg) : 45;

          return (
            <div
              key={act.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* User Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={actor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={act.actor_name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{act.actor_name}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-md border border-emerald-200 capitalize">
                        {act.actor_role}
                      </span>
                      {actor?.streak_count && (
                        <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-md border border-amber-200 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {actor.streak_count}-wk streak
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(act.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="capitalize">{act.status}</span>
                </span>
              </div>

              {/* Story Narrative */}
              <p className="text-slate-800 text-sm font-semibold leading-relaxed">
                "{act.text}"
              </p>

              {/* Photo & Impact Cards inside Story */}
              {listing?.photo_url && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-100 group max-h-72">
                  <img
                    src={listing.photo_url}
                    alt={listing.food_name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Floating Impact Overlay Pills */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap">
                    <div className="bg-slate-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                      <span>~{listing.meals_estimate} Meals Saved</span>
                    </div>

                    <div className="bg-emerald-950/80 backdrop-blur-md text-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md border border-emerald-500/30">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{co2} kg CO₂e avoided</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Story Footer - Cheer & Share Controls */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <button
                  onClick={() => handleCheer(act.id)}
                  className="flex items-center gap-1.5 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-bounce" />
                  <span>{cheerCount} Cheered</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {listing?.pickup_location?.address || 'Indiranagar'}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
