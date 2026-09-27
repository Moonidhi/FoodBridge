import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  en: {
    // Header & Nav
    live_pickups: "Live Pickups",
    live_map: "Live Map",
    impact_dashboard: "Impact Dashboard",
    my_food_posts: "My Food Posts",
    my_pickups: "My Pickups",
    post_surplus_food: "Post Surplus Food",
    switch_role: "Switch Role",
    logo_subtitle: "Community Food Rescue",
    ngo_admin: "NGO Admin",
    food_donor: "Food Donor",
    volunteer: "Volunteer",
    switch_user_title: "Switch Role / User",
    
    // Quick WhatsApp Intake
    quick_whatsapp_title: "Quick Post via WhatsApp / SMS",
    quick_whatsapp_subtitle: "Simulated WhatsApp Business API intake for busy & non-tech-savvy staff",
    whatsapp_placeholder: "e.g., 5kg rice, Block A hostel, ready now",
    parse_and_review: "Parse & Review Form",
    sample_templates: "Try Sample Messages:",
    simulated_api: "Simulated WhatsApp Business API",
    prefills_for_review: "Pre-fills form for review",

    // Banners & Strips
    nearby_pickups_bundle: "{{count}} nearby pickups available within {{dist}} km radius (~{{meals}} meals)",
    view_bundle: "View bundle",
    live_urgency_active: "Live Urgency Engine Active",
    feed_hero_title: "Surplus Food Rescue Feed",
    feed_hero_subtitle: "Priority-scored food donations near you, updated in real time.",
    meals_available: "{{count}} Meals Available",
    area_location: "Indiranagar Area",
    suggested_for_you: "Suggested for You",
    why_suggested: "Closest available volunteer, 4.8★",
    sos_escalation: "SOS ESCALATION ({{count}} Urgent)",
    sos_subtext: "Expiring in less than 20 minutes!",
    claim_sos_pickup: "Claim SOS Pickup",
    meals_at_risk: "~{{meals}} meals at risk!",

    // Feed & Filters
    search_placeholder: "Search food name, donor, or location...",
    all_categories: "All",
    cooked_meal: "Cooked Meal",
    bakery: "Bakery",
    packaged: "Packaged",
    fruits_veg: "Fruits & Vegetables",
    dairy: "Dairy",
    'Cooked Meal': "Cooked Meal",
    'Bakery': "Bakery",
    'Packaged': "Packaged",
    'Fruits & Vegetables': "Fruits & Vegetables",
    'Dairy': "Dairy",
    urgency_score: "Urgency Score",
    nearest: "Nearest",
    expiring_soon: "Expiring Soon",
    most_meals: "Most Meals",
    sort_label: "Sort:",
    
    // Cards & Actions
    meals_estimate: "~{{count}} Meals",
    meals_weight_badge: "~{{meals}} Meals ({{kg}}kg)",
    km_away: "{{dist}} km away",
    left_suffix: "left",
    expired: "Expired",
    verified_safe: "Verified Safe",
    unverified: "Unverified",
    claim_pickup: "Claim Pickup",
    mark_picked_up: "Mark Picked Up",
    mark_delivered: "Mark Delivered",
    delivered: "Delivered",
    claimed_by: "Claimed by {{name}}",
    in_transit: "In Transit",
    in_progress: "In progress",
    en_route: "En route",
    bundle: "Bundle",
    sos_urgent: "SOS URGENT",
    call: "Call",
    score: "Score",
    
    // Posting Modal
    post_modal_title: "Broadcast Surplus Food Listing",
    food_name_label: "Food Title / Item Description",
    category_label: "Category",
    quantity_label: "Weight (kg)",
    meals_label: "Estimated Meals",
    location_label: "Pickup Location Address",
    shelf_life_label: "Expiry Window (Hours)",
    submit_post: "Broadcast Listing to Volunteers",

    // Dashboard & Stats
    total_meals_saved: "Total Meals Saved",
    co2_avoided: "CO₂e Emissions Avoided",
    completed_deliveries: "Completed Deliveries",
    active_pickups: "Active Pickups",
    leaderboard_title: "Weekly Leaderboard & Streaks",
    top_volunteers: "Top Volunteers",
    top_donors: "Top Donors"
  },

  hi: {
    // Header & Nav
    live_pickups: "लाइव पिकअप",
    live_map: "लाइव मैप",
    impact_dashboard: "प्रभाव डैशबोर्ड",
    my_food_posts: "मेरी भोजन पोस्ट",
    my_pickups: "मेरे पिकअप",
    post_surplus_food: "अतिरिक्त भोजन पोस्ट करें",
    switch_role: "भूमिका बदलें",
    logo_subtitle: "समुदाय भोजन बचाव",
    ngo_admin: "एनजीओ व्यवस्थापक",
    food_donor: "भोजन दाता",
    volunteer: "स्वयंसेवक",
    switch_user_title: "भूमिका / उपयोगकर्ता बदलें",
    
    // Quick WhatsApp Intake
    quick_whatsapp_title: "व्हाट्सएप / एसएमएस त्वरित पोस्ट",
    quick_whatsapp_subtitle: "गैर-तकनीकी कर्मचारियों के लिए व्हाट्सएप बिजनेस एपीआई सिमुलेशन",
    whatsapp_placeholder: "उदा: 5 किग्रा चावल, ब्लॉक ए हॉस्टल, अभी तैयार",
    parse_and_review: "पार्स करें और समीक्षा करें",
    sample_templates: "नमूना संदेश आज़माएं:",
    simulated_api: "सिम्युलेटेड व्हाट्सएप बिजनेस एपीआई",
    prefills_for_review: "समीक्षा के लिए फॉर्म भरता है",

    // Banners & Strips
    nearby_pickups_bundle: "{{dist}} किमी क्षेत्र में {{count}} पिकअप उपलब्ध हैं (~{{meals}} भोजन)",
    view_bundle: "बंडल देखें",
    live_urgency_active: "लाइव आपातकालीन इंजन सक्रिय",
    feed_hero_title: "अतिरिक्त भोजन बचाव फीड",
    feed_hero_subtitle: "आपके निकट प्राथमिकता-अंक वाले भोजन दान, वास्तविक समय में अपडेटेड।",
    meals_available: "{{count}} भोजन उपलब्ध",
    area_location: "इंद्रा नगर क्षेत्र",
    suggested_for_you: "आपके लिए सुझाया गया",
    why_suggested: "निकटतम उपलब्ध स्वयंसेवक, 4.8★",
    sos_escalation: "एसओएस आपातकाल ({{count}} अति आवश्यक)",
    sos_subtext: "20 मिनट से भी कम समय बचा है!",
    claim_sos_pickup: "एसओएस पिकअप स्वीकार करें",
    meals_at_risk: "~{{meals}} भोजन जोखिम में!",

    // Feed & Filters
    search_placeholder: "भोजन का नाम, दाता या स्थान खोजें...",
    all_categories: "सभी",
    cooked_meal: "पका हुआ भोजन",
    bakery: "बेकरी",
    packaged: "पैक्ड भोजन",
    fruits_veg: "फल और सब्जियां",
    dairy: "डेयरी",
    'Cooked Meal': "पका हुआ भोजन",
    'Bakery': "बेकरी",
    'Packaged': "पैक्ड भोजन",
    'Fruits & Vegetables': "फल और सब्जियां",
    'Dairy': "डेयरी",
    urgency_score: "आपातकालीन स्कोर",
    nearest: "निकटतम",
    expiring_soon: "शीघ्र समाप्त",
    most_meals: "सर्वाधिक भोजन",
    sort_label: "क्रमबद्ध करें:",
    
    // Cards & Actions
    meals_estimate: "~{{count}} भोजन",
    meals_weight_badge: "~{{meals}} भोजन ({{kg}} किग्रा)",
    km_away: "{{dist}} किमी दूर",
    left_suffix: "शेष",
    expired: "समाप्त",
    verified_safe: "सुरक्षित सत्यापित",
    unverified: "अत्यापित",
    claim_pickup: "पिकअप स्वीकार करें",
    mark_picked_up: "पिकअप पूरा हुआ",
    mark_delivered: "डिलीवरी पूर्ण की",
    delivered: "वितरित",
    claimed_by: "{{name}} द्वारा स्वीकृत",
    in_transit: "मार्ग में है",
    in_progress: "प्रगति पर है",
    en_route: "मार्ग में है",
    bundle: "बंडल",
    sos_urgent: "अति आवश्यक (SOS)",
    call: "कॉल करें",
    score: "स्कोर",

    // Posting Modal
    post_modal_title: "अतिरिक्त भोजन प्रसारित करें",
    food_name_label: "भोजन का नाम / विवरण",
    category_label: "श्रेणी",
    quantity_label: "वजन (किग्रा)",
    meals_label: "अनुमानित भोजन संख्या",
    location_label: "पिकअप स्थान / पता",
    shelf_life_label: "समाप्ति समय (घंटे)",
    submit_post: "स्वयंsevकों को प्रसारित करें",

    // Dashboard & Stats
    total_meals_saved: "कुल बचाए गए भोजन",
    co2_avoided: "बचाया गया CO₂e उत्सर्जन",
    completed_deliveries: "पूर्ण डिलीवरियां",
    active_pickups: "सक्रिय पिकअप",
    leaderboard_title: "साप्ताहिक लीडरबोर्ड और स्ट्रिक्स",
    top_volunteers: "शीर्ष स्वयंसेवक",
    top_donors: "शीर्ष दाता"
  },

  ta: {
    // Header & Nav
    live_pickups: "நேரலை பிக்கப்",
    live_map: "நேரலை வரைபடம்",
    impact_dashboard: "தாக்க டாஷ்போர்டு",
    my_food_posts: "என் உணவு பதிவுகள்",
    my_pickups: "என் பிக்கப்கள்",
    post_surplus_food: "கூடுதல் உணவு பதிவிடவும்",
    switch_role: "பங்கு மாறவும்",
    logo_subtitle: "சமூக உணவு மீட்பு",
    ngo_admin: "அரசுசாரா அமைப்பாளர்",
    food_donor: "உணவு கொடையாளர்",
    volunteer: "தொண்டர்",
    switch_user_title: "பங்கு / பயனரை மாற்றவும்",
    
    // Quick WhatsApp Intake
    quick_whatsapp_title: "வாட்ஸ்அப் / SMS விரைவு பதிவு",
    quick_whatsapp_subtitle: "வாட்ஸ்அப் பிசினஸ் API மாதிரி கட்டமைப்பு",
    whatsapp_placeholder: "எ.கா: 5 கிலோ சாதம், பிளாக் A விடுதி, தயார்",
    parse_and_review: "பரிசீலித்து சரிபார்க்கவும்",
    sample_templates: "மாதிரி செய்திகள்:",
    simulated_api: "வாட்ஸ்அப் பிசினஸ் API மாதிரி",
    prefills_for_review: "சரிபார்க்க படிவம் நிரப்புகிறது",

    // Banners & Strips
    nearby_pickups_bundle: "{{dist}} கிமீ சுற்றளவில் {{count}} பிக்கப்கள் உள்ளன (~{{meals}} உணவுகள்)",
    view_bundle: "பண்டில் பார்க்க",
    live_urgency_active: "நேரலை அவசர அமைப்பு இயங்குகிறது",
    feed_hero_title: "கூடுதல் உணவு மீட்பு ஊட்டம்",
    feed_hero_subtitle: "உங்களுக்கு அருகிலுள்ள முன்னுரிமை உணவு நன்கொடைகள்.",
    meals_available: "{{count}} உணவுகள் உள்ளன",
    area_location: "இந்திரா நகர் பகுதி",
    suggested_for_you: "உங்களுக்கான பரிந்துரை",
    why_suggested: "அருகிலுள்ள தொண்டர், 4.8★",
    sos_escalation: "SOS அவசர பிக்கப் ({{count}} அவசரம்)",
    sos_subtext: "20 நிமிடங்களுக்கும் குறைவாகவே உள்ளது!",
    claim_sos_pickup: "SOS பிக்கப் ஏற்கவும்",
    meals_at_risk: "~{{meals}} உணவுகள் ஆபத்தில்!",

    // Feed & Filters
    search_placeholder: "உணவு பெயர், கொடையாளர் தேடுக...",
    all_categories: "அனைத்தும்",
    cooked_meal: "சமைத்த உணவு",
    bakery: "பேக்கரி",
    packaged: "பாக்கெட் உணவு",
    fruits_veg: "பழங்கள் & காய்கறிகள்",
    dairy: "பால் பொருட்கள்",
    'Cooked Meal': "சமைத்த உணவு",
    'Bakery': "பேக்கரி",
    'Packaged': "பாக்கெட் உணவு",
    'Fruits & Vegetables': "பழங்கள் & காய்கறிகள்",
    'Dairy': "பால் பொருட்கள்",
    urgency_score: "அவசர மதிப்பெண்",
    nearest: "அருகில் உள்ளவை",
    expiring_soon: "விரைவில் காலாவதி",
    most_meals: "அதிக உணவுகள்",
    sort_label: "வரிசைப்படுத்து:",
    
    // Cards & Actions
    meals_estimate: "~{{count}} உணவுகள்",
    meals_weight_badge: "~{{meals}} உணவுகள் ({{kg}} கிலோ)",
    km_away: "{{dist}} கிமீ தொலைவில்",
    left_suffix: "மீதமுள்ளது",
    expired: "காலாவதியானது",
    verified_safe: "பாதுகாப்பானது",
    unverified: "சரிபார்க்கப்படவில்லை",
    claim_pickup: "பிக்கப் ஏற்கவும்",
    mark_picked_up: "பிக்கப் முடிந்தது",
    mark_delivered: "டெலிவரி முடிந்தது",
    delivered: "வழங்கப்பட்டது",
    claimed_by: "{{name}} ஏற்றுக்கொண்டார்",
    in_transit: "பயணத்தில் உள்ளது",
    in_progress: "செயல்பாட்டில் உள்ளது",
    en_route: "பயணத்தில் உள்ளது",
    bundle: "பண்டில்",
    sos_urgent: "அவசர பிக்கப் (SOS)",
    call: "அழைக்கவும்",
    score: "மதிப்பெண்",

    // Posting Modal
    post_modal_title: "கூடுதல் உணவை அறிவிக்கவும்",
    food_name_label: "உணவு பெயர் / விவரம்",
    category_label: "வகை",
    quantity_label: "எடை (கிலோ)",
    meals_label: "உணவு எண்ணிக்கை",
    location_label: "பிக்கப் முகவரி",
    shelf_life_label: "காலாவதி நேரம் (மணி)",
    submit_post: "தானாக முன்வருவோருக்கு அறிவிக்கவும்",

    // Dashboard & Stats
    total_meals_saved: "சேமிக்கப்பட்ட உணவுகள்",
    co2_avoided: "தடுக்கப்பட்ட CO₂e மாசு",
    completed_deliveries: "நிறைவுற்ற விநியோகங்கள்",
    active_pickups: "செயலில் உள்ள பிக்கப்",
    leaderboard_title: "வாராந்திர முன்னிலைப் பட்டியல்",
    top_volunteers: "சிறந்த தொண்டர்கள்",
    top_donors: "சிறந்த கொடையாளர்கள்"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('foodbridge_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('foodbridge_lang', lang);
  }, [lang]);

  const t = (key, params = {}) => {
    const dict = translations[lang] || translations.en;
    let str = dict[key] || translations.en[key] || key;
    
    // Replace {{param}} tokens
    Object.keys(params).forEach(p => {
      str = str.replace(new RegExp(`{{${p}}}`, 'g'), params[p]);
    });
    
    return str;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
