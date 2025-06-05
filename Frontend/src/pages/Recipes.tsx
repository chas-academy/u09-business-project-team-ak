import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import { spoonacular } from "../services/api";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface RecipeResponse {
  results: Recipe[];
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState("");

useEffect(() => {
  const fetchRecipes = async () => {
    try {
      let res;

      if (!query && !diet) {
        // Show 20 random recipes by default
        res = await axios.get<{ recipes: Recipe[] }>(
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
        // Use complexSearch when filters are used
        const searchRes = await spoonacular.get<RecipeResponse>(
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
        setRecipes(searchRes.data.results);
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  fetchRecipes();
}, [query, diet]);



  return (
    <section className="min-h-screen bg-[#121c14] px-4 md:px-12 py-12 text-white">
      <h2 className="text-4xl font-bold text-orange-500 text-center mb-8">Recipes</h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="px-4 py-2 rounded-md border border-gray-300 text-white w-full md:w-[300px]"
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
            title={recipe.title}
            image={recipe.image}
            sourceUrl={`https://spoonacular.com/recipes/${recipe.title
              .replace(/\s+/g, "-")
              .toLowerCase()}-${recipe.id}`}
          />
        ))}
      </div>
    </section>
  );
}
