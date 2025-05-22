import { useEffect, useState } from 'react';
import { spoonacular } from '../services/api';

type Recipe = {
  id: number;
  title: string;
  image: string;
  calories?: number;
};

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');

const searchRecipes = async () => {
  try {
    const res = await spoonacular.get<{ results: Recipe[] }>('/recipes/complexSearch', {
      params: {
        query,
        number: 10,
        addRecipeNutrition: true,
      },
    });
    setRecipes(res.data.results);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    searchRecipes();
  }, []);

  const handleAddToMealPlan = (recipe: Recipe, mealType: string) => {
    const stored = JSON.parse(localStorage.getItem('mealPlan') || '{}');
    stored[mealType] = recipe;
    localStorage.setItem('mealPlan', JSON.stringify(stored));
    alert(`${recipe.title} added to ${mealType}`);
  };

  return (
    <div>
      <h2>Recipes</h2>
      <input
        type="text"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchRecipes}>Search</button>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <h3>{recipe.title}</h3>
            <img src={recipe.image} alt={recipe.title} width="200" />
            <div>
              <button onClick={() => handleAddToMealPlan(recipe, 'breakfast')}>Add to Breakfast</button>
              <button onClick={() => handleAddToMealPlan(recipe, 'lunch')}>Add to Lunch</button>
              <button onClick={() => handleAddToMealPlan(recipe, 'dinner')}>Add to Dinner</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
