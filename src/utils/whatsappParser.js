/**
 * WhatsApp / SMS Natural Text Intake Parser (Simulated Integration)
 * Parses freeform natural language text from non-tech-savvy donors.
 *
 * Example Inputs:
 *  - "5kg rice, Block A hostel, ready now"
 *  - "cooked meal 20 servings, Green Leaf Bistro, ready in 30 min"
 *  - "12 kg biryani, Indiranagar main road, ready in 1 hr"
 *  - "fresh bread 15 loaves, Baker Street, ready now"
 */
export function parseWhatsAppText(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const input = text.trim();
  if (!input) return null;

  const lower = input.toLowerCase();

  // 1. Extract Quantity (kg) & Estimated Meals
  let quantity_kg = 5;
  let meals_estimate = 20;

  const kgMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos|kilograms)/i);
  const servingsMatch = lower.match(/(\d+)\s*(?:servings|meals|portions|plates|boxes|loaves|packets|people)/i);
  const plainNumMatch = lower.match(/\b(\d+)\b/);

  if (kgMatch) {
    quantity_kg = parseFloat(kgMatch[1]);
    meals_estimate = Math.round(quantity_kg * 4);
  } else if (servingsMatch) {
    meals_estimate = parseInt(servingsMatch[1], 10);
    quantity_kg = Math.max(1, Math.round(meals_estimate / 4));
  } else if (plainNumMatch) {
    const val = parseInt(plainNumMatch[1], 10);
    if (val > 0) {
      if (val <= 30) {
        quantity_kg = val;
        meals_estimate = val * 4;
      } else {
        meals_estimate = val;
        quantity_kg = Math.round(val / 4);
      }
    }
  }

  // 2. Extract Category via Keyword Recognition
  let category = 'Cooked Meal';
  if (/rice|dal|curry|biryani|meal|sambar|roti|sabzi|cooked|food|thali|dosa|idli|pasta|noodles/i.test(lower)) {
    category = 'Cooked Meal';
  } else if (/bread|cake|pastry|bun|bakery|donut|puff|cookie|muffin|croissant/i.test(lower)) {
    category = 'Bakery';
  } else if (/milk|paneer|curd|cheese|butter|yogurt|dairy/i.test(lower)) {
    category = 'Dairy';
  } else if (/apple|fruit|veg|vegetable|banana|tomato|salad|orange|mango/i.test(lower)) {
    category = 'Fruits & Vegetables';
  } else if (/packet|biscuit|chips|snack|box|canned|packaged/i.test(lower)) {
    category = 'Packaged';
  }

  // 3. Extract Time Offset ("ready now" vs "ready in X min/hr")
  let shelfLifeHours = 4;
  const inMinMatch = lower.match(/ready in\s*(\d+)\s*(?:min|mins|minutes)/i);
  const inHrMatch = lower.match(/ready in\s*(\d+)\s*(?:hr|hrs|hours|hour)/i);

  if (inMinMatch) {
    const mins = parseInt(inMinMatch[1], 10);
    shelfLifeHours = Math.max(1, Math.round(mins / 60) + 3);
  } else if (inHrMatch) {
    const hrs = parseInt(inHrMatch[1], 10);
    shelfLifeHours = Math.max(1, hrs + 3);
  }

  // 4. Extract Food Title & Address
  let food_name = input;
  let location_address = 'Indiranagar Main Road';

  const parts = input.split(',').map(p => p.trim());
  if (parts.length >= 1) {
    food_name = parts[0];
  }
  if (parts.length >= 2) {
    const locCandidate = parts.find((p, idx) => {
      if (idx === 0) return false;
      const pl = p.toLowerCase();
      return !pl.includes('ready') && !pl.includes('kg') && !pl.includes('servings');
    });

    if (locCandidate) {
      location_address = locCandidate;
    }
  }

  // Capitalize title
  food_name = food_name.charAt(0).toUpperCase() + food_name.slice(1);

  return {
    food_name,
    category,
    quantity_kg,
    meals_estimate,
    pickup_location: {
      address: location_address,
      lat: 12.9750 + (Math.random() - 0.5) * 0.015,
      lng: 77.6380 + (Math.random() - 0.5) * 0.015
    },
    shelfLifeHours,
    rawText: input
  };
}
