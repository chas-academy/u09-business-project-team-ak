import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import MealPlan from './pages/MealPlan';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/meal-plan" element={<MealPlan />} />
      </Routes>
    </BrowserRouter>
  );
}
