import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import { spoonacular } from "../services/api";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface RandomRecipesResponse {
  recipes: Recipe[];
}

interface RecipeSearchResponse {
  results: Recipe[];
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const handleAddToMealPlan = async (
    meal: "breakfast" | "lunch" | "dinner",
    recipe: Recipe
  ) => {
    // Update localStorage
    const existing = localStorage.getItem("mealPlan");
    const plan = existing
      ? JSON.parse(existing)
      : {
          Monday: { breakfast: [], lunch: [], dinner: [] },
          Tuesday: { breakfast: [], lunch: [], dinner: [] },
          Wednesday: { breakfast: [], lunch: [], dinner: [] },
          Thursday: { breakfast: [], lunch: [], dinner: [] },
          Friday: { breakfast: [], lunch: [], dinner: [] },
          Saturday: { breakfast: [], lunch: [], dinner: [] },
          Sunday: { breakfast: [], lunch: [], dinner: [] },
        };

    plan[selectedDay][meal].push(recipe);
    localStorage.setItem("mealPlan", JSON.stringify(plan));

    // Send to backend
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${apiBase}/mealplans`, {
        day: selectedDay,
        mealType: meal,
        recipe: {
          spoonacularId: recipe.id,
          title: recipe.title,
          image: recipe.image,
        },
      });
      console.log("Meal plan saved to backend.");
    } catch (error) {
      console.error("Error saving meal plan to backend:", error);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        if (!query && !diet) {
          const res = await axios.get<RandomRecipesResponse>(
            "https://api.spoonacular.com/recipes/random",
            {
              params: {
                apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY,
                number: 24,
              },
            }
          );
          setRecipes(res.data.recipes);
        } else {
          const res = await spoonacular.get<RecipeSearchResponse>(
            "https://api.spoonacular.com/recipes/complexSearch",
            {
              params: {
                apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY,
                query,
                diet,
                number: 24,
              },
            }
          );
          setRecipes(res.data.results);
        }
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    fetchRecipes();
  }, [query, diet]);

  return (
    <section className="min-h-screen bg-[#121c14] px-4 md:px-12 py-12 text-white">
      <h2 className="text-4xl font-bold text-orange-500 text-center mb-8">
        Recipes
      </h2>

      {/* Day Selector */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 bg-[#121c14] text-white w-full md:w-[200px]"
        >
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="px-4 py-2 rounded-md border border-gray-300 text-white w-full md:w-[300px] bg-[#1d2a20]"
        />
        <select
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 bg-[#121c14] text-white w-full md:w-[200px]"
        >
          <option value="">All Diets</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="keto">Keto</option>
          <option value="gluten free">Gluten Free</option>
        </select>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            image={recipe.image}
            sourceUrl={`https://spoonacular.com/recipes/${recipe.title
              .replace(/\s+/g, "-")
              .toLowerCase()}-${recipe.id}`}
            onAddToMealPlan={handleAddToMealPlan}
          />
        ))}
      </div>
    </section>
  );
}
