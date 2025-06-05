export default function Navbar() {
  return (
    <nav className="bg-orange-500/0 text-white px-6 py-4 shadow-md">
      <div className="max-w-l mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Healthy<span className="text-orange-400">Habits</span></h1>
        <div className="space-x-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/recipes" className="hover:underline">Recipes</a>
          <a href="/mealplan" className="hover:underline">Meal Plan</a>
        </div>
      </div>
    </nav>
  )
}
