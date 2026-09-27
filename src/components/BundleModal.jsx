import React from 'react';
import { X, Boxes, Utensils, MapPin, CheckCircle, ArrowRight, Zap, Route } from 'lucide-react';
import { computeNearestNeighborRoute, getTimeRemaining } from '../utils/helpers';

export default function BundleModal({ bundleGroup, isOpen, onClose, onClaimBundle, userLocation = { lat: 12.9750, lng: 77.6380 } }) {
  if (!isOpen || !bundleGroup || bundleGroup.length === 0) return null;

  // Compute Nearest Neighbor Route Sequence (Requirement #3)
  const { route, totalDistanceKm } = computeNearestNeighborRoute(userLocation, bundleGroup);

  const totalMeals = bundleGroup.reduce((sum, item) => sum + (item.meals_estimate || 0), 0);
  const totalKg = bundleGroup.reduce((sum, item) => sum + (item.quantity_kg || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-float">
        
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Route className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-emerald-100 px-2 py-0.5 rounded inline-block">
                Smart Route Optimization
              </div>
              <h2 className="font-extrabold text-xl tracking-tight text-white">
                Claim {bundleGroup.length} Pickups in 1 Trip!
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Summary Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-slate-900">
            <div>
              <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1">
                <Route className="w-4 h-4 text-emerald-600" />
                <span>Nearest-Neighbor Route Order</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-900 mt-0.5 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-600" />
                <span>~{totalMeals} Total Meals ({totalKg} kg)</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-800 bg-white border border-emerald-200 px-3 py-1 rounded-lg shadow-xs flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{totalDistanceKm} km total route</span>
              </span>
            </div>
          </div>

          {/* Ordered Route List */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Suggested Visiting Sequence (From Your Location):
            </div>

            {route.map((item) => {
              const timeInfo = getTimeRemaining(item.expiry_time);

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      #{item.routeOrder}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-snug">
                        {item.food_name}
                      </h4>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {item.donor_name} • {item.pickup_location.address} (+{item.legDistanceKm} km leg)
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-emerald-700 text-xs">
                      ~{item.meals_estimate} meals
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${timeInfo.badgeColor}`}>
                      {timeInfo.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onClaimBundle(bundleGroup.map(b => b.id));
                onClose();
              }}
              className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Claim Ordered Bundle ({bundleGroup.length} Pickups)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
