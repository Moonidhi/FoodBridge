import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SosBanner from './components/SosBanner';
import LiveFeed from './components/LiveFeed';
import MapView from './components/MapView';
import Dashboard from './components/Dashboard';
import MyListings from './components/MyListings';
import PostFoodModal from './components/PostFoodModal';
import BundleModal from './components/BundleModal';
import RatingModal from './components/RatingModal';

import { INITIAL_USERS, INITIAL_LISTINGS, INITIAL_ACTIVITIES } from './data/seedData';
import { triggerCelebration, getTimeRemaining } from './utils/helpers';

export default function App() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('foodbridge_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[2]); // Default: Priya Sharma (Volunteer)
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('foodbridge_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('foodbridge_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [activeTab, setActiveTab] = useState('feed');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalPreset, setPostModalPreset] = useState(null);
  const [bundleGroupModal, setBundleGroupModal] = useState(null);
  const [ratingModalData, setRatingModalData] = useState(null); // { targetUser, listing, roleRating }
  const [toastMessage, setToastMessage] = useState(null);

  const handleOpenPostModal = (preset = null) => {
    setPostModalPreset(preset || null);
    setIsPostModalOpen(true);
  };

  // Sync state to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('foodbridge_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('foodbridge_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('foodbridge_activities', JSON.stringify(activities));
  }, [activities]);

  // Show quick toast notification
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Claim a listing
  const handleClaimListing = (listingId) => {
    const target = listings.find(l => l.id === listingId);
    if (!target) return;

    const updated = listings.map(l => {
      if (l.id === listingId) {
        return {
          ...l,
          status: 'claimed',
          claimed_by: currentUser.id,
          claimed_by_name: currentUser.name
        };
      }
      return l;
    });

    setListings(updated);

    // Add activity log
    const newAct = {
      id: `act_${Date.now()}`,
      listing_id: listingId,
      listing_title: target.food_name,
      status: 'claimed',
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      timestamp: new Date().toISOString(),
      text: `${currentUser.name} claimed pickup for ${target.food_name} (~${target.meals_estimate} meals).`
    };
    setActivities([newAct, ...activities]);

    triggerCelebration();
    showToast(`Pickup claimed! You saved ~${target.meals_estimate} meals from ${target.donor_name}.`);
  };

  // Claim a bundle of listings
  const handleClaimBundle = (listingIds) => {
    const updated = listings.map(l => {
      if (listingIds.includes(l.id)) {
        return {
          ...l,
          status: 'claimed',
          claimed_by: currentUser.id,
          claimed_by_name: currentUser.name
        };
      }
      return l;
    });

    setListings(updated);

    const totalMeals = listings
      .filter(l => listingIds.includes(l.id))
      .reduce((s, i) => s + i.meals_estimate, 0);

    const newAct = {
      id: `act_${Date.now()}`,
      listing_id: listingIds[0],
      listing_title: 'Nearby Pickup Bundle',
      status: 'claimed',
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      timestamp: new Date().toISOString(),
      text: `${currentUser.name} claimed a bundle of ${listingIds.length} nearby pickups (~${totalMeals} total meals saved!).`
    };
    setActivities([newAct, ...activities]);

    triggerCelebration();
    showToast(`Bundle claimed! ${listingIds.length} pickups saved in 1 trip.`);
  };

  // Update status (e.g. picked_up -> delivered) with Two-Way Rating prompt!
  const handleUpdateStatus = (listingId, newStatus) => {
    const target = listings.find(l => l.id === listingId);
    if (!target) return;

    const updated = listings.map(l => {
      if (l.id === listingId) {
        return { ...l, status: newStatus };
      }
      return l;
    });

    setListings(updated);

    let statusText = `${currentUser.name} updated status to ${newStatus}.`;
    if (newStatus === 'picked_up') {
      statusText = `${currentUser.name} picked up ${target.food_name} from ${target.donor_name}.`;
    } else if (newStatus === 'delivered') {
      statusText = `${currentUser.name} delivered ${target.food_name} (~${target.meals_estimate} meals) to community shelter!`;
      triggerCelebration();

      // Trigger Two-Way Rating Prompt! (Requirement #2)
      const donorUser = users.find(u => u.id === target.donor_id) || { id: target.donor_id, name: target.donor_name };
      setRatingModalData({
        targetUser: donorUser,
        listing: target,
        roleRating: 'donor'
      });
    }

    const newAct = {
      id: `act_${Date.now()}`,
      listing_id: listingId,
      listing_title: target.food_name,
      status: newStatus,
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      timestamp: new Date().toISOString(),
      text: statusText
    };
    setActivities([newAct, ...activities]);

    showToast(newStatus === 'delivered' ? `Delivery confirmed! ~${target.meals_estimate} meals saved!` : `Status updated to ${newStatus}`);
  };

  // Handle rating submission for two-way ratings
  const handleSubmitRating = ({ targetUserId, roleRating, stars, tags, comment }) => {
    const updatedUsers = users.map(u => {
      if (u.id === targetUserId) {
        if (roleRating === 'donor') {
          const currentAvg = u.donor_rating || 4.9;
          const currentCount = u.donor_rating_count || 18;
          const newCount = currentCount + 1;
          const newAvg = Math.round(((currentAvg * currentCount + stars) / newCount) * 10) / 10;
          return { ...u, donor_rating: newAvg, donor_rating_count: newCount, reliability_score: newAvg };
        } else {
          const currentAvg = u.volunteer_rating || 5.0;
          const currentCount = u.volunteer_rating_count || 32;
          const newCount = currentCount + 1;
          const newAvg = Math.round(((currentAvg * currentCount + stars) / newCount) * 10) / 10;
          return { ...u, volunteer_rating: newAvg, volunteer_rating_count: newCount, reliability_score: newAvg };
        }
      }
      return u;
    });

    setUsers(updatedUsers);

    // Also update listing cards donor rating
    const updatedListings = listings.map(l => {
      if (l.donor_id === targetUserId) {
        const u = updatedUsers.find(x => x.id === targetUserId);
        return {
          ...l,
          donor_rating: u ? u.donor_rating : l.donor_rating,
          donor_rating_count: u ? u.donor_rating_count : l.donor_rating_count
        };
      }
      return l;
    });
    setListings(updatedListings);

    showToast(`Two-way rating submitted successfully! Thank you for strengthening community trust.`);
  };

  // Post new food listing
  const handlePostFood = (newListing) => {
    setListings([newListing, ...listings]);

    const newAct = {
      id: `act_${Date.now()}`,
      listing_id: newListing.id,
      listing_title: newListing.food_name,
      status: 'posted',
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      timestamp: new Date().toISOString(),
      text: `${currentUser.name} posted ${newListing.food_name} (~${newListing.meals_estimate} meals).`
    };
    setActivities([newAct, ...activities]);

    showToast(`Food listing posted successfully! Broadcasted to nearby volunteers.`);
    setActiveTab('feed');
  };

  const availableCount = listings.filter(l => l.status === 'available').length;
  const sosCount = listings.filter(l => {
    if (l.status !== 'available') return false;
    const { totalMins } = getTimeRemaining(l.expiry_time);
    return totalMins > 0 && totalMins <= 20;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-white font-sans text-slate-900">
      
      <div>
        {/* Top SOS Urgent Banner */}
        <SosBanner
          listings={listings}
          onSelectListing={(item) => {
            setActiveTab('feed');
            handleClaimListing(item.id);
          }}
        />

        {/* Global Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          users={users}
          setCurrentUser={setCurrentUser}
          onOpenPostModal={() => handleOpenPostModal()}
          availableCount={availableCount}
          sosCount={sosCount}
        />

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2 animate-bounce">
            <span>{toastMessage.msg}</span>
          </div>
        )}

        {/* Main Tab Content */}
        <main className="pb-12">
          {activeTab === 'feed' && (
            <LiveFeed
              listings={listings}
              currentUser={currentUser}
              onClaim={handleClaimListing}
              onUpdateStatus={handleUpdateStatus}
              onOpenPostModal={(preset) => handleOpenPostModal(preset)}
              onOpenBundleModal={(group) => setBundleGroupModal(group)}
              userLocation={currentUser.location}
            />
          )}

          {activeTab === 'map' && (
            <MapView
              listings={listings}
              currentUser={currentUser}
              onClaim={handleClaimListing}
              userLocation={currentUser.location}
            />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard
              listings={listings}
              activities={activities}
              users={users}
            />
          )}

          {activeTab === 'my_listings' && (
            <MyListings
              listings={listings}
              currentUser={currentUser}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </main>
      </div>

      {/* Post Food Modal */}
      <PostFoodModal
        isOpen={isPostModalOpen}
        onClose={() => {
          setIsPostModalOpen(false);
          setPostModalPreset(null);
        }}
        onSubmit={handlePostFood}
        currentUser={currentUser}
        initialPreset={postModalPreset}
      />

      {/* Bundle Claim Modal */}
      <BundleModal
        isOpen={!!bundleGroupModal}
        bundleGroup={bundleGroupModal}
        onClose={() => setBundleGroupModal(null)}
        onClaimBundle={handleClaimBundle}
      />

      {/* Two-Way Rating Modal */}
      {ratingModalData && (
        <RatingModal
          isOpen={!!ratingModalData}
          targetUser={ratingModalData.targetUser}
          listing={ratingModalData.listing}
          roleRating={ratingModalData.roleRating}
          onClose={() => setRatingModalData(null)}
          onSubmitRating={handleSubmitRating}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">FoodBridge</span>
            <span>• Hackathon Prototype</span>
          </div>
          <div>
            Built with React, Leaflet & Tailwind CSS • Saving surplus food in real time
          </div>
        </div>
      </footer>

    </div>
  );
}
