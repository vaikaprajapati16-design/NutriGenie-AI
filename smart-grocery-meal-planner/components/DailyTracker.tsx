
import React, { useState } from 'react';
import { TrackingResponse } from '../types';
import { analyzeDailyIntake } from '../services/geminiService';

interface DailyTrackerProps {
  calorieGoal: number;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({ calorieGoal }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResponse | null>(null);

  const handleTrack = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeDailyIntake(input, calorieGoal);
      setResult(data);
    } catch (e) {
      alert("Error analyzing intake. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
          <i className="fas fa-utensils"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Diet Tracker</h3>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Log what you've eaten today</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 2 scrambled eggs, 1 slice of whole grain toast with butter, a large latte..."
          className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all resize-none text-slate-700"
        />
        <button
          onClick={handleTrack}
          disabled={loading || !input.trim()}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
            loading ? 'bg-slate-300' : 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-100'
          }`}
        >
          {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Analyze My Intake'}
        </button>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
              <span className="block text-xs font-bold text-orange-400 uppercase">Estimated Calories</span>
              <span className="text-2xl font-black text-orange-600">{result.totalCalories}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <span className="block text-xs font-bold text-slate-400 uppercase">Goal Status</span>
              <span className={`text-2xl font-black ${result.totalCalories > calorieGoal ? 'text-red-500' : 'text-emerald-500'}`}>
                {Math.abs(calorieGoal - result.totalCalories)} {result.totalCalories > calorieGoal ? 'Over' : 'Under'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Macro Breakdown</h4>
            <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100">
              <div 
                className="bg-emerald-500 h-full" 
                style={{ width: `${(result.macros.protein * 4 / (result.totalCalories || 1)) * 100}%` }}
                title={`Protein: ${result.macros.protein}g`}
              ></div>
              <div 
                className="bg-blue-500 h-full" 
                style={{ width: `${(result.macros.carbs * 4 / (result.totalCalories || 1)) * 100}%` }}
                title={`Carbs: ${result.macros.carbs}g`}
              ></div>
              <div 
                className="bg-orange-500 h-full" 
                style={{ width: `${(result.macros.fats * 9 / (result.totalCalories || 1)) * 100}%` }}
                title={`Fats: ${result.macros.fats}g`}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 px-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Protein: {result.macros.protein}g</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Carbs: {result.macros.carbs}g</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Fats: {result.macros.fats}g</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-2">Analysis</h4>
            <p className="text-sm text-slate-600 leading-relaxed italic">"{result.analysis}"</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Suggestions</h4>
            <ul className="space-y-2">
              {result.suggestions.map((s, idx) => (
                <li key={idx} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-orange-500">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
