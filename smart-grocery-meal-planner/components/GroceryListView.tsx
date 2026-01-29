
import React from 'react';
import { GroceryListResponse } from '../types';

interface GroceryListViewProps {
  list: GroceryListResponse;
  onClose: () => void;
}

export const GroceryListView: React.FC<GroceryListViewProps> = ({ list, onClose }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-clipboard-check"></i> Shopping Checklist
          </h3>
          <p className="text-indigo-100 text-sm">Categorized and summed for your week</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => window.print()}
            className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-400 transition-colors"
            title="Print List"
          >
            <i className="fas fa-print"></i>
          </button>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-400 transition-colors"
            title="Go Back"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
      </div>
      
      <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {list.categories.map((cat, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                {cat.category}
              </h4>
              <ul className="space-y-3">
                {cat.items.map((item, iIdx) => (
                  <li key={iIdx} className="group flex items-start justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-slate-800 text-sm font-semibold">{item.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
        <button 
          onClick={() => window.print()}
          className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-print"></i> Save as PDF
        </button>
        <button 
          onClick={onClose}
          className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          New List
        </button>
      </div>
    </div>
  );
};
