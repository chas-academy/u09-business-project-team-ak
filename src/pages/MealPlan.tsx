import { useEffect, useState } from 'react';

type Meal = {
  id: number;
  title: string;
  image: string;
  calories?: number;
};

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState<{ [key: string]: Meal | null }>({
    breakfast: null,
    lunch: null,
    dinner: null
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('mealPlan') || '{}');
    setMealPlan({
      breakfast: stored.breakfast || null,
      lunch: stored.lunch || null,
      dinner: stored.dinner || null
    });
  }, []);

  const totalCalories = Object.values(mealPlan).reduce((sum, meal) => {
    return sum + (meal?.calories || 0);
  }, 0);

  return (
    <div>
      <h2>Meal Plan</h2>
      {['breakfast', 'lunch', 'dinner'].map((type) => {
        const meal = mealPlan[type];
        return (
          <div key={type}>
            <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            {meal ? (
              <div>
                <h4>{meal.title}</h4>
                <img src={meal.image} alt={meal.title} width="200" />
                {meal.calories && <p>Calories: {meal.calories}</p>}
              </div>
            ) : (
              <p>No meal selected</p>
            )}
          </div>
        );
      })}
      <h3>Total Calories: {totalCalories}</h3>
    </div>
  );
}
