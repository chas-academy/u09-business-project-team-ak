import React, { useEffect, useState } from "react";
import { getNutritionInfo } from "../services/spoonacularApi";

interface MealSlotProps {
  title: string;
  recipeId?: number;
}

interface NutritionInfo {
  calories: string;
  carbs: string;
  fat: string;
  protein: string;
}

export default function MealSlot({ title, recipeId }: MealSlotProps) {
  const [nutrition, setNutrition] = useState<NutritionInfo | null>(null);

  useEffect(() => {
    const fetchNutrition = async () => {
      if (!recipeId) return;
      try {
        const data = await getNutritionInfo(recipeId);
        setNutrition(data);
      } catch (err) {
        console.error("Failed to fetch nutrition:", err);
      }
    };

    fetchNutrition();
  }, [recipeId]);

  return (
    <div className="mb-10 text-white text-center">
      <h3 className="text-3xl font-extrabold mb-4 text-orange-400">{title}</h3>
      <div className="bg-orange-500 py-4 px-6 rounded-t-lg text-xl font-semibold tracking-wide">
        {recipeId ? `Recipe ID: ${recipeId}` : "No Recipe Selected"}
      </div>
      <div className="bg-green-600 py-4 px-6 rounded-b-lg text-left text-white">
        {nutrition ? (
          <div className="text-lg space-y-1">
            <p><strong>Calories:</strong> {nutrition.calories}</p>
            <p><strong>Carbs:</strong> {nutrition.carbs}</p>
            <p><strong>Fat:</strong> {nutrition.fat}</p>
            <p><strong>Protein:</strong> {nutrition.protein}</p>
          </div>
        ) : (
          <p className="text-white font-medium text-lg">No nutritional information available.</p>
        )}
      </div>
    </div>
  );
}
