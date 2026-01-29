
import React, { useState, useEffect } from 'react';
import { PreferenceForm } from './components/PreferenceForm';
import { MealCard } from './components/MealCard';
import { GroceryAssistant } from './components/GroceryAssistant';
import { DailyTracker } from './components/DailyTracker';
import { WaterTracker } from './components/WaterTracker';
import { AuthPage } from './components/AuthPage';
import { VisualCalendar } from './components/VisualCalendar';
import { ProfileSettings } from './components/ProfileSettings';
import { generateMealPlan } from './services/geminiService';
import { UserPreferences, MealPlanResponse, User, Meal } from './types';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App Logic State
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null);
  const [view, setView] = useState<'plan' | 'track' | 'grocery' | 'saved' | 'profile'>('plan');
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [favorites, setFavorites] = useState<Meal[]>([]);
  
  // User Preferences & Goals State
  const [currentPrefs, setCurrentPrefs] = useState<UserPreferences>({
    dietType: 'Vegetarian',
    calorieGoal: 2000,
    mealsPerDay: 3,
    allergies: '',
    waterGoal: 2000
  });
  
  // Water Tracking State
  const [dailyWater, setDailyWater] = useState(0);

  // Persistence Effects
  useEffect(() => {
    const savedPrefs = localStorage.getItem('nutrigenie_prefs');
    if (savedPrefs) {
      setCurrentPrefs(JSON.parse(savedPrefs));
    }
    const storedFavs = JSON.parse(localStorage.getItem('nutrigenie_favorites') || '[]');
    setFavorites(storedFavs);
  }, [view]);

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    // In a real app, you'd save to DB here
  };

  const handleUpdatePrefs = (updatedPrefs: UserPreferences) => {
    setCurrentPrefs(updatedPrefs);
    localStorage.setItem('nutrigenie_prefs', JSON.stringify(updatedPrefs));
  };

  const refreshFavorites = () => {
    const stored = JSON.parse(localStorage.getItem('nutrigenie_favorites') || '[]');
    setFavorites(stored);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMealPlan(null);
    setView('plan');
  };

  const handleGenerate = async (prefs: UserPreferences) => {
    setIsLoading(true);
    handleUpdatePrefs(prefs);
    setError(null);
    try {
      const plan = await generateMealPlan(prefs);
      setMealPlan(plan);
      setActiveDay(1);
      setView('plan');
    } catch (err: any) {
      setError(err.message || 'Something went wrong while generating your plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWaterUpdate = (amount: number) => {
    setDailyWater(prev => Math.max(0, prev + amount));
  };

  const currentDayPlan = mealPlan?.weeklyPlan.find(d => d.dayNumber === activeDay);

  // Return AuthPage if not logged in
  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <i className="fas fa-leaf text-xl"></i>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NutriGenie AI
            </h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setView('plan')} className={`hover:text-emerald-600 flex items-center gap-2 transition-all ${view === 'plan' ? 'text-emerald-600 font-bold' : ''}`}>
              <i className="fas fa-calendar-alt"></i> Plan
            </button>
            <button onClick={() => setView('grocery')} className={`hover:text-indigo-600 flex items-center gap-2 transition-all ${view === 'grocery' ? 'text-indigo-600 font-bold' : ''}`}>
              <i className="fas fa-shopping-basket"></i> Grocery
            </button>
            <button onClick={() => setView('saved')} className={`hover:text-rose-600 flex items-center gap-2 transition-all ${view === 'saved' ? 'text-rose-600 font-bold' : ''}`}>
              <i className="fas fa-heart"></i> Saved
            </button>
            <button onClick={() => setView('track')} className={`hover:text-orange-600 flex items-center gap-2 transition-all ${view === 'track' ? 'text-orange-600 font-bold' : ''}`}>
              <i className="fas fa-chart-line"></i> Track
            </button>
          </nav>
          
          <div className="flex items-center gap-3 border-l border-slate-100 pl-4 ml-4">
             <button 
                onClick={() => setView('profile')}
                className={`hidden sm:flex items-center gap-3 p-1 rounded-xl transition-all hover:bg-slate-50 ${view === 'profile' ? 'bg-slate-100' : ''}`}
             >
                <div className="text-right">
                  <span className="block text-xs font-bold text-slate-400 uppercase leading-none">Settings</span>
                  <span className="text-sm font-bold text-slate-800">{currentUser.name}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200">
                  <i className="fas fa-user"></i>
                </div>
             </button>
             <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Logout"
             >
               <i className="fas fa-sign-out-alt"></i>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form & Info */}
          {view !== 'profile' && (
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-800">Your Dashboard</h2>
                <p className="text-slate-500 leading-relaxed">
                  Welcome back, {currentUser.name}! Let's reach your health goals today.
                </p>
              </div>
              
              <PreferenceForm 
                onSubmit={handleGenerate} 
                isLoading={isLoading} 
                initialPrefs={currentPrefs}
              />

              <WaterTracker 
                current={dailyWater} 
                goal={currentPrefs.waterGoal || 2000} 
                onUpdate={handleWaterUpdate} 
                onSetGoal={(g) => handleUpdatePrefs({ ...currentPrefs, waterGoal: g })} 
              />

              {mealPlan && (
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <h3 className="text-emerald-800 font-bold mb-4 flex items-center text-sm">
                    <i className="fas fa-lightbulb mr-2"></i> Nutrition Tip
                  </h3>
                  <p className="text-sm text-emerald-700 leading-relaxed italic">
                    "{mealPlan.nutritionTips[0]}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Right Column / Main View */}
          <div className={`${view === 'profile' ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
            
            {view !== 'profile' && (
              /* Desktop Tab Switcher */
              <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-2xl mb-6 shadow-sm overflow-x-auto">
                 <button 
                    onClick={() => setView('plan')}
                    className={`flex-1 min-w-[120px] px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${view === 'plan' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                   <i className="fas fa-calendar-check"></i> Plan
                 </button>
                 <button 
                    onClick={() => setView('saved')}
                    className={`flex-1 min-w-[120px] px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${view === 'saved' ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                   <i className="fas fa-heart"></i> Saved ({favorites.length})
                 </button>
                 <button 
                    onClick={() => setView('grocery')}
                    className={`flex-1 min-w-[120px] px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${view === 'grocery' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                   <i className="fas fa-shopping-basket"></i> Grocery
                 </button>
                 <button 
                    onClick={() => setView('track')}
                    className={`flex-1 min-w-[120px] px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${view === 'track' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                   <i className="fas fa-bullseye"></i> Track
                 </button>
              </div>
            )}

            {view === 'profile' ? (
              <ProfileSettings 
                user={currentUser} 
                preferences={currentPrefs} 
                onUpdateUser={handleUpdateUser}
                onUpdatePrefs={handleUpdatePrefs}
              />
            ) : view === 'track' ? (
              <DailyTracker calorieGoal={currentPrefs.calorieGoal} />
            ) : view === 'grocery' ? (
              <GroceryAssistant existingPlan={mealPlan} />
            ) : view === 'saved' ? (
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">Saved Recipes</h3>
                      <p className="text-slate-500">Your curated collection of favorites</p>
                    </div>
                 </div>
                 
                 {favorites.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.map((meal, idx) => (
                        <MealCard key={idx} meal={meal} onFavoriteChange={refreshFavorites} />
                      ))}
                   </div>
                 ) : (
                   <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center">
                      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 text-3xl mx-auto mb-6">
                        <i className="far fa-heart"></i>
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">No Favorites Yet</h4>
                      <p className="text-slate-500 mb-6">Explore meal plans and tap the heart icon to save recipes you love.</p>
                      <button 
                        onClick={() => setView('plan')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                      >
                        Explore Meal Plans
                      </button>
                   </div>
                 )}
              </div>
            ) : isLoading ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-utensils text-emerald-600 animate-pulse"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Crafting your menu...</h3>
                  <p className="text-slate-500">Optimizing calories and selecting fresh ingredients.</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center">
                <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600">{error}</p>
              </div>
            ) : mealPlan ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <VisualCalendar 
                  days={mealPlan.weeklyPlan} 
                  activeDay={activeDay} 
                  onDaySelect={setActiveDay} 
                />

                {currentDayPlan && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">{currentDayPlan.dayName}</h3>
                        <p className="text-slate-500">Your AI-optimized menu</p>
                      </div>
                      <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="text-right">
                          <span className="block text-xs font-bold text-slate-400 uppercase">Daily Total</span>
                          <span className="text-xl font-bold text-emerald-600">{currentDayPlan.totalCalories} kcal</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <i className="fas fa-chart-pie"></i>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentDayPlan.meals.map((meal, idx) => (
                        <MealCard key={idx} meal={meal} onFavoriteChange={refreshFavorites} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-4xl mb-6">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">No Plan Generated Yet</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  Set your goals to build a plan, or switch to the tracker to log today's meals.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setView('grocery')} className="text-indigo-600 font-bold flex items-center gap-2 hover:underline">
                    <i className="fas fa-shopping-basket"></i> Try the Grocery Tool
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
