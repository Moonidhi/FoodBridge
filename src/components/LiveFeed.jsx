import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  MapPin, 
  Search, 
  Filter, 
  Layers, 
  UtensilsCrossed, 
  Clock, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import FoodCard from './FoodCard';
import SuggestedMatchBanner from './SuggestedMatchBanner';
import QuickWhatsAppIntake from './QuickWhatsAppIntake';
import { useLanguage } from '../context/LanguageContext';
import { 
  computeUrgencyScore, 
  calculateDistance, 
  getTimeRemaining,
  computeVolunteerMatchScore 
} from '../utils/helpers';

export default function LiveFeed({ 
  listings, 
  currentUser, 
  onClaim, 
  onUpdateStatus, 
  onOpenPostModal,
  onOpenBundleModal,
  userLocation = { lat: 12.9750, lng: 77.6380 }
}) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('urgency'); // 'urgency', 'distance', 'time', 'meals'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time ticking counter (5s live urgency score tick)
  const [tick, setTick] = useState(0);
  const feedTopRef = useRef(null);
  const previousSosIds = useRef(new Set());

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Compute Single Best-Fit Suggested Listing Match for current volunteer
  const suggestedMatchListing = useMemo(() => {
    if (currentUser.role === 'donor') return null;
    const available = listings.filter(l => l.status === 'available');
    if (available.length === 0) return null;

    let bestListing = null;
    let maxScore = -1;

    for (const listing of available) {
      const score = computeVolunteerMatchScore(listing, currentUser, listings);
      if (score > maxScore) {
        maxScore = score;
        bestListing = listing;
      }
    }

    return maxScore >= 35 ? bestListing : null;
  }, [listings, currentUser]);

  // Detect nearby bundling opportunities (< 1.2 km radius between available listings)
  const bundleGroups = useMemo(() => {
    const available = listings.filter(l => l.status === 'available');
    const bundles = [];
    const usedIds = new Set();

    for (let i = 0; i < available.length; i++) {
      if (usedIds.has(available[i].id)) continue;
      const group = [available[i]];
      for (let j = i + 1; j < available.length; j++) {
        if (usedIds.has(available[j].id)) continue;
        const d = calculateDistance(
          available[i].pickup_location.lat,
          available[i].pickup_location.lng,
          available[j].pickup_location.lat,
          available[j].pickup_location.lng
        );
        if (d <= 1.2) {
          group.push(available[j]);
        }
      }
      if (group.length >= 2) {
        group.forEach(item => usedIds.add(item.id));
        bundles.push(group);
      }
    }
    return bundles;
  }, [listings]);

  // Filter and sort listings
  const processedListings = useMemo(() => {
    let result = listings.filter(l => l.status === 'available');

    if (selectedCategory !== 'All') {
      result = result.filter(l => l.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        l =>
          l.food_name.toLowerCase().includes(q) ||
          l.donor_name.toLowerCase().includes(q) ||
          l.pickup_location.address.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'urgency') {
        const scoreA = computeUrgencyScore(a, userLocation.lat, userLocation.lng);
        const scoreB = computeUrgencyScore(b, userLocation.lat, userLocation.lng);
        return scoreB - scoreA;
      } else if (sortBy === 'distance') {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.pickup_location.lat, a.pickup_location.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.pickup_location.lat, b.pickup_location.lng);
        return distA - distB;
      } else if (sortBy === 'time') {
        const timeA = getTimeRemaining(a.expiry_time).totalMins;
        const timeB = getTimeRemaining(b.expiry_time).totalMins;
        return timeA - timeB;
      } else if (sortBy === 'meals') {
        return (b.meals_estimate || 0) - (a.meals_estimate || 0);
      }
      return 0;
    });

    return result;
  }, [listings, selectedCategory, sortBy, searchQuery, userLocation, tick]);

  // SOS auto-scroll and jump effect
  useEffect(() => {
    const currentSosIds = new Set(
      processedListings
        .filter(l => getTimeRemaining(l.expiry_time).totalMins <= 20)
        .map(l => l.id)
    );

    let newlySos = false;
    currentSosIds.forEach(id => {
      if (!previousSosIds.current.has(id)) {
        newlySos = true;
      }
    });

    if (newlySos && feedTopRef.current) {
      feedTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    previousSosIds.current = currentSosIds;
  }, [processedListings]);

  const categories = ['All', 'Cooked Meal', 'Bakery', 'Packaged', 'Fruits & Vegetables', 'Dairy'];

  const totalAvailableMeals = useMemo(() => {
    return processedListings.reduce((sum, item) => sum + (item.meals_estimate || 0), 0);
  }, [processedListings]);

  return (
    <div ref={feedTopRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      
      {/* Hero Section */}
      <div className="bg-emerald-900 rounded-xl p-6 sm:p-7 text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          
          {/* Subtle status dot + text */}
          <div className="flex items-center gap-2 text-xs text-emerald-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>{t('live_urgency_active')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('feed_hero_title')}
          </h1>
          
          <p className="text-emerald-100 text-sm font-medium">
            {t('feed_hero_subtitle')}
          </p>

          {/* At most 2 clean stat chips */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium">
            <div className="bg-emerald-800/80 px-3 py-1.5 rounded-lg border border-emerald-700 flex items-center gap-1.5">
              <UtensilsCrossed className="w-4 h-4 text-emerald-300" />
              <span>{t('meals_available', { count: totalAvailableMeals })}</span>
            </div>

            <div className="bg-emerald-800/80 px-3 py-1.5 rounded-lg border border-emerald-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>{t('area_location')}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Suggested For You Match Banner */}
      {suggestedMatchListing && (
        <SuggestedMatchBanner
          listing={suggestedMatchListing}
          currentUser={currentUser}
          onClaim={onClaim}
        />
      )}

      {/* SUBTLE DISMISSIBLE INLINE STRIP FOR BUNDLE SUGGESTION */}
      {bundleGroups.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2 truncate">
            <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">
              {t('nearby_pickups_bundle', {
                count: bundleGroups[0].length,
                dist: '1.2',
                meals: bundleGroups[0].reduce((s, i) => s + i.meals_estimate, 0)
              })}
            </span>
          </div>

          <button
            onClick={() => onOpenBundleModal(bundleGroups[0])}
            className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 shrink-0 hover:underline cursor-pointer"
          >
            <span>{t('view_bundle')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* REQUIREMENT #1: WHATSAPP/SMS-STYLE FALLBACK POSTING (Simulated Integration) */}
      <QuickWhatsAppIntake onParseSuccess={(parsed) => onOpenPostModal(parsed)} />

      {/* Filter, Search & Sort Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs font-semibold">
            <span className="text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Sort:
            </span>
            
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setSortBy('urgency')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  sortBy === 'urgency' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{t('urgency_score')}</span>
              </button>

              <button
                onClick={() => setSortBy('distance')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  sortBy === 'distance' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('nearest')}</span>
              </button>

              <button
                onClick={() => setSortBy('time')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  sortBy === 'time' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-red-500" />
                <span>{t('expiring_soon')}</span>
              </button>

              <button
                onClick={() => setSortBy('meals')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  sortBy === 'meals' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('most_meals')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          {categories.map((cat) => {
            const catKeyMap = {
              'All': 'all_categories',
              'Cooked Meal': 'cooked_meal',
              'Bakery': 'bakery',
              'Packaged': 'packaged',
              'Fruits & Vegetables': 'fruits_veg',
              'Dairy': 'dairy'
            };
            const label = t(catKeyMap[cat] || cat);

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Listings Grid (Framer Motion Layout Animations) */}
      {processedListings.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {processedListings.map((listing) => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="h-full"
              >
                <FoodCard
                  listing={listing}
                  currentUser={currentUser}
                  onClaim={onClaim}
                  onUpdateStatus={onUpdateStatus}
                  onBundleClick={(item) => onOpenBundleModal([item])}
                  isBundled={bundleGroups.some(g => g.some(x => x.id === listing.id))}
                  userLocation={userLocation}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl p-10 text-center border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-800 text-base">No surplus listings match your filters</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Try resetting your category or search filters, or post a new food donation.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}
