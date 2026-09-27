// Realistic seed users with two-way rating fields, streaks, and vehicle capacity
export const INITIAL_USERS = [
  {
    id: 'usr_donor_1',
    name: 'Green Leaf Bistro',
    role: 'donor',
    orgName: 'Green Leaf Gourmet Bistro',
    phone: '+91 98765 43210',
    location: { lat: 12.9784, lng: 77.6408, address: '100ft Road, Indiranagar' },
    donor_rating: 4.9,
    donor_rating_count: 24,
    volunteer_rating: 5.0,
    volunteer_rating_count: 0,
    reliability_score: 4.9,
    completed_pickups: 42,
    streak_count: 5,
    vehicle_capacity: 'Van (bulk)',
    avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_donor_2',
    name: 'Grand Palace Catering',
    role: 'donor',
    orgName: 'Grand Palace Convention Center',
    phone: '+91 98123 76543',
    location: { lat: 12.9722, lng: 77.6360, address: 'Old Airport Road, Kodihalli' },
    donor_rating: 4.8,
    donor_rating_count: 18,
    volunteer_rating: 4.9,
    volunteer_rating_count: 0,
    reliability_score: 4.8,
    completed_pickups: 28,
    streak_count: 3,
    vehicle_capacity: 'Van (bulk)',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_volunteer_1',
    name: 'Priya Sharma',
    role: 'volunteer',
    orgName: 'Individual Volunteer',
    phone: '+91 99887 76655',
    location: { lat: 12.9750, lng: 77.6380, address: 'Indiranagar Metro Station' },
    donor_rating: 5.0,
    donor_rating_count: 0,
    volunteer_rating: 4.95,
    volunteer_rating_count: 32,
    reliability_score: 5.0,
    completed_pickups: 34,
    streak_count: 6,
    vehicle_capacity: 'Bike (small)', // Capacity < 10kg
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_ngo_1',
    name: 'Annakshetra Foundation',
    role: 'ngo',
    orgName: 'Annakshetra Food Rescue NGO',
    phone: '+91 94433 22110',
    location: { lat: 12.9690, lng: 77.6450, address: 'Domlur Layout Center' },
    donor_rating: 4.9,
    donor_rating_count: 5,
    volunteer_rating: 4.98,
    volunteer_rating_count: 128,
    reliability_score: 4.95,
    completed_pickups: 156,
    streak_count: 12,
    vehicle_capacity: 'Van (bulk)', // Bulk capacity 50+ kg
    avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_volunteer_2',
    name: 'Rohan Mehta',
    role: 'volunteer',
    orgName: 'Youth Food Rescuers',
    phone: '+91 91234 56789',
    location: { lat: 12.9810, lng: 77.6320, address: 'CMH Road Indiranagar' },
    donor_rating: 4.7,
    donor_rating_count: 0,
    volunteer_rating: 4.8,
    volunteer_rating_count: 14,
    reliability_score: 4.75,
    completed_pickups: 19,
    streak_count: 2,
    vehicle_capacity: 'Car (medium)', // Capacity < 25kg
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

// Helper to compute dynamic relative dates for realistic countdowns
const now = new Date();
const addMins = (m) => new Date(now.getTime() + m * 60000).toISOString();
const subMins = (m) => new Date(now.getTime() - m * 60000).toISOString();

export const INITIAL_LISTINGS = [
  {
    id: 'lst_101',
    donor_id: 'usr_donor_1',
    donor_name: 'Green Leaf Bistro',
    donor_phone: '+91 98765 43210',
    donor_reliability: 4.9,
    donor_rating: 4.9,
    donor_rating_count: 24,
    food_name: 'Fresh Veg Biryani & Paneer Gravy (50 Portions)',
    category: 'Cooked Meal',
    quantity_kg: 15, // Medium-Bulk load
    meals_estimate: 60,
    pickup_location: {
      lat: 12.9784,
      lng: 77.6408,
      address: '#45, 100ft Road, Indiranagar, Bengaluru',
      landmark: 'Near Toit Brewpub'
    },
    prepared_at: subMins(120),
    expiry_time: addMins(16), // Urgent SOS
    pickup_window_start: '16:00',
    pickup_window_end: '17:30',
    photo_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    status: 'available',
    created_at: subMins(60),
    notes: 'Packed in clean, insulated food grade foil trays. Ready for immediate load.',
    compliance_checked: { prepared_safe: true, temp_safe: true, no_spoilage: true }
  },
  {
    id: 'lst_102',
    donor_id: 'usr_donor_2',
    donor_name: 'Grand Palace Catering',
    donor_phone: '+91 98123 76543',
    donor_reliability: 4.8,
    donor_rating: 4.8,
    donor_rating_count: 18,
    food_name: 'Wedding Buffet Surplus: Butter Naan & Dal Makhani',
    category: 'Cooked Meal',
    quantity_kg: 28, // Bulk load (>20kg) - Exceeds Bike capacity!
    meals_estimate: 112,
    pickup_location: {
      lat: 12.9722,
      lng: 77.6360,
      address: 'Grand Palace Convention, Old Airport Rd, Kodihalli',
      landmark: 'Gate 2 Loading Bay'
    },
    prepared_at: subMins(90),
    expiry_time: addMins(75),
    pickup_window_start: '16:30',
    pickup_window_end: '18:30',
    photo_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
    status: 'available',
    created_at: subMins(45),
    notes: 'High quality banquet food, untouched. Heavy containers, van recommended.',
    compliance_checked: { prepared_safe: true, temp_safe: true, no_spoilage: true }
  },
  {
    id: 'lst_103',
    donor_id: 'usr_donor_1',
    donor_name: 'Baker Street Artisans',
    donor_phone: '+91 98765 43210',
    donor_reliability: 4.9,
    donor_rating: 4.9,
    donor_rating_count: 24,
    food_name: 'Assorted Sourdough Loaves & Breakfast Pastries',
    category: 'Bakery',
    quantity_kg: 6, // Small load (<8kg) - Ideal for Bike!
    meals_estimate: 30,
    pickup_location: {
      lat: 12.9735,
      lng: 77.6385, // 0.4 km from lst_102!
      address: 'Baker Street, 12th Main, Indiranagar',
      landmark: 'Opposite Corner House'
    },
    prepared_at: subMins(240),
    expiry_time: addMins(320),
    pickup_window_start: '15:00',
    pickup_window_end: '20:00',
    photo_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    status: 'available',
    created_at: subMins(90),
    notes: 'Freshly baked today morning. Packed in paper bags.',
    compliance_checked: { prepared_safe: true, temp_safe: false, no_spoilage: true }
  },
  {
    id: 'lst_104',
    donor_id: 'usr_donor_2',
    donor_name: 'TechHub Co-Living Mess',
    donor_phone: '+91 98123 76543',
    donor_reliability: 4.7,
    donor_rating: 4.7,
    donor_rating_count: 12,
    food_name: 'Steamed Rice, Chana Masala & Mixed Salads',
    category: 'Cooked Meal',
    quantity_kg: 18,
    meals_estimate: 72,
    pickup_location: {
      lat: 12.9760,
      lng: 77.6430,
      address: '#88, 6th Cross, Indiranagar Stage 2',
      landmark: 'Near Club House'
    },
    prepared_at: subMins(60),
    expiry_time: addMins(120),
    pickup_window_start: '16:00',
    pickup_window_end: '18:00',
    photo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    status: 'available',
    created_at: subMins(30),
    notes: 'Hot lunch surplus from tech hostel mess.',
    compliance_checked: { prepared_safe: true, temp_safe: true, no_spoilage: true }
  },
  {
    id: 'lst_105',
    donor_id: 'usr_donor_1',
    donor_name: 'Metro Supermarket Express',
    donor_phone: '+91 98765 43210',
    donor_reliability: 4.95,
    donor_rating: 4.9,
    donor_rating_count: 24,
    food_name: 'Sealed Fresh Dairy Tubs & Whole Milk Cartons',
    category: 'Dairy',
    quantity_kg: 12,
    meals_estimate: 48,
    pickup_location: {
      lat: 12.9815,
      lng: 77.6310,
      address: 'Metro Mart, CMH Road, Indiranagar',
      landmark: 'Metro Pillar 42'
    },
    prepared_at: subMins(300),
    expiry_time: addMins(180),
    pickup_window_start: '10:00',
    pickup_window_end: '19:00',
    photo_url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop&q=80',
    status: 'available',
    created_at: subMins(180),
    notes: 'Refrigerated till pickup. Expiring tomorrow morning.',
    compliance_checked: { prepared_safe: true, temp_safe: true, no_spoilage: true }
  },
  {
    id: 'lst_106',
    donor_id: 'usr_donor_2',
    donor_name: 'Fresh Harvest Organics',
    donor_phone: '+91 98123 76543',
    donor_reliability: 4.85,
    donor_rating: 4.8,
    donor_rating_count: 18,
    food_name: 'Organic Apples, Oranges & Bananas Crate',
    category: 'Fruits & Vegetables',
    quantity_kg: 25,
    meals_estimate: 75,
    pickup_location: {
      lat: 12.9670,
      lng: 77.6410,
      address: 'Domlur Main Market, Bengaluru',
      landmark: 'Stall 14'
    },
    prepared_at: subMins(400),
    expiry_time: addMins(500),
    pickup_window_start: '09:00',
    pickup_window_end: '20:00',
    photo_url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
    status: 'claimed',
    claimed_by: 'usr_volunteer_1',
    claimed_by_name: 'Priya Sharma',
    created_at: subMins(200),
    notes: 'Slight cosmetic blemishes, 100% ripe and sweet.',
    compliance_checked: { prepared_safe: true, temp_safe: true, no_spoilage: true }
  },
  {
    id: 'lst_107',
    donor_id: 'usr_donor_1',
    donor_name: 'Corporate Campus Cafeteria',
    donor_phone: '+91 98765 43210',
    donor_reliability: 4.9,
    donor_rating: 4.9,
    donor_rating_count: 24,
    food_name: 'Executive Lunch Trays: Rice, Rajma & Gulab Jamun',
    category: 'Cooked Meal',
    quantity_kg: 30,
    meals_estimate: 120,
    pickup_location: {
      lat: 12.9700,
      lng: 77.6490,
      address: 'Embassy GolfLinks Tech Park, Off Intermediate Ring Rd',
      landmark: 'Tower B Cafeteria'
    },
    prepared_at: subMins(180),
    expiry_time: addMins(120),
    pickup_window_start: '14:30',
    pickup_window_end: '17:00',
    photo_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    status: 'picked_up',
    claimed_by: 'usr_ngo_1',
    claimed_by_name: 'Annakshetra Foundation',
    created_at: subMins(120),
    notes: 'In transport now heading towards Hope Children Home shelter.',
    compliance_checked: { prepared_safe: true, temp_safe: true, no_spoilage: true }
  },
  {
    id: 'lst_108',
    donor_id: 'usr_donor_2',
    donor_name: 'Fortune Landmark Hotel',
    donor_phone: '+91 98123 76543',
    donor_reliability: 5.0,
    donor_rating: 5.0,
    donor_rating_count: 10,
    food_name: 'Breakfast Buffet Surplus: Sandwich Platter & Juices',
    category: 'Cooked Meal',
    quantity_kg: 20,
    meals_estimate: 80,
    pickup_location: {
      lat: 12.9740,
      lng: 77.6250,
      address: 'MG Road Trinity Circle',
      landmark: 'Hotel Reception'
    },
    prepared_at: subMins(360),
    expiry_time: subMins(30),
    pickup_window_start: '11:00',
    pickup_window_end: '13:00',
    photo_url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
    status: 'delivered',
    claimed_by: 'usr_volunteer_1',
    claimed_by_name: 'Priya Sharma',
    created_at: subMins(360),
    notes: 'Successfully delivered to Sunshine Community Kitchen.',
    compliance_checked: { prepared_safe: true, temp_safe: true, no_spoilage: true }
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act_1',
    listing_id: 'lst_108',
    listing_title: 'Breakfast Buffet Surplus: Sandwich Platter & Juices',
    status: 'delivered',
    actor_id: 'usr_volunteer_1',
    actor_name: 'Priya Sharma',
    actor_role: 'volunteer',
    timestamp: subMins(12).toString(),
    text: 'Priya Sharma delivered 20 kg (~80 meals) from Fortune Landmark Hotel to Sunshine Community Kitchen!'
  },
  {
    id: 'act_2',
    listing_id: 'lst_107',
    listing_title: 'Executive Lunch Trays: Rice, Rajma & Gulab Jamun',
    status: 'picked_up',
    actor_id: 'usr_ngo_1',
    actor_name: 'Annakshetra Foundation',
    actor_role: 'ngo',
    timestamp: subMins(25).toString(),
    text: 'Annakshetra Foundation picked up 30 kg (~120 meals) of Executive Lunch Trays from Corporate Campus Cafeteria.'
  },
  {
    id: 'act_3',
    listing_id: 'lst_106',
    listing_title: 'Organic Apples, Oranges & Bananas Crate',
    status: 'claimed',
    actor_id: 'usr_volunteer_1',
    actor_name: 'Priya Sharma',
    actor_role: 'volunteer',
    timestamp: subMins(40).toString(),
    text: 'Priya Sharma claimed pickup for 25 kg (~75 meals) of Organic Fruit Crates from Fresh Harvest.'
  },
  {
    id: 'act_4',
    listing_id: 'lst_101',
    listing_title: 'Fresh Veg Biryani & Paneer Gravy (50 Portions)',
    status: 'posted',
    actor_id: 'usr_donor_1',
    actor_name: 'Green Leaf Bistro',
    actor_role: 'donor',
    timestamp: subMins(60).toString(),
    text: 'Green Leaf Bistro posted 15 kg (~60 meals) of fresh Veg Biryani in Indiranagar!'
  }
];
