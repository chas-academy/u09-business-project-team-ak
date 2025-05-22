export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">MealMaster</h1>
      <div className="space-x-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/recipes" className="hover:underline">Recipes</a>
        <a href="/meal-plan" className="hover:underline">Meal Plan</a>
      </div>
    </nav>
  );
}