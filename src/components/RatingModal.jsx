import React, { useState } from 'react';
import { X, Star, Heart, CheckCircle2, Award, Sparkles } from 'lucide-react';
import RatingStars from './RatingStars';

export default function RatingModal({ isOpen, onClose, targetUser, listing, roleRating, onSubmitRating }) {
  const [selectedStars, setSelectedStars] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');

  if (!isOpen || !targetUser) return null;

  const isRatingDonor = roleRating === 'donor';

  const availableTags = isRatingDonor
    ? ['Clean Packaging', 'Ready on Time', 'Hygiene Verified', 'Friendly Staff']
    : ['Fast Pickup', 'Careful Handling', 'Great Communication', 'Reliable'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitRating({
      targetUserId: targetUser.id,
      roleRating,
      stars: selectedStars,
      tags: selectedTags,
      comment
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-float">
        
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 text-white">
            <Award className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold text-emerald-100 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Delivery Completed</span>
          </div>

          <h3 className="font-extrabold text-xl">
            {isRatingDonor ? `Rate Donor: ${targetUser.name}` : `Rate Volunteer: ${targetUser.name}`}
          </h3>
          <p className="text-xs text-emerald-100 font-medium mt-0.5">
            {isRatingDonor 
              ? 'Was the food packaged properly, hygienic, and ready on time?' 
              : 'Was the volunteer prompt and careful with the food rescue?'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Star Selection */}
          <div className="text-center space-y-2">
            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Select Star Rating
            </label>
            <div className="flex justify-center">
              <RatingStars
                rating={selectedStars}
                size="lg"
                interactive={true}
                onRate={(stars) => setSelectedStars(stars)}
                showCount={false}
              />
            </div>
            <div className="text-sm font-bold text-emerald-700">
              {selectedStars === 5 ? 'Outstanding Experience!' : selectedStars === 4 ? 'Very Good' : 'Satisfactory'}
            </div>
          </div>

          {/* Quick Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Quick Highlights
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedTags.includes(tag)
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Optional Note / Feedback
            </label>
            <textarea
              rows="2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Great insulated packing, food was steaming hot!"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Two-Way Rating</span>
          </button>
        </form>

      </div>
    </div>
  );
}
