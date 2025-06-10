'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView } from "framer-motion";

type MilestoneData = {
  savedRecipesCount: number;
  mealPlansCount: number;
  totalMealsPlanned: number;
  foodJoke: string;
};

export default function Home() {
  const [milestones, setMilestones] = useState<MilestoneData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recipeRef = useRef(null);
  const recipeInView = useInView(recipeRef, { once: true, margin: '-100px' });
  const textControls = useAnimation();
  const bgControls = useAnimation();

  useEffect(() => {
    const fetchMilestones = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/milestones`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! status: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      setMilestones(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching milestones:', err);
      setError(errorMessage);
    }
  };


    fetchMilestones();
  }, []);

  useEffect(() => {
    if (recipeInView) {
      textControls.start({ opacity: 1, x: 0 });
      bgControls.start({ opacity: 1 });
    }
  }, [recipeInView, textControls, bgControls]);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        background:
          'linear-gradient(180deg,rgba(18, 28, 20, 1) 50%, rgba(65, 171, 53, 1) 70%, rgba(18, 28, 20, 1) 100%)',
      }}
    >
      {/* Hero Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/smoothie.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            Build your <span className="text-green-500">Health</span> One <span className="text-green-500">Habit</span> at a time!
          </h1>
          <h4 className="text-xl md:text-3xl mb-8">First one starts in the kitchen</h4>
          <a
            href="/mealplan"
            className="text-xl bg-green-500 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-full transition"
          >
            Meal Plan
          </a>
        </div>
      </section>

      {/* Recipes Preview Section */}
      <motion.section
        ref={recipeRef}
        initial={{ opacity: 0 }}
        animate={bgControls}
        transition={{ duration: 1 }}
        className="relative h-[600px] bg-cover bg-center w-[100%] mx-auto mt-10 mb-10"
        style={{ backgroundImage: "url('/meals.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 bg-opacity-80 flex flex-col items-end justify-center text-right text-white px-4">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={textControls}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-end text-right space-y-4"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold">
              1000+ <span className="text-green-500">RECIPES</span> TO CHOOSE FROM
            </h2>
            <h3 className="text-xl md:text-3xl">
              Plan your own meals in only minutes. <br className="hidden md:block" />
              Customizable to your liking!
            </h3>
            <a
              href="/recipes"
              className="text-xl bg-green-500 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-full transition"
            >
              Recipes
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Milestones Section */}
      <section className="text-center py-20 mb-20">
        <h2 className="text-6xl font-extrabold text-white mb-12">Milestone Progress</h2>
        {error ? (
          <p className="text-red-500 text-xl">Error: {error}</p>
        ) : milestones ? (
          <>
            <div className="flex flex-wrap justify-center mt-10 gap-8 text-white">
              {/* Saved Recipes Cylinder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-green-500 to-green-800 rounded-full p-6 shadow-xl w-48 h-48 flex flex-col items-center justify-center"
              >
                <h3 className="text-lg font-bold mb-1">Saved Recipes</h3>
                <p className="text-3xl font-extrabold">{milestones.savedRecipesCount}</p>
              </motion.div>

              {/* Meal Plans Created Cylinder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-green-500 to-green-800 rounded-full p-6 shadow-xl w-48 h-48 flex flex-col items-center justify-center"
              >
                <h3 className="text-lg font-bold mb-1">Meal Plans Created</h3>
                <p className="text-3xl font-extrabold">{milestones.mealPlansCount}</p>
              </motion.div>

              {/* Total Meals Planned Cylinder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-green-500 to-green-800 rounded-full p-6 shadow-xl w-48 h-48 flex flex-col items-center justify-center"
              >
                <h3 className="text-lg font-bold mb-1">Total Meals Planned</h3>
                <p className="text-3xl font-extrabold">{milestones.totalMealsPlanned}</p>
              </motion.div>
            </div>

            {/* Food Joke Marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 h-[100px] w-full bg-[#121c14]/50 py-4 rounded-xl shadow-lg overflow-hidden relative"
            >
              <p className="absolute whitespace-nowrap animate-marquee text-white text-lg font-medium px-4">
                {milestones.foodJoke}
              </p>
            </motion.div>
          </>
        ) : (
          <p className="text-white text-xl">Loading milestones...</p>
        )}
      </section>
    </div>
  );
}
