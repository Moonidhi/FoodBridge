import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Utensils, 
  Clock, 
  MapPin, 
  Camera, 
  CheckCircle, 
  Info
} from 'lucide-react';
import { CATEGORY_PRESETS, calculateMealsEstimate } from '../utils/helpers';
import ComplianceChecklist from './ComplianceChecklist';
import { useLanguage } from '../context/LanguageContext';

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80'
];

export default function PostFoodModal({ isOpen, onClose, onSubmit, currentUser, initialPreset = null }) {
  const { t } = useLanguage();
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('Cooked Meal');
  const [quantityKg, setQuantityKg] = useState(10);
  const [mealsEstimate, setMealsEstimate] = useState(40);
  const [shelfLifeHours, setShelfLifeHours] = useState(3);
  const [shelfLifeSuggested, setShelfLifeSuggested] = useState(true);
  const [address, setAddress] = useState(currentUser.location?.address || '100ft Road, Indiranagar, Bengaluru');
  const [landmark, setLandmark] = useState('Near Main Entrance');
  const [photoUrl, setPhotoUrl] = useState(PRESET_PHOTOS[0]);
  const [notes, setNotes] = useState('');
  const [pickupStart, setPickupStart] = useState('16:00');
  const [pickupEnd, setPickupEnd] = useState('18:00');

  // Compliance checklist state (Requirement #3)
  const [compliance, setCompliance] = useState({
    prepared_safe: true,
    temp_safe: true,
    no_spoilage: true
  });

  // PRE-FILL from WhatsApp/SMS text intake preset if provided
  useEffect(() => {
    if (initialPreset && isOpen) {
      if (initialPreset.food_name) setFoodName(initialPreset.food_name);
      if (initialPreset.category) setCategory(initialPreset.category);
      if (initialPreset.quantity_kg) setQuantityKg(initialPreset.quantity_kg);
      if (initialPreset.meals_estimate) setMealsEstimate(initialPreset.meals_estimate);
      if (initialPreset.shelfLifeHours) setShelfLifeHours(initialPreset.shelfLifeHours);
      if (initialPreset.pickup_location?.address) setAddress(initialPreset.pickup_location.address);
    }
  }, [initialPreset, isOpen]);

  // AUTO-SUGGEST shelf life & meals estimate on category change
  useEffect(() => {
    if (!initialPreset) {
      const preset = CATEGORY_PRESETS[category] || CATEGORY_PRESETS['Cooked Meal'];
      setShelfLifeHours(preset.shelfLifeHours);
      setShelfLifeSuggested(true);
      setMealsEstimate(calculateMealsEstimate(category, quantityKg));
    }
  }, [category]);

  // Recalculate meals estimate when quantity changes
  useEffect(() => {
    setMealsEstimate(calculateMealsEstimate(category, quantityKg));
  }, [quantityKg, category]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    const preparedAt = new Date();
    const expiryTime = new Date(preparedAt.getTime() + shelfLifeHours * 60 * 60 * 1000).toISOString();

    const newListing = {
      id: `lst_${Date.now()}`,
      donor_id: currentUser.id,
      donor_name: currentUser.name,
      donor_phone: currentUser.phone || '+91 98765 43210',
      donor_reliability: currentUser.reliability_score || 4.9,
      donor_rating: currentUser.donor_rating || 4.9,
      donor_rating_count: currentUser.donor_rating_count || 18,
      food_name: foodName,
      category,
      quantity_kg: parseFloat(quantityKg),
      meals_estimate: parseInt(mealsEstimate),
      pickup_location: {
        lat: 12.9784 + (Math.random() * 0.005 - 0.0025),
        lng: 77.6408 + (Math.random() * 0.005 - 0.0025),
        address,
        landmark
      },
      prepared_at: preparedAt.toISOString(),
      expiry_time: expiryTime,
      pickup_window_start: pickupStart,
      pickup_window_end: pickupEnd,
      photo_url: photoUrl,
      status: 'available',
      created_at: new Date().toISOString(),
      notes,
      compliance_checked: compliance // Saved compliance state
    };

    onSubmit(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-float">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl tracking-tight">{t('post_modal_title')}</h2>
              <p className="text-xs text-emerald-100 font-medium">Connect with nearby volunteers to rescue fresh food</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Food Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('food_name_label')} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Paneer Gravy, Rice & Parathas (40 Portions)"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {Object.keys(CATEGORY_PRESETS).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_PRESETS[cat].icon} {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity & MEALS ESTIMATE CONVERTER */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-600" />
                Meals-Equivalent Conversion Engine
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                1 kg {category} ≈ {CATEGORY_PRESETS[category]?.mealsPerKg || 4} meals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity (in Kilograms)
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Meals Saved
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={mealsEstimate}
                    onChange={(e) => setMealsEstimate(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-emerald-300 rounded-xl px-4 py-2 text-sm font-extrabold text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">meals</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-800 font-medium">
              Volunteers & NGOs see meal counts instead of raw weight to quickly gauge community impact.
            </p>
          </div>

          {/* AUTO-SUGGESTED SHELF LIFE / EXPIRY WINDOW */}
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Safe Shelf-Life & Expiry Window
              </span>
              {shelfLifeSuggested && (
                <span className="text-[11px] font-bold text-amber-800 bg-white px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Auto-suggested preset
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="36"
                value={shelfLifeHours}
                onChange={(e) => {
                  setShelfLifeHours(parseInt(e.target.value));
                  setShelfLifeSuggested(false);
                }}
                className="flex-1 accent-amber-600 cursor-pointer"
              />
              <div className="bg-white font-extrabold text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-sm min-w-[90px] text-center">
                {shelfLifeHours} {shelfLifeHours === 1 ? 'Hour' : 'Hours'}
              </div>
            </div>

            <div className="text-[11px] text-amber-800 font-medium flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                Standard safety protocol: <strong>{category}</strong> is best consumed within {CATEGORY_PRESETS[category]?.shelfLifeHours} hours. You can adjust if refrigerated.
              </span>
            </div>
          </div>

          {/* COMPLIANCE CHECKLIST COMPONENT - REQUIREMENT #3 */}
          <ComplianceChecklist
            category={category}
            compliance={compliance}
            onChange={(updated) => setCompliance(updated)}
          />

          {/* Pickup Location & Landmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Pickup Location Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Landmark / Gate Info
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Back entrance, Gate 2, Kitchen counter"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Time Window */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup Start Time
              </label>
              <input
                type="time"
                value={pickupStart}
                onChange={(e) => setPickupStart(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup End Time
              </label>
              <input
                type="time"
                value={pickupEnd}
                onChange={(e) => setPickupEnd(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Photo Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              Select Photo Preview
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {PRESET_PHOTOS.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Preset ${idx}`}
                  onClick={() => setPhotoUrl(img)}
                  className={`w-16 h-16 rounded-xl object-cover border-2 cursor-pointer transition-all ${
                    photoUrl === img ? 'border-emerald-600 scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Handling / Packaging Notes
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Packed in clean foil containers. Vehicle required for 20kg+ load."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-200 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t('submit_post')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
