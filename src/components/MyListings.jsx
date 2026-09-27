import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  MapPin, 
  Utensils, 
  UserCheck, 
  ArrowRight,
  PhoneCall,
  Flame,
  Package
} from 'lucide-react';
import { getTimeRemaining, formatTimeAgo } from '../utils/helpers';

export default function MyListings({ listings, currentUser, onUpdateStatus }) {
  const isDonor = currentUser.role === 'donor';

  const myItems = listings.filter((l) => {
    if (isDonor) {
      return l.donor_id === currentUser.id;
    } else {
      return l.claimed_by === currentUser.id;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Role: {isDonor ? 'Food Donor' : 'Volunteer Rescuer'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isDonor ? 'My Surplus Food Postings' : 'My Claimed Pickups'}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track status updates, log delivery completions, and view timeline history.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-right">
          <div className="text-xs text-slate-500 font-medium">Active Managed Items</div>
          <div className="text-2xl font-extrabold text-emerald-700">{myItems.length}</div>
        </div>
      </div>

      {/* Items Pipeline Grid */}
      {myItems.length > 0 ? (
        <div className="space-y-4">
          {myItems.map((item) => {
            const timeInfo = getTimeRemaining(item.expiry_time);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  
                  <div className="flex items-center gap-4">
                    {item.photo_url && (
                      <img src={item.photo_url} alt={item.food_name} className="w-16 h-16 rounded-2xl object-cover border" />
                    )}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{item.food_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-lg border border-emerald-200">
                          ~{item.meals_estimate} Meals ({item.quantity_kg} kg)
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${timeInfo.badgeColor}`}>
                          {timeInfo.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pipeline Status Stepper */}
                  <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <span className={`px-2.5 py-1 rounded-xl ${item.status === 'available' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-400'}`}>
                      1. Available
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className={`px-2.5 py-1 rounded-xl ${item.status === 'claimed' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400'}`}>
                      2. Claimed
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className={`px-2.5 py-1 rounded-xl ${item.status === 'picked_up' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400'}`}>
                      3. Picked Up
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className={`px-2.5 py-1 rounded-xl ${item.status === 'delivered' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400'}`}>
                      4. Delivered
                    </span>
                  </div>

                </div>

                {/* Details & Actions Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  
                  <div className="space-y-1 text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>{item.pickup_location.address}</span>
                    </div>
                    {item.claimed_by_name && (
                      <div className="font-semibold text-slate-800">
                        Assigned Rescuer: {item.claimed_by_name}
                      </div>
                    )}
                  </div>

                  {/* Actions for changing status */}
                  <div className="flex items-center gap-2">
                    {item.status === 'claimed' && item.claimed_by === currentUser.id && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'picked_up')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        Confirm Picked Up
                      </button>
                    )}

                    {item.status === 'picked_up' && item.claimed_by === currentUser.id && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'delivered')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        Confirm Delivered to Shelter
                      </button>
                    )}

                    {item.status === 'delivered' && (
                      <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Complete
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No active items found for this account</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            {isDonor
              ? "You haven't posted any surplus food yet. Click 'Post Surplus Food' to broadcast a donation."
              : "You haven't claimed any pickups yet. Switch to 'Live Pickups' feed to claim nearby donations."}
          </p>
        </div>
      )}

    </div>
  );
}
