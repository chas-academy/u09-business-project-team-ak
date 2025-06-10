import React, { useState } from "react";

export type MealType = "breakfast" | "lunch" | "dinner";

export interface RecipeCardProps {
  recipe: {
    id: number;
    title: string;
    image: string;
  };
  onAddToMealPlan: (meal: MealType, recipe: { id: number; title: string; image: string }) => void;
  onSave: (recipe: { id: number; title: string; image: string }) => void;
  onDelete: (id: number) => void;
  isSaved: boolean;
}

export default function RecipeCard({ recipe, onAddToMealPlan, onSave, isSaved }: RecipeCardProps) {
  const [selectedMeal, setSelectedMeal] = useState<MealType | "">("");

  const handleAdd = () => {
    if (selectedMeal) {
      onAddToMealPlan(selectedMeal, recipe);
      setSelectedMeal("");
    }
  };

  return (
    <div className="bg-[#121c14] border-2 border-green-500 shadow-md p-4 rounded-md flex flex-col h-full">
      <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover rounded" />
      <h2 className="text-lg font-semibold mt-2">{recipe.title}</h2>

      <a
        href={`https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-").toLowerCase()}-${recipe.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-400 hover:underline mt-1"
      >
        View Instructions
      </a>

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
        className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
      >
        Add to Meal Plan
      </button>

      {!isSaved && (
        <button
          onClick={() => onSave(recipe)}
          className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Save Recipe
        </button>
      )}
    </div>
  );
}
