/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import RecipeCard from "../components/RecipeCard";
import { spoonacular } from "../services/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Recipe {
  _id?: string;
  spoonacularId?: number;
  id?: number;
  title: string;
  image: string;
}

interface RandomRecipesResponse {
  recipes: Recipe[];
}

interface RecipeSearchResponse {
  results: Recipe[];
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-CA')
  );
  const [showSavedRecipes, setShowSavedRecipes] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<{ [key: string]: string }>({});

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchProfile = async () => {
    try {
      const res = await axios.get<User>("/profile", { withCredentials: true });
      setUser(res.data);
    } catch (error) {
      console.error("Not logged in:", error);
      setUser(null);
    }
  };

  const fetchSavedRecipes = async () => {
    if (!user) return;
    try {
      const res = await axios.get<Recipe[]>(`${API_BASE}/recipes`, {
        withCredentials: true,
      });
      setSavedRecipes(res.data);
    } catch (err) {
      console.error("Error fetching saved recipes:", err);
    }
  };

  const handleAddToMealPlan = async (
    meal: "breakfast" | "lunch" | "dinner",
    recipe: Recipe
  ) => {
    if (!user) return alert("Please log in to add to meal plan.");
    try {
      await axios.post(
        `${API_BASE}/mealplans`,
        {
          date: selectedDate,
          mealType: meal,
          recipe: {
            spoonacularId: recipe.id || recipe.spoonacularId,
            title: recipe.title,
            image: recipe.image,
          },
        },
        { withCredentials: true }
      );
      alert(`Added to ${meal} meal plan!`);
    } catch (error) {
      console.error("Error adding to meal plan:", error);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!user) return alert("Please log in to save recipes.");
    try {
      await axios.post(
        `${API_BASE}/recipes/save`,
        {
          spoonacularId: recipe.id,
          title: recipe.title,
          image: recipe.image,
        },
        { withCredentials: true }
      );
      fetchSavedRecipes();
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  const handleDeleteRecipe = async (_id: string) => {
    if (!user) return alert("Please log in to delete recipes.");
    try {
      await axios.delete(`${API_BASE}/recipes/${_id}`, { withCredentials: true });
      fetchSavedRecipes();
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) fetchSavedRecipes();
  }, [user]);

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
            "recipes/complexSearch",
            {
              params: { query, diet, number: 24 },
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

  const handleMealSelectChange = (recipeId: string, meal: string) => {
    setSelectedMeals((prev) => ({ ...prev, [recipeId]: meal }));
  };

  const handleAddButtonClick = (recipe: Recipe) => {
    const selectedMeal = selectedMeals[recipe._id || ""] as
      | "breakfast"
      | "lunch"
      | "dinner"
      | undefined;

    if (!selectedMeal) {
      alert("Please select a meal type.");
      return;
    }

    handleAddToMealPlan(selectedMeal, recipe);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        background:
          "linear-gradient(180deg,rgba(18, 28, 20, 1) 10%, rgba(65, 171, 53, 1) 50%, rgba(18, 28, 20, 1) 90%)",
      }}
    >
      <section className="min-h-screen px-4 md:px-12 py-0 text-white">
        <motion.h2
          className="bg-[#121c14]/90 w-full h-[100px] text-7xl font-bold text-green-500 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Recipes
        </motion.h2>

        <motion.div
          className="mb-10 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-3xl font-semibold text-center mt-4 mb-4">
            Saved Recipes
          </h3>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowSavedRecipes(!showSavedRecipes)}
              className="bg-green-500 hover:bg-[#121c14] text-white px-4 py-2 rounded"
            >
              {showSavedRecipes ? "Hide Saved Recipes" : "Show Saved Recipes"}
            </button>
          </div>
          {showSavedRecipes && (
            <div className="bg-[#121c14]/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {savedRecipes.length > 0 ? (
                savedRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe._id}
                    className="border-3 border-green-500 bg-[#121c14] rounded-md p-4 flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                    <h4 className="text-lg font-semibold">{recipe.title}</h4>
                    <div className="flex flex-col gap-2 mt-2 w-full">
                      <select
                        onChange={(e) =>
                          handleMealSelectChange(recipe._id || "", e.target.value)
                        }
                        value={selectedMeals[recipe._id || ""] || ""}
                        className="bg-[#121c14] border border-white text-white px-4 py-1 rounded"
                      >
                        <option value="" disabled>
                          Select Meal Type
                        </option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                      </select>
                      <button
                        onClick={() => handleAddButtonClick(recipe)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                      >
                        Add to Meal Plan
                      </button>
                      <button
                        onClick={() =>
                          recipe._id && handleDeleteRecipe(recipe._id)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center w-full">No saved recipes</p>
              )}
            </div>
          )}
        </motion.div>

        <div className="flex justify-center mb-6">
          <Calendar
            value={date}
            onChange={(newDate) => {
              const d = newDate as Date;
              setDate(d);
              const toLocalDateString = (date: Date) =>
                date.toLocaleDateString('en-CA');
              setSelectedDate(toLocalDateString(d));
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="px-4 py-2 rounded-md bg-[#1d2a20] text-white w-full md:w-[300px]"
          />
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="px-4 py-2 rounded-md bg-[#121c14] text-white w-full md:w-[200px]"
          >
            <option value="">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten free">Gluten Free</option>
            <option value="keto">Keto</option>
          </select>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-stretch"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {recipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <RecipeCard
                recipe={recipe as Required<Pick<Recipe, "id" | "title" | "image">>}
                onAddToMealPlan={handleAddToMealPlan}
                onSave={handleSaveRecipe}
                onDelete={() => {}}
                isSaved={savedRecipes.some(
                  (r) => r.spoonacularId === recipe.id
                )}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
