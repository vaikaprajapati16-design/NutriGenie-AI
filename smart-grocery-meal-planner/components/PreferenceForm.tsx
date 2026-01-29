
import React, { useEffect } from 'react';
import { UserPreferences } from '../types';

interface PreferenceFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
  initialPrefs?: UserPreferences;
}

export const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit, isLoading, initialPrefs }) => {
  const [prefs, setPrefs] = React.useState<UserPreferences>(initialPrefs || {
    dietType: 'Vegetarian',
    calorieGoal: 2000,
    mealsPerDay: 3,
    allergies: ''
  });

  useEffect(() => {
    if (initialPrefs) {
      setPrefs(initialPrefs);
    }
  }, [initialPrefs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrefs(prev => ({
      ...prev,
      [name]: name === 'calorieGoal' || name === 'mealsPerDay' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Diet Type</label>
          <select
            name="dietType"
            value={prefs.dietType}
            onChange={handleChange}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
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

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Daily Calorie Goal</label>
          <input
            type="number"
            name="calorieGoal"
            value={prefs.calorieGoal}
            onChange={handleChange}
            min="1000"
            max="5000"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Meals Per Day</label>
          <select
            name="mealsPerDay"
            value={prefs.mealsPerDay}
            onChange={handleChange}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          >
            <option value={2}>2 Meals</option>
            <option value={3}>3 Meals</option>
            <option value={4}>4 Meals</option>
            <option value={5}>5 Meals</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Allergies / Dislikes</label>
          <input
            type="text"
            name="allergies"
            value={prefs.allergies}
            onChange={handleChange}
            placeholder="e.g. Nuts, Shellfish, Mushrooms"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
          isLoading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <i className="fas fa-circle-notch fa-spin mr-2"></i> Generating Plan...
          </span>
        ) : (
          'Generate My 7-Day Meal Plan'
        )}
      </button>
    </form>
  );
};
