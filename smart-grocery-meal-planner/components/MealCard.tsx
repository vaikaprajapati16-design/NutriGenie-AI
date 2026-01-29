
import React, { useState, useEffect, useId } from 'react';
import { Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  onFavoriteChange?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const instructionsId = useId();

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('nutrigenie_favorites') || '[]');
    setIsFavorite(favorites.some((f: Meal) => f.title === meal.title));
  }, [meal.title]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('nutrigenie_favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((f: Meal) => f.title !== meal.title);
    } else {
      newFavorites = [...favorites, meal];
    }
    
    localStorage.setItem('nutrigenie_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Hard': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <article className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col h-full overflow-hidden">
      {/* Favorite Button */}
      <button 
        onClick={toggleFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        className={`absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center transition-all transform active:scale-75 z-10 focus-visible:ring-2 focus-visible:ring-rose-500 focus:outline-none ${
          isFavorite 
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
            : 'bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
        }`}
      >
        <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-lg`} aria-hidden="true"></i>
      </button>

      {/* Header Info */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-3 py-1 bg-emerald-700 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-sm">
            {meal.type}
          </span>
          <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${getDifficultyColor(meal.difficulty)}`}>
            {meal.difficulty}
          </span>
          {meal.cookingTime && (
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black rounded-lg uppercase tracking-widest flex items-center gap-1.5 border border-slate-200">
              <i className="far fa-clock" aria-hidden="true"></i> {meal.cookingTime}
            </span>
          )}
        </div>
        <h4 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors pr-8">
          {meal.title}
        </h4>
      </div>

      {/* Calorie Meter */}
      <div className="flex items-center gap-4 mb-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
        <div className="flex-1" role="img" aria-label={`Calories: ${meal.calories} kcal`}>
          <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <span>Energy</span>
            <span className="text-slate-900 font-black">{meal.calories} kcal</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full" 
              style={{ width: `${Math.min((meal.calories / 800) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-2 italic">
        "{meal.description}"
      </p>

      {/* Lists Section */}
      <div className="space-y-6 flex-1">
        {/* Ingredients */}
        <section aria-label="Ingredients">
          <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center">
            <i className="fas fa-carrot mr-2 text-orange-600" aria-hidden="true"></i> Ingredients List
          </h5>
          <div className="flex flex-wrap gap-2">
            {meal.ingredients.map((ing, idx) => (
              <span key={idx} className="text-xs text-slate-800 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-2" aria-hidden="true"></span>
                {ing}
              </span>
            ))}
          </div>
        </section>

        {/* Alternatives */}
        {meal.alternatives && meal.alternatives.length > 0 && (
          <section className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100" aria-label="Ingredient Swaps">
            <h5 className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2 flex items-center">
              <i className="fas fa-exchange-alt mr-2" aria-hidden="true"></i> Healthy Swaps
            </h5>
            <div className="flex flex-wrap gap-2">
              {meal.alternatives.map((alt, idx) => (
                <span key={idx} className="text-[11px] font-bold text-blue-800">
                  {idx > 0 && <span className="text-blue-300 mx-1" aria-hidden="true">•</span>} {alt}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Collapsible Steps */}
        {meal.cookingSteps && meal.cookingSteps.length > 0 && (
          <div className="pt-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls={instructionsId}
              className={`w-full py-4 rounded-2xl border flex items-center justify-center gap-3 font-black text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none ${
                isExpanded 
                ? 'bg-slate-800 text-white border-slate-800 shadow-xl' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
              }`}
            >
              <i className={`fas ${isExpanded ? 'fa-times' : 'fa-list-check'}`} aria-hidden="true"></i>
              {isExpanded ? 'Close Instructions' : 'View Cooking Steps'}
            </button>

            {isExpanded && (
              <div 
                id={instructionsId}
                className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="space-y-4 p-5 bg-slate-50 rounded-3xl border border-slate-200">
                  {meal.cookingSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group/step">
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-xs font-black text-slate-800 shadow-sm group-hover/step:bg-emerald-600 group-hover/step:text-white group-hover/step:border-emerald-600 transition-colors" aria-hidden="true">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed pt-1">
                        <span className="sr-only">Step {idx + 1}: </span>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
