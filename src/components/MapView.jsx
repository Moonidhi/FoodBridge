import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Flame, 
  Clock, 
  MapPin, 
  Utensils, 
  CheckCircle, 
  ArrowRight,
  Filter,
  AlertTriangle,
  Route,
  Boxes
} from 'lucide-react';
import { 
  getTimeRemaining, 
  calculateDistance, 
  computeUrgencyScore,
  computeNearestNeighborRoute 
} from '../utils/helpers';

// Helper component to center map smoothly
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

// SVG Map Pins Creator
const createCustomIcon = (status, totalMins, isUser = false, routeOrder = null) => {
  if (isUser) {
    return L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="background-color:#10b981; width:38px; height:38px; border-radius:50%; border:3px solid white; box-shadow:0 4px 12px rgba(16, 185, 129, 0.4); display:flex; align-items:center; justify-content:center; color:white; font-size:16px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });
  }

  // Numbered Bundle Route Pin
  if (routeOrder) {
    return L.divIcon({
      className: 'custom-route-marker',
      html: `
        <div style="background-color:#059669; width:42px; height:42px; border-radius:50%; border:3px solid white; box-shadow:0 4px 14px rgba(5, 150, 105, 0.5); display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-weight:800; font-size:14px; font-family:sans-serif;">
          <span style="font-size:9px; text-transform:uppercase; line-height:1; opacity:0.8;">Stop</span>
          <span>#${routeOrder}</span>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });
  }

  let bg = '#10b981'; // Emerald (fresh)
  let shadow = 'rgba(16, 185, 129, 0.4)';
  let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
  let animation = '';

  if (totalMins <= 20) {
    bg = '#ef4444'; // Red (SOS)
    shadow = 'rgba(239, 68, 68, 0.8)';
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
    animation = 'animation: sosPulse 1.5s infinite;';
  } else if (totalMins <= 90) {
    bg = '#f59e0b'; // Amber (soon)
    shadow = 'rgba(245, 158, 11, 0.6)';
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  }

  return L.divIcon({
    className: 'custom-food-marker',
    html: `
      <div style="background-color:${bg}; width:38px; height:38px; border-radius:50%; border:3px solid white; box-shadow:0 4px 12px ${shadow}; display:flex; align-items:center; justify-content:center; color:white; ${animation}">
        ${iconSvg}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

export default function MapView({ 
  listings, 
  currentUser, 
  onClaim, 
  userLocation = { lat: 12.9750, lng: 77.6380 } 
}) {
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'sos', 'available', 'bundled'
  const [mapCenter, setMapCenter] = useState([userLocation.lat, userLocation.lng]);

  // Compute Nearest Neighbor Route for Available Bundled Listings (Requirement #3)
  const bundledListings = useMemo(() => {
    return listings.filter(l => l.status === 'available');
  }, [listings]);

  const routeInfo = useMemo(() => {
    const nearbyAvailable = bundledListings.filter(l => {
      const d = calculateDistance(userLocation.lat, userLocation.lng, l.pickup_location.lat, l.pickup_location.lng);
      return d <= 2.5; // items within 2.5km
    });

    return computeNearestNeighborRoute(userLocation, nearbyAvailable.slice(0, 3));
  }, [userLocation, bundledListings]);

  const polylinePositions = useMemo(() => {
    if (!routeInfo.route || routeInfo.route.length === 0) return [];
    const pts = [[userLocation.lat, userLocation.lng]];
    routeInfo.route.forEach(stop => {
      pts.push([stop.pickup_location.lat, stop.pickup_location.lng]);
    });
    return pts;
  }, [userLocation, routeInfo]);

  const filteredListings = listings.filter((l) => {
    if (l.status !== 'available' && filterMode === 'available') return false;
    const { totalMins } = getTimeRemaining(l.expiry_time);
    if (filterMode === 'sos' && (totalMins > 20 || l.status !== 'available')) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      
      {/* Map Header & Controls Overlay */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Interactive Live Donation Map & Route Optimization</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Color-coded pin map showing real-time listings, urgency indicators, and optimized route lines.
          </p>
        </div>

        {/* Legend & Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-slate-900 font-extrabold shadow-xs' : 'text-slate-600'
              }`}
            >
              All Pins ({listings.length})
            </button>

            <button
              onClick={() => setFilterMode('available')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'available' ? 'bg-emerald-600 text-white font-extrabold shadow-xs' : 'text-slate-600'
              }`}
            >
              Available Only
            </button>

            <button
              onClick={() => setFilterMode('sos')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                filterMode === 'sos' ? 'bg-red-600 text-white font-extrabold shadow-xs' : 'text-slate-600'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS Urgent</span>
            </button>
          </div>
        </div>
      </div>

      {/* OPTIMIZED NEAREST-NEIGHBOR ROUTE BANNER */}
      {routeInfo.route.length > 1 && (
        <div className="bg-emerald-50 border border-emerald-200 text-slate-800 p-3 px-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              <Route className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold uppercase tracking-wider text-[10px] text-emerald-800">
                Optimized Route Bundle
              </div>
              <div className="font-bold text-sm text-slate-900 mt-0.5">
                Suggested Visiting Order ({routeInfo.route.length} stops • ~{routeInfo.totalDistanceKm} km total route)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-slate-700 font-medium">
            <span className="bg-white border border-emerald-200 px-2.5 py-1 rounded-lg text-emerald-800 font-semibold">Start: You</span>
            {routeInfo.route.map((stop) => (
              <React.Fragment key={stop.id}>
                <span className="text-slate-400">→</span>
                <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-semibold">
                  #{stop.routeOrder} {stop.donor_name} (+{stop.legDistanceKm}km)
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Color Legend Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-3 px-4 text-xs flex flex-wrap items-center justify-between gap-4">
        <div className="font-bold flex items-center gap-2 text-slate-200">
          <span>Map Pin Legend:</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap text-[11px] font-medium text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Fresh (&gt;90m)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Pickup Soon (20m-90m)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
            <span>SOS Urgent (&lt;20m)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            <span>Route Stops (#1, #2...)</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div className="h-[600px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapRecenter center={mapCenter} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* REQUIREMENT #3: ROUTE POLYLINE CONNECTING STOPS */}
          {polylinePositions.length > 1 && (
            <Polyline
              positions={polylinePositions}
              pathOptions={{
                color: '#f59e0b',
                weight: 5,
                dashArray: '8, 8',
                opacity: 0.9
              }}
            />
          )}

          {/* Volunteer / Current User Marker */}
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createCustomIcon('user', 999, true)}
          >
            <Popup>
              <div className="text-center p-1">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                  Your Location (Route Start)
                </span>
                <div className="font-bold text-slate-900 mt-1">{currentUser.name}</div>
                <div className="text-xs text-slate-500">{currentUser.vehicle_capacity || 'Bike (small)'}</div>
              </div>
            </Popup>
          </Marker>

          {/* Food Listings Pins */}
          {filteredListings.map((listing) => {
            const timeInfo = getTimeRemaining(listing.expiry_time);
            const urgencyScore = computeUrgencyScore(listing, userLocation.lat, userLocation.lng);
            const routeStop = routeInfo.route.find(r => r.id === listing.id);

            const dist = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              listing.pickup_location.lat,
              listing.pickup_location.lng
            );

            return (
              <Marker
                key={listing.id}
                position={[listing.pickup_location.lat, listing.pickup_location.lng]}
                icon={createCustomIcon(listing.status, timeInfo.totalMins, false, routeStop?.routeOrder)}
              >
                <Popup>
                  <div className="space-y-2 max-w-xs">
                    
                    {routeStop && (
                      <div className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg text-center uppercase tracking-wider">
                        Route Stop #${routeStop.routeOrder} (+{routeStop.legDistanceKm} km)
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 border-b pb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${timeInfo.badgeColor}`}>
                        {timeInfo.text}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Score {urgencyScore}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {listing.food_name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Donor: <strong>{listing.donor_name}</strong>
                      </p>
                    </div>

                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                        ~{listing.meals_estimate} Meals ({listing.quantity_kg}kg)
                      </span>
                      <span className="text-slate-600 font-semibold">{dist} km away</span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{listing.pickup_location.address}</span>
                    </div>

                    {listing.status === 'available' ? (
                      <button
                        onClick={() => onClaim(listing.id)}
                        className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>Claim Pickup</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="text-[11px] text-center text-slate-500 font-semibold bg-slate-100 py-1 rounded">
                        Status: <span className="capitalize">{listing.status}</span>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
}
