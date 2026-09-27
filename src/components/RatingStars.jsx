import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ 
  rating = 5, 
  count = 0, 
  size = 'sm', 
  interactive = false, 
  onRate,
  showCount = true 
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const currentRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= currentRating;
          const isHalf = !isFilled && star - 0.5 <= currentRating;

          return (
            <button
              key={star}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && onRate && onRate(star)}
              className={`${interactive ? 'cursor-pointer transform hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : isHalf
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-slate-300 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showCount && (
        <span className="text-xs font-bold text-slate-700 ml-0.5">
          {Number(rating).toFixed(1)}
          {count > 0 && <span className="text-[10px] text-slate-400 font-medium ml-0.5">({count})</span>}
        </span>
      )}
    </div>
  );
}
