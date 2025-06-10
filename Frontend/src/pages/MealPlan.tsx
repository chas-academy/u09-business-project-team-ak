import { useEffect, useState } from "react";
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getNutritionInfo, getRecipeInstructions } from "../services/spoonacularApi";
import { motion } from 'framer-motion';

interface Recipe {
  _id: string;
  spoonacularId: number;
  title: string;
  image: string;
}
interface RecipeInfo { [key: number]: string; }
interface DailyMealPlan {
  breakfast: Recipe[];
  lunch: Recipe[];
  dinner: Recipe[];
}
interface MacroTotals {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

export default function MealPlan() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [mealPlan, setMealPlan] = useState<DailyMealPlan>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [instructions, setInstructions] = useState<RecipeInfo>({});
  const [macros, setMacros] = useState<MacroTotals>({
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
  });
  const [mealMacros, setMealMacros] = useState<Record<keyof DailyMealPlan, MacroTotals>>({
    breakfast: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 },
    lunch: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 },
    dinner: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 },
  });

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/mealplans/${selectedDate}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!data || data.error) {
          setMealPlan({ breakfast: [], lunch: [], dinner: [] });
          return;
        }
        setMealPlan({
          breakfast: data.breakfast || [],
          lunch: data.lunch || [],
          dinner: data.dinner || [],
        });
      } catch (error) {
        console.error("Error fetching meal plan:", error);
      }
    };

    fetchMealPlan();
  }, [selectedDate]);

  useEffect(() => {
    const loadNutritionAndInstructions = async () => {
      const allRecipes = [...mealPlan.breakfast, ...mealPlan.lunch, ...mealPlan.dinner];
      const totals: MacroTotals = { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
      const mealSpecificTotals: Record<keyof DailyMealPlan, MacroTotals> = {
        breakfast: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 },
        lunch: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 },
        dinner: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 },
      };
      const newInstr: RecipeInfo = {};

      await Promise.all(allRecipes.map(async r => {
        try {
          const nut = await getNutritionInfo(r.spoonacularId);
          const parse = (s: string) => parseFloat(s.replace(/[^\d.]/g, ""));
          const mealType = ["breakfast", "lunch", "dinner"].find(type =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mealPlan as any)[type].some((meal: Recipe) => meal._id === r._id)
          ) as keyof DailyMealPlan;

          const cals = parse(nut.calories);
          const prot = parse(nut.protein);
          const fat = parse(nut.fat);
          const carbs = parse(nut.carbs);

          totals.calories += cals;
          totals.protein += prot;
          totals.fat += fat;
          totals.carbohydrates += carbs;

          mealSpecificTotals[mealType].calories += cals;
          mealSpecificTotals[mealType].protein += prot;
          mealSpecificTotals[mealType].fat += fat;
          mealSpecificTotals[mealType].carbohydrates += carbs;

          const ins = await getRecipeInstructions(r.spoonacularId);
          newInstr[r.spoonacularId] = ins || "No instructions.";
        } catch (error) {
          console.error(`Error loading recipe ${r.spoonacularId}:`, error);
        }
      }));

      setMacros(totals);
      setMealMacros(mealSpecificTotals);
      setInstructions(newInstr);
    };

    loadNutritionAndInstructions();
  }, [mealPlan]);

  const deleteRecipe = async (meal: keyof DailyMealPlan, recipeId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/mealplan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          date: selectedDate,
          mealType: meal,
          removeRecipeId: recipeId,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMealPlan({
        ...mealPlan,
        [meal]: mealPlan[meal].filter(r => r._id !== recipeId),
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const renderMacroBox = (macros: MacroTotals) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1d2a20] border-6 border-green-800 p-4 rounded-lg text-lg font-bold text-white mb-4 w-full"
    >
      <div className="flex flex-wrap justify-between text-center">
        <span>Calories: {macros.calories.toFixed(0)} kcal</span>
        <span>Protein: {macros.protein.toFixed(1)} g</span>
        <span>Fat: {macros.fat.toFixed(1)} g</span>
        <span>Carbs: {macros.carbohydrates.toFixed(1)} g</span>
      </div>
    </motion.div>
  );

  const renderSection = (title: string, meals: Recipe[], type: keyof DailyMealPlan) => (
    <div key={title} className="mb-10">
      <h3 className="text-4xl text-white mb-4 font-bold text-center">{title}</h3>
      
      {/* Macro Box with animation */}
      <div className="max-w-7xl mx-auto">
        {renderMacroBox(mealMacros[type])}
      </div>

      {/* Recipes Grid */}
      <div className="bg-[#121c14]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {meals.map(r => (
          <div key={r._id} className="border-8 border-green-800 bg-[#121c14] text-white p-4 rounded shadow relative">
            <img src={r.image} alt={r.title} className="w-full h-40 object-cover rounded" />
            <h4 className="text-lg font-semibold mt-2">{r.title}</h4>
            <p className="text-sm mt-2 text-white">{instructions[r.spoonacularId] || "Loading..."}</p>
            <button
              onClick={() => deleteRecipe(type, r._id)}
              className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded text-white"
            >
              ✕
            </button>
          </div>
        ))}
        {meals.length === 0 && <p className="text-gray-400 text-center col-span-full">No recipes added.</p>}
      </div>
    </div>
  );

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      const offsetDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
      setSelectedDate(offsetDate.toISOString().split("T")[0]);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      const offsetDate = new Date(value[0].getTime() - value[0].getTimezoneOffset() * 60000);
      setSelectedDate(offsetDate.toISOString().split("T")[0]);
    }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        background:
          'linear-gradient(180deg,rgba(18, 28, 20, 1) 10%, rgba(65, 171, 53, 1) 50%, rgba(18, 28, 20, 1) 90%)',
      }}
    >
      <section className="min-h-screen text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="bg-[#121c14]/90 w-full h-[100px] text-7xl font-bold text-green-500 text-center mb-8">MealPlan</h2>
          
          {/* Calendar */}
          <div className="flex justify-center mb-10">
            <Calendar
              onChange={handleDateChange}
              value={new Date(selectedDate)}
              className="react-calendar p-4 rounded-lg bg-[#121c14] text-white"
            />
          </div>

          {renderSection("Breakfast", mealPlan.breakfast, "breakfast")}
          {renderSection("Lunch", mealPlan.lunch, "lunch")}
          {renderSection("Dinner", mealPlan.dinner, "dinner")}

          {/* Total Macros */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1d2a20] p-6 rounded-lg max-w-xl mx-auto mt-12"
          >
            <h3 className="text-3xl font-bold text-white mb-4 text-center">Macro Totals</h3>
            <div className="flex flex-wrap justify-between text-white text-center">
              <span>Calories: {macros.calories.toFixed(0)} kcal</span>
              <span>Protein: {macros.protein.toFixed(1)} g</span>
              <span>Fat: {macros.fat.toFixed(1)} g</span>
              <span>Carbs: {macros.carbohydrates.toFixed(1)} g</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
