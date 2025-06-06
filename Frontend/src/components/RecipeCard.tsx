import { useState } from "react";

type RecipeCardProps = {
  id: number;
  title: string;
  image: string;
  sourceUrl: string;
  onAddToMealPlan: (
    meal: "breakfast" | "lunch" | "dinner",
    recipe: { id: number; title: string; image: string }
  ) => void;
};

export default function RecipeCard({
  id,
  title,
  image,
  sourceUrl,
  onAddToMealPlan,
}: RecipeCardProps) {
  const [selectedMeal, setSelectedMeal] = useState("");

  const handleAdd = () => {
    if (onAddToMealPlan && selectedMeal) {
      onAddToMealPlan(selectedMeal as "breakfast" | "lunch" | "dinner", {
        id,
        title,
        image,
      });
      setSelectedMeal(""); // reset
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300 w-full">
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View recipe for ${title}`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-orange-500 font-semibold mt-2">
            View Recipe →
          </p>
        </div>
      </a>

      {/* Meal Plan Add Controls */}
      <div className="px-4 pb-4">
        <select
          value={selectedMeal}
          onChange={(e) => setSelectedMeal(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mb-2"
        >
          <option value="">Add to meal...</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
        <button
          disabled={!selectedMeal}
          onClick={handleAdd}
          className="w-full bg-orange-500 text-white py-1.5 rounded-md hover:bg-orange-600 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}
