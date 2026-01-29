
import React from 'react';
import { DayPlan } from '../types';

interface VisualCalendarProps {
  days: DayPlan[];
  activeDay: number;
  onDaySelect: (dayNumber: number) => void;
}

export const VisualCalendar: React.FC<VisualCalendarProps> = ({ days, activeDay, onDaySelect }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <i className="fas fa-calendar-alt text-emerald-500"></i> Weekly Schedule
        </h3>
        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
          7 Days Planned
        </span>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
          {days.map((day) => {
            const isActive = activeDay === day.dayNumber;
            // Shorten day name (e.g., Monday -> Mon)
            const shortDayName = day.dayName.substring(0, 3);
            
            return (
              <button
                key={day.dayNumber}
                onClick={() => onDaySelect(day.dayNumber)}
                className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 transform active:scale-95 ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 ring-2 ring-emerald-500 ring-offset-2' 
                    : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-transparent hover:border-emerald-100'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 opacity-70 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`}>
                  {shortDayName}
                </span>
                <span className="text-xl font-black leading-none mb-2">
                  {day.dayNumber}
                </span>
                
                <div className="mt-auto w-full flex flex-col items-center">
                  <div className={`h-1 w-8 rounded-full mb-1 ${isActive ? 'bg-white/40' : 'bg-slate-200 group-hover:bg-emerald-200'}`}>
                    <div 
                      className={`h-full rounded-full ${isActive ? 'bg-white' : 'bg-emerald-500'}`} 
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                  <span className={`text-[9px] font-bold whitespace-nowrap ${isActive ? 'text-emerald-50' : 'text-slate-400'}`}>
                    {day.totalCalories} kcal
                  </span>
                </div>

                {isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                    <i className="fas fa-check text-[8px] text-emerald-600"></i>
                  </div>
                )}
              </button>
            );
          })}
          
          {/* Filler if needed for a 7-day row on mobile */}
          <div className="hidden max-md:flex col-span-1 items-center justify-center opacity-20">
             <i className="fas fa-ellipsis-h text-slate-300"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-emerald-50/50 px-6 py-2 border-t border-emerald-50 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Selected Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Remaining</span>
        </div>
      </div>
    </div>
  );
};
