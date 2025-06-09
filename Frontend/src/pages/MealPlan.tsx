import { useEffect, useState, useMemo } from "react";
import axios from "axios";

interface Recipe {
  id: number; title: string; image: string;
}
interface NutritionData { calories: string; protein: string; fat: string; carbohydrates: string; }
interface RecipeInfo { [key: number]: string; }
interface DailyMealPlan { breakfast: Recipe[]; lunch: Recipe[]; dinner: Recipe[]; }
type MealPlansByDate = { [date: string]: DailyMealPlan; }

export default function MealPlan() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [mealPlans, setMealPlans] = useState<MealPlansByDate>({});
  const [instructions, setInstructions] = useState<RecipeInfo>({});
  const [macros, setMacros] = useState({ calories: 0, protein: 0, fat: 0, carbohydrates: 0 });

  const currentMealPlan = useMemo(
    () => mealPlans[selectedDate] || { breakfast: [], lunch: [], dinner: [] },
    [mealPlans, selectedDate]
  );

  useEffect(() => {
    const stored = localStorage.getItem("mealPlans");
    if (stored) setMealPlans(JSON.parse(stored));
  }, []);

  useEffect(() => {
    async function loadData() {
      const all = [...currentMealPlan.breakfast, ...currentMealPlan.lunch, ...currentMealPlan.dinner];
      const totals = { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
      const newInstr: RecipeInfo = {};

      await Promise.all(all.map(async r => {
        try {
          const nut = await axios.get<NutritionData>(
            `https://api.spoonacular.com/recipes/${r.id}/nutritionWidget.json`,
            { params: { apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY } }
          );
          const parse = (s: string) => parseFloat(s.replace(/[^\d.]/g, ""));
          totals.calories += parse(nut.data.calories);
          totals.protein += parse(nut.data.protein);
          totals.fat += parse(nut.data.fat);
          totals.carbohydrates += parse(nut.data.carbohydrates);

          const ins = await axios.get<{ instructions: string }>(
            `https://api.spoonacular.com/recipes/${r.id}/information`,
            { params: { apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY } }
          );
          newInstr[r.id] = ins.data.instructions || "No instructions.";
        } catch {
          console.error(`Error loading recipe ${r.id}`);
        }
      }));

      setMacros(totals);
      setInstructions(newInstr);
    }

    loadData();
  }, [currentMealPlan]);

  const deleteRecipe = (meal: keyof DailyMealPlan, id: number) => {
    const updated = {
      ...mealPlans,
      [selectedDate]: {
        ...currentMealPlan,
        [meal]: currentMealPlan[meal].filter(r => r.id !== id),
      }
    };
    setMealPlans(updated);
    localStorage.setItem("mealPlans", JSON.stringify(updated));
  };

  const renderSection = (title: string, meals: Recipe[], type: keyof DailyMealPlan) => (
    <div key={title}>
      <h3 className="text-2xl text-orange-400 mb-4 text-center">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.map(r => (
          <div key={r.id} className="bg-white text-black p-4 rounded shadow relative">
            <img src={r.image} alt={r.title} className="w-full h-40 object-cover rounded" />
            <h4 className="text-lg font-semibold mt-2">{r.title}</h4>
            <p className="text-sm mt-2 text-gray-700">{instructions[r.id] || "Loading..."}</p>
            <button onClick={() => deleteRecipe(type, r.id)} className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded text-white">✕</button>
          </div>
        ))}
        {meals.length === 0 && <p className="text-gray-400 text-center">No recipes added.</p>}
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#121c14] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl text-orange-500 text-center mb-6">Meal Plan by Date</h2>
        <div className="flex justify-center mb-10">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="rounded-md p-3 bg-green-700 text-white" />
        </div>
        {renderSection("Breakfast", currentMealPlan.breakfast, "breakfast")}
        {renderSection("Lunch", currentMealPlan.lunch, "lunch")}
        {renderSection("Dinner", currentMealPlan.dinner, "dinner")}

        <div className="bg-[#1d2a20] p-6 rounded-lg max-w-xl mx-auto mt-12">
          <h3 className="text-2xl text-orange-500 mb-4">Macro Totals</h3>
          <ul className="space-y-2">
            <li>Calories: {macros.calories.toFixed(0)} kcal</li>
            <li>Protein: {macros.protein.toFixed(1)} g</li>
            <li>Fat: {macros.fat.toFixed(1)} g</li>
            <li>Carbs: {macros.carbohydrates.toFixed(1)} g</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
