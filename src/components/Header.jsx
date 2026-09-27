import { 
  UtensilsCrossed, 
  MapPin, 
  PlusCircle, 
  LayoutDashboard, 
  ListOrdered, 
  UserCheck,
  Building2,
  Bike,
  ShieldAlert,
  Globe
} from 'lucide-react';
import Logo from './Logo';
import RatingStars from './RatingStars';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  users, 
  setCurrentUser, 
  onOpenPostModal,
  availableCount,
  sosCount
}) {
  const { lang, setLang, t } = useLanguage();

  const currentRating = currentUser.role === 'donor' 
    ? (currentUser.donor_rating || 4.9) 
    : (currentUser.volunteer_rating || 5.0);
  const currentCount = currentUser.role === 'donor'
    ? (currentUser.donor_rating_count || 18)
    : (currentUser.volunteer_rating_count || 32);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => setActiveTab('feed')}>
            <Logo size="md" />
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>{t('live_pickups')}</span>
              {availableCount > 0 && (
                <span className="ml-1 bg-emerald-600 text-white text-xs px-2 py-0.2 rounded-full font-bold">
                  {availableCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t('live_map')}</span>
              {sosCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[11px] px-1.5 py-0.2 rounded font-bold animate-pulse">
                  SOS
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('impact_dashboard')}</span>
            </button>

            <button
              onClick={() => setActiveTab('my_listings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'my_listings'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {currentUser.role === 'donor' ? t('my_food_posts') : t('my_pickups')}
              </span>
            </button>
          </nav>

          {/* Action, Language Switcher & Role Switcher */}
          <div className="flex items-center gap-3">

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5 shrink-0" />
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-white text-emerald-800 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  lang === 'hi' ? 'bg-white text-emerald-800 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="हिन्दी"
              >
                हिं
              </button>
              <button
                onClick={() => setLang('ta')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  lang === 'ta' ? 'bg-white text-emerald-800 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="தமிழ்"
              >
                தமிழ்
              </button>
            </div>

            {/* Post Food CTA */}
            <button
              onClick={onOpenPostModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('post_surplus_food')}</span>
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer transition-colors">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-400"
                />
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                    {currentUser.name}
                    <RatingStars rating={currentRating} count={currentCount} size="sm" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium capitalize">
                    {currentUser.role === 'donor' ? t('food_donor') : currentUser.role === 'volunteer' ? t('volunteer') : t('ngo_admin')}
                  </div>
                </div>
              </div>

              {/* User Selector Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                  {t('switch_user_title')}
                </div>
                <div className="space-y-1 mt-1">
                  {users.map(u => {
                    const uRating = u.role === 'donor' ? (u.donor_rating || 4.9) : (u.volunteer_rating || 5.0);
                    const uCount = u.role === 'donor' ? (u.donor_rating_count || 18) : (u.volunteer_rating_count || 32);

                    return (
                      <button
                        key={u.id}
                        onClick={() => setCurrentUser(u)}
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                          currentUser.id === u.id ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="flex-1 truncate">
                          <div className="font-semibold truncate">{u.name}</div>
                          <div className="text-[10px] text-slate-500 capitalize flex items-center justify-between">
                            <span>{u.role}</span>
                            <RatingStars rating={uRating} count={uCount} size="sm" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2 px-2 text-xs">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 font-semibold ${activeTab === 'feed' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Pickups</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 font-semibold ${activeTab === 'map' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          <MapPin className="w-4 h-4" />
          <span>Map</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 font-semibold ${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Impact</span>
        </button>

        <button
          onClick={() => setActiveTab('my_listings')}
          className={`flex flex-col items-center gap-1 font-semibold ${activeTab === 'my_listings' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          <UserCheck className="w-4 h-4" />
          <span>My Activity</span>
        </button>
      </div>
    </header>
  );
}
