export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/smoothie.jpg')" }}>
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Build your <span className="text-orange-400">Health</span> One <span className="text-orange-400">Habit</span> at a time!
          </h1>
          <h4 className="text-lg md:text-2xl mb-6">First one starts in the kitchen</h4>
          <a
            href="/recipes"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition"
          >
            Recipes
          </a>
        </div>
      </section>


      {/* Recipes Preview Section */}
      <section className="relative h-screen bg-cover bg-center w-[90%] mx-auto mt-20 mb-20" 
      style={{ backgroundImage: "url('/meals.jpg')" }}>
        <div className="absolute inset-0 bg-black/60 bg-opacity-80 flex flex-col items-center justify-center text-center text-white px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-3">100+ RECIPES TO CHOOSE FROM</h2>
          <h3 className="text-lg md:text-2xl mb-6">Plan your own meals in only minutes. <br className="hidden md:block" />Customizable to your liking!</h3>
          <a href="/mealplan" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition">
            Meal Plan
          </a>
        </div>
      </section>

      {/* Daily Goals Section */}
      <section className="bg-[#121c14] text-center py-16 mb-20">
        <h2 className="text-3xl font-bold text-white mb-8">Daily Goals</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: "Calories", value: "0/2500" },
            { label: "Fat", value: "0/60g" },
            { label: "Carbs", value: "0/200g" },
            { label: "Protein", value: "0/160g" },
          ].map((goal, index) => (
            <div key={index}  className="w-42 h-42 rounded-full bg-orange-500 text-white flex flex-col items-center justify-center text-lg font-semibold shadow-md hover:scale-105 hover:bg-orange-600 transition-transform duration-300">
              <div>{goal.value}</div>
              <div className="text-sm">{goal.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-500 text-white text-center py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-4">
          <div>
            <strong>About Us</strong><br />
            We help people build healthy eating habits.
          </div>
          <div>
            <strong>Contact</strong><br />
            support@healthyhabits.com
          </div>
          <div>
            <strong>Info</strong><br />
            Recipes, tips, and planning tools.
          </div>
        </div>
        <p className="text-xs">© 2025 HealthyHabits</p>
      </footer>
    </>
  );
}
