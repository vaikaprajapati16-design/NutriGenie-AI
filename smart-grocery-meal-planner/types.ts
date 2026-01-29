
export interface User {
  id: string;
  username: string;
  name: string;
}

export interface Meal {
  type: string;
  title: string;
  description: string;
  calories: number;
  ingredients: string[];
  alternatives: string[];
  cookingSteps: string[];
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface DayPlan {
  dayNumber: number;
  dayName: string;
  meals: Meal[];
  totalCalories: number;
}

export interface MealPlanResponse {
  weeklyPlan: DayPlan[];
  nutritionTips: string[];
}

export interface GroceryItem {
  name: string;
  quantity: string;
}

export interface GroceryCategory {
  category: string;
  items: GroceryItem[];
}

export interface GroceryListResponse {
  categories: GroceryCategory[];
}

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fats: number;
}

export interface TrackingResponse {
  totalCalories: number;
  macros: MacroBreakdown;
  analysis: string;
  suggestions: string[];
}

export interface UserPreferences {
  dietType: string;
  calorieGoal: number;
  mealsPerDay: number;
  allergies: string;
  waterGoal?: number;
}
