import React, { useState } from "react";

// Define MealType
export type MealType = "breakfast" | "lunch" | "dinner";

// Define props interface
export interface RecipeCardProps {
  recipe: { id: number; title: string; image: string };
  onAddToMealPlan: (meal: MealType, recipe: { id: number; title: string; image: string }) => void;
}

export default function RecipeCard({ recipe, onAddToMealPlan }: RecipeCardProps) {
  const [selectedMeal, setSelectedMeal] = useState<MealType | "">("");

  const handleAdd = () => {
    if (selectedMeal) {
      onAddToMealPlan(selectedMeal, recipe);
      setSelectedMeal("");
    }
  };

  return (
    <div className="bg-[#121c14] shadow-md p-4 rounded-md">
      <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover rounded" />
      <h2 className="text-lg font-semibold mt-2">{recipe.title}</h2>

      <select
        className="bg-[#121c14] mt-2 border p-2 rounded w-full"
        value={selectedMeal}
        onChange={(e) => setSelectedMeal(e.target.value as MealType)}
      >
        <option value="">Select meal</option>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
      </select>

      <button
        onClick={handleAdd}
        className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
      >
        Add to Meal Plan
      </button>
    </div>
  );
}
