
import React, { useState } from 'react';
import { User, UserPreferences } from '../types';

interface ProfileSettingsProps {
  user: User;
  preferences: UserPreferences;
  onUpdateUser: (user: User) => void;
  onUpdatePrefs: (prefs: UserPreferences) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  user, 
  preferences, 
  onUpdateUser, 
  onUpdatePrefs 
}) => {
  const [tempUser, setTempUser] = useState(user);
  const [tempPrefs, setTempPrefs] = useState(preferences);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onUpdateUser(tempUser);
      onUpdatePrefs(tempPrefs);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Profile Settings</h2>
          <p className="text-slate-500">Manage your account and nutrition goals</p>
        </div>
        {showSuccess && (
          <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-bounce">
            <i className="fas fa-check-circle"></i> Changes Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Section */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-user-gear"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Account Information</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
              <input
                type="text"
                value={tempUser.name}
                onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <input
                type="text"
                value={tempUser.username}
                onChange={(e) => setTempUser({ ...tempUser, username: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Nutrition Section */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-apple-whole"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Nutrition Goals</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Diet Type</label>
              <select
                value={tempPrefs.dietType}
                onChange={(e) => setTempPrefs({ ...tempPrefs, dietType: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              >
                <option>Standard (Everything)</option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Keto</option>
                <option>Paleo</option>
                <option>Mediterranean</option>
                <option>Pescatarian</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Daily Calories</label>
              <input
                type="number"
                value={tempPrefs.calorieGoal}
                onChange={(e) => setTempPrefs({ ...tempPrefs, calorieGoal: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Meals Per Day</label>
              <select
                value={tempPrefs.mealsPerDay}
                onChange={(e) => setTempPrefs({ ...tempPrefs, mealsPerDay: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              >
                <option value={2}>2 Meals</option>
                <option value={3}>3 Meals</option>
                <option value={4}>4 Meals</option>
                <option value={5}>5 Meals</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Water Goal (ml)</label>
              <input
                type="number"
                value={tempPrefs.waterGoal || 2000}
                onChange={(e) => setTempPrefs({ ...tempPrefs, waterGoal: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Allergies & Dislikes</label>
            <input
              type="text"
              value={tempPrefs.allergies}
              onChange={(e) => setTempPrefs({ ...tempPrefs, allergies: e.target.value })}
              placeholder="e.g. Peanuts, Shellfish"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:bg-slate-300"
          >
            {isSaving ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <>
                <i className="fas fa-save"></i> Save All Changes
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl flex items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 text-2xl">
          <i className="fas fa-shield-halved"></i>
        </div>
        <div>
          <h4 className="font-bold text-slate-800">Privacy & Security</h4>
          <p className="text-sm text-slate-500">Your preferences are used exclusively to tailor your meal plans and tracking experience.</p>
        </div>
      </div>
    </div>
  );
};
