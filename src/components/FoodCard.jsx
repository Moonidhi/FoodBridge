import React from 'react';
import { 
  Clock, 
  MapPin, 
  UtensilsCrossed, 
  Phone, 
  CheckCircle2, 
  Truck, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { 
  getTimeRemaining, 
  calculateDistance, 
  computeUrgencyScore,
  getListingSizeCategory,
  checkCapacityMismatch
} from '../utils/helpers';
import RatingStars from './RatingStars';
import { useLanguage } from '../context/LanguageContext';

export default function FoodCard({ 
  listing, 
  currentUser, 
  onClaim, 
  onUpdateStatus, 
  onBundleClick, 
  isBundled,
  userLocation = { lat: 12.9750, lng: 77.6380 } 
}) {
  const { t } = useLanguage();
  const timeInfo = getTimeRemaining(listing.expiry_time);
  const urgencyScore = computeUrgencyScore(listing, userLocation.lat, userLocation.lng);
  
  const dist = calculateDistance(
    userLocation.lat, 
    userLocation.lng, 
    listing.pickup_location.lat, 
    listing.pickup_location.lng
  );

  const sizeCategory = getListingSizeCategory(listing.quantity_kg);
  const capacityCheck = checkCapacityMismatch(currentUser.vehicle_capacity || 'Bike (small)', listing.quantity_kg);
  const isSos = timeInfo.status === 'sos' && listing.status === 'available';

  // Compliance check verification
  const compliance = listing.compliance_checked || { prepared_safe: true, temp_safe: true, no_spoilage: true };
  const allCompliancePassed = compliance.prepared_safe && compliance.temp_safe && compliance.no_spoilage;

  return (
    <div className={`h-full flex flex-col justify-between bg-white rounded-xl border transition-all duration-200 hover:shadow-md overflow-hidden relative ${
      isSos 
        ? 'border-red-400 ring-1 ring-red-400/30' 
        : capacityCheck.isExceeded && listing.status === 'available'
        ? 'border-slate-200 opacity-75 bg-slate-50/40'
        : 'border-slate-200 hover:border-emerald-300 shadow-xs'
    }`}>
      
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Top Badges & Warning Alerts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            {/* Badge 1: Meals Equivalent (Brand Accent Emerald) */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('meals_weight_badge', { meals: listing.meals_estimate, kg: listing.quantity_kg })}</span>
            </span>

            {/* Badge 2: Urgency Countdown */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${timeInfo.badgeColor}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                {timeInfo.text === 'Expired'
                  ? t('expired')
                  : timeInfo.text.replace('left', t('left_suffix'))}
              </span>
            </span>
          </div>

          {/* SOS Alert Bar if urgent */}
          {isSos && (
            <div className="bg-red-50 text-red-800 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>URGENT - Less than 20m remaining</span>
              </span>
            </div>
          )}

          {/* Capacity Warning Bar */}
          {capacityCheck.isExceeded && listing.status === 'available' && (
            <div className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium px-3 py-1 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{capacityCheck.warning}</span>
              </span>
              <span className="text-[11px] text-slate-500">{capacityCheck.recommended}</span>
            </div>
          )}
        </div>

        {/* Food Title & Image */}
        <div className="flex gap-3 min-h-[4rem] items-start my-1">
          {listing.photo_url && (
            <img 
              src={listing.photo_url} 
              alt={listing.food_name} 
              className="w-16 h-16 rounded-lg object-cover border border-slate-100 shrink-0"
            />
          )}

          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
              {listing.food_name}
            </h3>

            {/* Plain Text Line: Category · Score · Verified Safe */}
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
              <span>{t(listing.category || 'Cooked Meal')}</span>
              <span>·</span>
              <span>{t('score')} {urgencyScore}</span>
              <span>·</span>
              {allCompliancePassed ? (
                <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  {t('verified_safe')}
                </span>
              ) : (
                <span className="text-amber-700 font-semibold">{t('unverified')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Location & Distance */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{listing.pickup_location.address}</span>
          </div>
          <span className="font-semibold text-slate-700 shrink-0 ml-2">
            {t('km_away', { dist })}
          </span>
        </div>

        {/* Donor Line */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0">
              D
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 truncate">{listing.donor_name}</div>
              <RatingStars
                rating={listing.donor_rating || listing.donor_reliability || 4.9}
                count={listing.donor_rating_count || 18}
                size="sm"
              />
            </div>
          </div>

          <a 
            href={`tel:${listing.donor_phone}`} 
            className="text-slate-600 hover:text-emerald-700 bg-white p-1.5 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 text-xs font-medium shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{t('call')}</span>
          </a>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        {listing.status === 'available' && (
          <>
            {isBundled && onBundleClick && (
              <button
                onClick={() => onBundleClick(listing)}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>{t('bundle')}</span>
              </button>
            )}

            <button
              onClick={() => onClaim(listing.id)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t('claim_pickup')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {listing.status === 'claimed' && (
          <div className="w-full flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              {t('claimed_by', { name: listing.claimed_by_name || 'Volunteer' })}
            </span>

            {listing.claimed_by === currentUser.id ? (
              <button
                onClick={() => onUpdateStatus(listing.id, 'picked_up')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                {t('mark_picked_up')}
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic">In progress</span>
            )}
          </div>
        )}

        {listing.status === 'picked_up' && (
          <div className="w-full flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              {t('in_transit')}
            </span>

            {listing.claimed_by === currentUser.id ? (
              <button
                onClick={() => onUpdateStatus(listing.id, 'delivered')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                {t('mark_delivered')}
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic">En route</span>
            )}
          </div>
        )}

        {listing.status === 'delivered' && (
          <div className="w-full bg-emerald-50 text-emerald-800 text-xs font-bold py-2 px-3 rounded-lg border border-emerald-200 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('delivered')} (~{listing.meals_estimate} meals)</span>
          </div>
        )}
      </div>

    </div>
  );
}
