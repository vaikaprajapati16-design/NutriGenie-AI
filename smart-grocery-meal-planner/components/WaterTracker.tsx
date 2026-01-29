
import React from 'react';

interface WaterTrackerProps {
  current: number;
  goal: number;
  onUpdate: (amount: number) => void;
  onSetGoal: (goal: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ current, goal, onUpdate, onSetGoal }) => {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-blue-800 font-bold flex items-center gap-2 text-sm">
          <i className="fas fa-droplet animate-pulse"></i> Water Intake
        </h3>
        <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded-lg border border-blue-100">
          {percentage}% of daily goal
        </span>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full bg-blue-100 rounded-full overflow-hidden border border-blue-200 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700 ease-out flex items-center justify-end px-2"
            style={{ width: `${percentage}%` }}
          >
            {percentage > 15 && <div className="w-1 h-1 bg-white rounded-full opacity-50 animate-ping"></div>}
          </div>
        </div>
        <div className="flex justify-between items-center text-[10px] font-black text-blue-400 uppercase tracking-widest">
          <span>{current}ml</span>
          <span>Goal: {goal}ml</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => onUpdate(250)}
          className="bg-white border border-blue-200 text-blue-600 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <i className="fas fa-glass-water"></i> +250ml
        </button>
        <button 
          onClick={() => onUpdate(500)}
          className="bg-white border border-blue-200 text-blue-600 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <i className="fas fa-bottle-water"></i> +500ml
        </button>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-blue-100">
        <button 
          onClick={() => onUpdate(-current)}
          className="text-[10px] text-blue-400 hover:text-blue-600 font-bold uppercase"
        >
          Reset
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-blue-400 font-bold uppercase">Target:</span>
          <select 
            value={goal} 
            onChange={(e) => onSetGoal(Number(e.target.value))}
            className="text-[10px] bg-transparent font-bold text-blue-600 focus:outline-none cursor-pointer"
          >
            <option value={1500}>1.5L</option>
            <option value={2000}>2.0L</option>
            <option value={2500}>2.5L</option>
            <option value={3000}>3.0L</option>
          </select>
        </div>
      </div>
    </div>
  );
};
