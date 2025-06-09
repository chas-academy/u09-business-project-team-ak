import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import { spoonacular } from "../services/api";

interface Recipe { id: number; title: string; image: string; }
interface RandomRecipesResponse { recipes: Recipe[]; }
interface RecipeSearchResponse { results: Recipe[]; }

export default function Recipes() {
  const today = new Date().toISOString().split("T")[0];
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);

  const handleAddToMealPlan = async (meal: "breakfast" | "lunch" | "dinner", recipe: Recipe) => {
    const stored = localStorage.getItem("mealPlans");
    const mealPlans = stored ? JSON.parse(stored) : {};
    const current = mealPlans[selectedDate] || { breakfast: [], lunch: [], dinner: [] };
    current[meal].push(recipe);
    mealPlans[selectedDate] = current;
    localStorage.setItem("mealPlans", JSON.stringify(mealPlans));

    try {
      const base = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${base}/mealplans`, {
        date: selectedDate,
        mealType: meal,
        recipe: {
          spoonacularId: recipe.id,
          title: recipe.title,
          image: recipe.image
        }
      });
      console.log("Saved to backend");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        if (!query && !diet) {
          const res = await axios.get<RandomRecipesResponse>("https://api.spoonacular.com/recipes/random", {
            params: { apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY, number: 24 }
          });
          setRecipes(res.data.recipes);
        } else {
          const res = await spoonacular.get<RecipeSearchResponse>("recipes/complexSearch", {
            params: { query, diet, number: 24 }
          });
          setRecipes(res.data.results);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipes();
  }, [query, diet]);

  return (
    <section className="min-h-screen bg-[#121c14] px-4 md:px-12 py-12 text-white">
      <h2 className="text-4xl font-bold text-orange-500 text-center mb-8">Recipes</h2>

      <div className="flex justify-center mb-6">
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-4 py-2 rounded-md text-white bg-[#121c14] md:w-[200px]" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" className="px-4 py-2 rounded-md bg-[#1d2a20] text-white w-full md:w-[300px]" />
        <select value={diet} onChange={e => setDiet(e.target.value)} className="px-4 py-2 rounded-md bg-[#121c14] text-white w-full md:w-[200px]">
          <option value="">All Diets</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten free">Gluten Free</option>
          <option value="keto">Keto</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onAddToMealPlan={handleAddToMealPlan}
          />
        ))}
      </div>
    </section>
  );
}
