
import React, { useState } from 'react';
import { generateGroceryList } from '../services/geminiService';
import { GroceryListResponse, MealPlanResponse } from '../types';
import { GroceryListView } from './GroceryListView';

interface GroceryAssistantProps {
  existingPlan: MealPlanResponse | null;
}

export const GroceryAssistant: React.FC<GroceryAssistantProps> = ({ existingPlan }) => {
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GroceryListResponse | null>(null);

  const handleGenerate = async (content: string) => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const data = await generateGroceryList(content);
      setResult(data);
    } catch (e) {
      alert("Failed to organize the grocery list.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <GroceryListView list={result} onClose={() => setResult(null)} />;
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
          <i className="fas fa-shopping-basket"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Smart Grocery List</h3>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Consolidate ingredients for the week</p>
        </div>
      </div>

      <div className="space-y-6">
        {existingPlan && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-indigo-800 font-bold text-sm">Active Plan Found</h4>
              <p className="text-indigo-600 text-xs">Convert your generated 7-day plan into a shopping list instantly.</p>
            </div>
            <button
              onClick={() => handleGenerate(JSON.stringify(existingPlan))}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all whitespace-nowrap"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Sync Current Plan'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Paste an external meal plan (Optional)</label>
          <textarea
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Paste text here... e.g., Monday: Salmon and rice, Tuesday: Chicken salad..."
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all resize-none text-slate-700 text-sm"
          />
        </div>

        <button
          onClick={() => handleGenerate(manualInput)}
          disabled={loading || !manualInput.trim()}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
            loading ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100'
          }`}
        >
          {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Generate List from Text'}
        </button>
      </div>

      <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
        <i className="fas fa-info-circle text-slate-400 mt-1"></i>
        <p className="text-xs text-slate-500 leading-relaxed">
          Our Smart Grocery Assistant automatically sums up ingredients across different meals and categories them by store section to save you time.
        </p>
      </div>
    </div>
  );
};
