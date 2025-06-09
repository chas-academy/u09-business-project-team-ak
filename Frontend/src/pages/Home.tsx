'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* Hero Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/smoothie.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            Build your <span className="text-orange-500">Health</span> One <span className="text-green-500">Habit</span> at a time!
          </h1>
          <h4 className="text-xl md:text-3xl mb-8">First one starts in the kitchen</h4>
          <a
            href="/recipes"
            className="text-xl bg-green-500 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-full transition"
          >
            Recipes
          </a>
        </div>
      </section>

      {/* Recipes Preview Section */}
      <section
        className="relative h-screen bg-cover bg-center w-[90%] mx-auto mt-20 mb-20"
        style={{ backgroundImage: "url('/meals.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 bg-opacity-80 flex flex-col items-center justify-center text-center text-white px-4">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4">100+ RECIPES TO CHOOSE FROM</h2>
          <h3 className="text-xl md:text-3xl mb-8">
            Plan your own meals in only minutes. <br className="hidden md:block" />
            Customizable to your liking!
          </h3>
          <a
            href="/mealplan"
            className="text-xl bg-green-500 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-full transition"
          >
            Meal Plan
          </a>
        </div>
      </section>

      {/* Daily Goals Section */}
      <section className="text-center py-20 mb-20">
        <h2 className="text-4xl font-extrabold text-white mb-12">Daily Goals</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { label: "Calories", value: "0/2500" },
            { label: "Fat", value: "0/60g" },
            { label: "Carbs", value: "0/200g" },
            { label: "Protein", value: "0/160g" },
          ].map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="w-48 h-48 rounded-full bg-orange-500 text-white flex flex-col items-center justify-center text-xl font-bold shadow-lg hover:scale-105 hover:bg-orange-600 transition-transform duration-300"
            >
              <div className="text-2xl">{goal.value}</div>
              <div className="text-lg mt-1">{goal.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-500 text-white text-center py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-base mb-4">
          <div>
            <strong>About Us</strong>
            <br />
            We help people build healthy eating habits.
          </div>
          <div>
            <strong>Contact</strong>
            <br />
            support@healthyhabits.com
          </div>
          <div>
            <strong>Info</strong>
            <br />
            Recipes, tips, and planning tools.
          </div>
        </div>
        <p className="text-sm">© 2025 HealthyHabits</p>
      </footer>
    </div>
  );
}
