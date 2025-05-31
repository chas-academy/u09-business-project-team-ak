import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import MealPlan from "./pages/MealPlan";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "recipes", element: <Recipes /> },
      { path: "meal-plan", element: <MealPlan /> },
    ],
  },
]);

export default router;
