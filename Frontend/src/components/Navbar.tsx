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
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_API_BASE_URL.replace('/api', '') + '/profile',
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleLogin = () => {
    window.location.href = import.meta.env.VITE_API_BASE_URL.replace('/api', '') + '/auth/google';
  };

  const handleLogout = async () => {
    try {
      await fetch(import.meta.env.VITE_API_BASE_URL.replace('/api', '') + '/auth/logout', { // ✅ use proxy path
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
    <nav className="text-white px-6 py-4 shadow-md w-full">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center">
        {/* Top row with logo and toggle button */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h1 className="text-3xl font-bold text-white">
            Healthy<span className="text-green-500">Habits</span>
          </h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden focus:outline-none"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Dropdown / main nav content */}
        <div
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } flex-col sm:flex sm:flex-row sm:items-center w-full sm:w-auto transition-all duration-300 ease-in-out origin-top bg-[#121c14] sm:bg-transparent py-8 sm:py-0 gap-8 sm:gap-6`}
        >
          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-lg sm:text-xl font-semibold text-center sm:text-left">
            <a href="/" className="hover:text-green-500 transition-colors duration-200">
              Home
            </a>
            <a href="/recipes" className="hover:text-green-500 transition-colors duration-200">
              Recipes
            </a>
            <a href="/mealplan" className="hover:text-green-500 transition-colors duration-200">
              Meal Plan
            </a>
          </div>

          {/* Auth section */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-base sm:text-lg">
            {user ? (
              <>
                <span className="text-white font-medium">
                  Welcome, {user.displayName || user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin} // ✅ now using proper proxy login
                className="bg-green-700 px-4 py-2 rounded text-white hover:bg-green-500 transition duration-200"
              >
                Login with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
