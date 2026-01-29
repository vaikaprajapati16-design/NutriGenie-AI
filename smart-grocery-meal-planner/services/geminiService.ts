
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, MealPlanResponse, GroceryListResponse, TrackingResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateMealPlan = async (prefs: UserPreferences): Promise<MealPlanResponse> => {
  const prompt = `
    Act as a world-class nutrition expert. Generate a comprehensive 7-day meal plan for a user with the following profile:
    - Diet Type: ${prefs.dietType}
    - Daily Calorie Goal: ${prefs.calorieGoal} kcal
    - Number of Meals per Day: ${prefs.mealsPerDay}
    - Allergies: ${prefs.allergies || 'None'}

    Requirements:
    - Provide exactly 7 days.
    - Each day should have exactly ${prefs.mealsPerDay} meals.
    - Calculate calories for each meal such that the sum is approximately ${prefs.calorieGoal}.
    - Suggest ingredient alternatives for common components.
    - For EVERY meal, provide clear cooking steps (array of strings), estimated cooking time (e.g., "20 mins"), and difficulty (Easy, Medium, or Hard).
    - Include 3 specific nutrition tips relevant to the chosen diet.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weeklyPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.INTEGER },
                dayName: { type: Type.STRING },
                totalCalories: { type: Type.NUMBER },
                meals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      calories: { type: Type.NUMBER },
                      ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                      alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cookingSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cookingTime: { type: Type.STRING },
                      difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
                    },
                    required: ["type", "title", "description", "calories", "ingredients", "alternatives", "cookingSteps", "cookingTime", "difficulty"]
                  }
                }
              },
              required: ["dayNumber", "dayName", "totalCalories", "meals"]
            }
          },
          nutritionTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["weeklyPlan", "nutritionTips"]
      }
    }
  });

  const text = response.text || "";
  try {
    return JSON.parse(text) as MealPlanResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("The AI provided an invalid response format.");
  }
};

export const generateGroceryList = async (mealPlanContent: string): Promise<GroceryListResponse> => {
  const prompt = `
    Act as a smart grocery assistant. Analyze the following weekly meal plan and extract a consolidated, categorized grocery list for the entire week.
    
    CRITICAL RULES:
    1. Group items into these specific categories: Vegetables, Fruit, Dairy & Alternatives, Grains & Legumes, Proteins, Spices & Pantry.
    2. Consolidate quantities for the entire week (e.g., if multiple meals use spinach, sum the total weight or count).
    3. Include specific quantities needed (e.g., "500g", "2 bunches", "1 pack").
    4. Ensure the list is enough for 1 person for 7 days.
    
    Meal Plan Data: 
    ${mealPlanContent}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING }
                    },
                    required: ["name", "quantity"]
                  }
                }
              },
              required: ["category", "items"]
    }
          }
        },
        required: ["categories"]
      }
    }
  });

  const text = response.text || "";
  try {
    return JSON.parse(text) as GroceryListResponse;
  } catch (error) {
    throw new Error("Failed to generate grocery list.");
  }
};

export const analyzeDailyIntake = async (input: string, calorieGoal: number): Promise<TrackingResponse> => {
  const prompt = `
    Act as a professional diet tracking assistant. 
    User input: "${input}"
    Daily Calorie Goal: ${calorieGoal} kcal
    
    1. Estimate the total calories.
    2. Estimate macronutrient breakdown in grams (protein, carbs, fat).
    3. Compare this to the daily goal.
    4. Provide a brief analysis of the nutrition quality.
    5. Suggest adjustments for the next meals or tomorrow to meet the goal.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalCalories: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER }
            },
            required: ["protein", "carbs", "fats"]
          },
          analysis: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["totalCalories", "macros", "analysis", "suggestions"]
      }
    }
  });

  const text = response.text || "";
  try {
    return JSON.parse(text) as TrackingResponse;
  } catch (error) {
    throw new Error("Failed to analyze intake.");
  }
};
