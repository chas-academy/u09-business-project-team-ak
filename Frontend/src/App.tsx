import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="flex">
        <aside className="w-64 bg-green-100 p-4 min-h-screen">
          <nav className="space-y-4">
            <a href="/" className="block text-green-800 font-semibold">Home</a>
            <a href="/recipes" className="block text-green-800">Recipes</a>
            <a href="/meal-plan" className="block text-green-800">Meal Plan</a>
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
