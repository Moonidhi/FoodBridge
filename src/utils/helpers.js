import confetti from 'canvas-confetti';

// Calculate distance between two coordinates in km (Haversine formula)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.2;
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10;
}

// Food category presets & auto shelf-life in hours
export const CATEGORY_PRESETS = {
  'Cooked Meal': {
    shelfLifeHours: 3,
    mealsPerKg: 4,
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Hot cooked food, curries, rice, catering surplus'
  },
  'Bakery': {
    shelfLifeHours: 8,
    mealsPerKg: 5,
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Breads, pastries, rolls, baked goods'
  },
  'Packaged': {
    shelfLifeHours: 24,
    mealsPerKg: 3,
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Sealed snacks, canned goods, packed items'
  },
  'Fruits & Vegetables': {
    shelfLifeHours: 12,
    mealsPerKg: 3,
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Fresh produce, raw vegetables, fruit baskets'
  },
  'Dairy': {
    shelfLifeHours: 4,
    mealsPerKg: 4,
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Milk, yogurt, cheese, paneer'
  }
};

// Calculate meals estimate based on quantity & category
export function calculateMealsEstimate(category, quantityKg) {
  const preset = CATEGORY_PRESETS[category] || CATEGORY_PRESETS['Cooked Meal'];
  return Math.round((quantityKg || 0) * preset.mealsPerKg);
}

// Capacity Aware Matching Helpers (Requirement #2)
export function getListingSizeCategory(quantityKg) {
  const kg = parseFloat(quantityKg) || 0;
  if (kg < 8) {
    return { size: 'small', label: 'Small Load (<8kg)', vehicleNeeded: 'Bike' };
  } else if (kg <= 20) {
    return { size: 'medium', label: 'Medium Load (8-20kg)', vehicleNeeded: 'Car' };
  } else {
    return { size: 'bulk', label: 'Bulk Load (>20kg)', vehicleNeeded: 'Van' };
  }
}

export function checkCapacityMismatch(vehicleCapacity = 'bike', quantityKg = 10) {
  const kg = parseFloat(quantityKg) || 0;
  const cap = (vehicleCapacity || 'bike').toLowerCase();

  if (cap.includes('bike') && kg > 10) {
    return { isExceeded: true, warning: 'Exceeds Bike Limit (>10kg)', recommended: 'Car or Van recommended' };
  }
  if (cap.includes('car') && kg > 25) {
    return { isExceeded: true, warning: 'Exceeds Car Limit (>25kg)', recommended: 'Van recommended' };
  }
  return { isExceeded: false, warning: '', recommended: '' };
}

// Suggested-For-You Volunteer Match Score (Requirement #1)
export function computeVolunteerMatchScore(listing, volunteer, activeListings = []) {
  if (!listing || !volunteer || volunteer.role === 'donor') return 0;

  // 1. Proximity (max 40 pts)
  const dist = calculateDistance(
    volunteer.location.lat,
    volunteer.location.lng,
    listing.pickup_location.lat,
    listing.pickup_location.lng
  );
  const distScore = Math.max(0, 40 - dist * 8);

  // 2. Reliability & Star Rating (max 30 pts)
  const rating = volunteer.volunteer_rating || volunteer.reliability_score || 4.9;
  const ratingScore = (rating / 5) * 30;

  // 3. Availability check (max 30 pts): penalty if currently mid-delivery
  const isBusy = activeListings.some(l => l.claimed_by === volunteer.id && (l.status === 'claimed' || l.status === 'picked_up'));
  const availScore = isBusy ? 5 : 30;

  return Math.round(distScore + ratingScore + availScore);
}

// Compute Nearest Neighbor Route Order for Bundles (Requirement #3)
export function computeNearestNeighborRoute(userLocation, items = []) {
  if (!items || items.length === 0) return { route: [], totalDistanceKm: 0 };

  const unvisited = [...items];
  const route = [];
  let currLat = userLocation.lat;
  let currLng = userLocation.lng;
  let totalDist = 0;

  let stepNumber = 1;
  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minD = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const d = calculateDistance(
        currLat,
        currLng,
        unvisited[i].pickup_location.lat,
        unvisited[i].pickup_location.lng
      );
      if (d < minD) {
        minD = d;
        nearestIdx = i;
      }
    }

    const nextItem = unvisited.splice(nearestIdx, 1)[0];
    totalDist += minD;
    currLat = nextItem.pickup_location.lat;
    currLng = nextItem.pickup_location.lng;

    route.push({
      ...nextItem,
      routeOrder: stepNumber,
      legDistanceKm: Math.round(minD * 10) / 10
    });
    stepNumber++;
  }

  return {
    route,
    totalDistanceKm: Math.round(totalDist * 10) / 10
  };
}

// Time remaining calculation
export function getTimeRemaining(expiryIso) {
  const totalMins = Math.round((new Date(expiryIso) - new Date()) / 60000);
  if (totalMins <= 0) {
    return { mins: 0, text: 'Expired', status: 'expired', badgeColor: 'bg-gray-100 text-gray-700 border-gray-300' };
  }
  
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  
  let text = '';
  if (hours > 0) {
    text = `${hours}h ${mins}m left`;
  } else {
    text = `${mins}m left`;
  }
  
  let status = 'fresh';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  
  if (totalMins < 20) {
    status = 'sos';
    badgeColor = 'bg-red-100 text-red-700 border-red-300 animate-pulse font-bold';
  } else if (totalMins < 90) {
    status = 'urgent';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  return { totalMins, hours, mins, text, status, badgeColor };
}

// Compute Urgency Score (0 to 100)
export function computeUrgencyScore(listing, userLat = 12.9716, userLng = 77.5946) {
  const { totalMins } = getTimeRemaining(listing.expiry_time);
  if (totalMins <= 0 || listing.status !== 'available') return 0;

  let timeScore = 0;
  if (totalMins <= 20) {
    timeScore = 50;
  } else if (totalMins <= 180) {
    timeScore = 50 * (1 - (totalMins - 20) / 160);
  } else {
    timeScore = 10 * Math.max(0, 1 - (totalMins - 180) / 720);
  }

  const mealsScore = Math.min(35, (listing.meals_estimate || 20) * 0.35);

  const dist = calculateDistance(
    userLat,
    userLng,
    listing.pickup_location.lat,
    listing.pickup_location.lng
  );
  const proximityScore = Math.max(0, 15 - dist * 2);

  const totalScore = Math.min(100, Math.round(timeScore + mealsScore + proximityScore));
  return totalScore;
}

// Helper for celebratory confetti
export function triggerCelebration() {
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.7 }
  });
}

// Calculate CO2e avoided
export function calculateCo2Avoided(quantityKg) {
  return Math.round((quantityKg || 0) * 2.5 * 10) / 10;
}

// Format timestamp nicely
export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffSecs = Math.floor((now - date) / 1000);

  if (diffSecs < 60) return 'Just now';
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} mins ago`;
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)} hours ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
