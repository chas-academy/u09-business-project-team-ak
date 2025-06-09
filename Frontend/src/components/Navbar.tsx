'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  displayName?: string;
  name?: string;
  email?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:4000/profile', {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Not authenticated');
        }

        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null); // Not logged in or error
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  return (
    <nav className="bg-orange-500/0 text-white px-6 py-4 shadow-md">
      <div className="max-w-l mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">
          Healthy<span className="text-orange-400">Habits</span>
        </h1>
        <div className="space-x-4 flex-1 text-center">
          <a href="/" className="hover:underline">Home</a>
          <a href="/recipes" className="hover:underline">Recipes</a>
          <a href="/mealplan" className="hover:underline">Meal Plan</a>
        </div>
        <div>
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">Welcome, {user.displayName || user.name}</span>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="http://localhost:4000/auth/google"
              className="bg-orange-400 px-4 py-2 rounded text-white hover:bg-orange-500"
            >
              Login with Google
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
