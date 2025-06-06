import { useEffect, useState } from "react";
import axios from "axios";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface NutritionData {
  calories: string;
  protein: string;
  fat: string;
  carbohydrates: string;
}

interface RecipeInfo {
  [key: number]: string;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type Day = typeof daysOfWeek[number];

interface DailyMealPlan {
  breakfast: Recipe[];
  lunch: Recipe[];
  dinner: Recipe[];
}

type WeeklyMealPlan = {
  [key in Day]: DailyMealPlan;
};

export default function MealPlan() {
  const [selectedDay, setSelectedDay] = useState<Day>("Monday");
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<WeeklyMealPlan>(() =>
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { breakfast: [], lunch: [], dinner: [] };
      return acc;
    }, {} as WeeklyMealPlan)
  );

  const [instructions, setInstructions] = useState<RecipeInfo>({});
  const [macros, setMacros] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
  });

  const currentMealPlan = weeklyMealPlan[selectedDay];

  useEffect(() => {
    const stored = localStorage.getItem("weeklyMealPlan");
    if (stored) {
      setWeeklyMealPlan(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const fetchMacros = async () => {
      const allRecipes = [
        ...currentMealPlan.breakfast,
        ...currentMealPlan.lunch,
        ...currentMealPlan.dinner,
      ];

      const totals = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
      };

      await Promise.all(
        allRecipes.map(async (recipe) => {
          try {
            const res = await axios.get<NutritionData>(
              `https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json`,
              {
                params: {
                  apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY,
                },
              }
            );

            const parseValue = (str: string) =>
              parseFloat(str.replace(/[^\d.]/g, ""));

            totals.calories += parseValue(res.data.calories);
            totals.protein += parseValue(res.data.protein);
            totals.fat += parseValue(res.data.fat);
            totals.carbohydrates += parseValue(res.data.carbohydrates);
          } catch {
            console.error(`Nutrition fetch failed for recipe ${recipe.id}`);
          }
        })
      );

      setMacros(totals);
    };

    const fetchInstructions = async () => {
      const allRecipes = [
        ...currentMealPlan.breakfast,
        ...currentMealPlan.lunch,
        ...currentMealPlan.dinner,
      ];

      const newInstructions: RecipeInfo = {};

      await Promise.all(
        allRecipes.map(async (recipe) => {
          try {
            const res = await axios.get<{ instructions: string }>(
              `https://api.spoonacular.com/recipes/${recipe.id}/information`,
              {
                params: {
                  apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY,
                },
              }
            );
            newInstructions[recipe.id] =
              res.data.instructions || "No instructions.";
          } catch {
            newInstructions[recipe.id] = "Instructions unavailable.";
          }
        })
      );

      setInstructions(newInstructions);
    };

    fetchMacros();
    fetchInstructions();
  }, [currentMealPlan]);

  const handleDeleteRecipe = (
    mealType: keyof DailyMealPlan,
    recipeId: number
  ) => {
    const updatedDayPlan = {
      ...currentMealPlan,
      [mealType]: currentMealPlan[mealType].filter(
        (recipe) => recipe.id !== recipeId
      ),
    };

    const updatedWeekPlan = {
      ...weeklyMealPlan,
      [selectedDay]: updatedDayPlan,
    };

    setWeeklyMealPlan(updatedWeekPlan);
    localStorage.setItem("weeklyMealPlan", JSON.stringify(updatedWeekPlan));
  };

  const renderMealSection = (
    title: string,
    meals: Recipe[],
    type: keyof DailyMealPlan
  ) => (
    <div>
      <h3 className="text-2xl text-orange-400 font-bold mb-4 text-center">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {meals.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white text-black p-4 rounded-md shadow-md relative"
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-40 object-cover rounded"
            />
            <h4 className="text-lg font-semibold mt-2">{recipe.title}</h4>
            <p className="text-sm mt-2 text-gray-700">
              {instructions[recipe.id] || "Loading instructions..."}
            </p>
            <button
              onClick={() => handleDeleteRecipe(type, recipe.id)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white text-sm px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        {meals.length === 0 && (
          <p className="text-gray-400 text-center col-span-full">
            No recipes added.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#121c14] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-orange-500 text-center mb-6">
          Weekly Meal Plan
        </h2>

        {/* Day Selector */}
        <div className="flex justify-center mb-10">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value as Day)}
            className="text-lg p-3 bg-green-700 text-white rounded-md shadow"
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {renderMealSection("Breakfast", currentMealPlan.breakfast, "breakfast")}
        {renderMealSection("Lunch", currentMealPlan.lunch, "lunch")}
        {renderMealSection("Dinner", currentMealPlan.dinner, "dinner")}

        {/* Macro Summary */}
        <div className="bg-[#1d2a20] p-6 rounded-lg shadow-lg mt-12 max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-orange-500 mb-4">Macro Totals</h3>
          <ul className="text-lg space-y-2">
            <li>Calories: {macros.calories.toFixed(0)} kcal</li>
            <li>Protein: {macros.protein.toFixed(1)} g</li>
            <li>Fat: {macros.fat.toFixed(1)} g</li>
            <li>Carbohydrates: {macros.carbohydrates.toFixed(1)} g</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
