import React from "react";

interface MealSlotProps {
  title: string;
  recipeId?: number;
  instructions?: string;
}

export default function MealSlot({ title, recipeId, instructions }: MealSlotProps) {
  return (
    <div className="mb-10 text-white text-center">
      <h3 className="text-3xl font-extrabold mb-4 text-orange-400">{title}</h3>

      {/* Recipe ID Box */}
      <div className="bg-orange-500 py-4 px-6 rounded-t-lg text-xl font-semibold tracking-wide">
        {recipeId ? `Recipe ID: ${recipeId}` : "No Recipe Selected"}
      </div>

      {/* Instructions Box */}
      <div className="bg-green-600 py-4 px-6 rounded-b-lg text-left text-white">
        {instructions ? (
          <div
            className="prose prose-invert max-w-full"
            dangerouslySetInnerHTML={{ __html: instructions }}
          />
        ) : (
          <p className="text-white font-medium text-lg">No instructions available.</p>
        )}
      </div>
    </div>
  );
}
