// components/ThemeSwitcher.jsx
"use client";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  // ✅ Default state dark
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // by default dark mode 
    document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.setAttribute("data-theme", theme); 
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <button
      onClick={toggleTheme}
      className="relative w-20 h-10 rounded-full p-1 transition-all duration-500 ease-in-out focus:outline-none
                 bg-gradient-to-r from-amber-200 to-yellow-100 
                 dark:from-blue-900 dark:to-green-900
                 shadow-lg hover:shadow-xl border border-amber-300 dark:border-blue-600
                 hover:scale-105 active:scale-95"
    >
      {/* Knob with icon inside */}
      <span
        className={`absolute top-1 w-8 h-8 rounded-full shadow-lg transform transition-all duration-500 ease-in-out flex items-center justify-center
                    ${theme === "dark" 
                      ? "translate-x-10 bg-gradient-to-br from-gray-800 to-gray-900 text-white" 
                      : "translate-x-0 bg-gradient-to-br from-white to-gray-100 text-amber-500"}`}
      >
        {theme === "dark" ? "🌙" : "☀"}
      </span>

      {/* Background elements for visual appeal */}
      <div className="absolute inset-0 rounded-full overflow-hidden opacity-20">
        {/* Sun rays for light mode */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${theme === "light" ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-0.5 h-3 bg-white absolute -top-1 left-0"></div> 
             <div className="w-0.5 h-3 bg-white absolute top-0 -left-1 transform rotate-45"></div>
            <div className="w-0.5 h-3 bg-white absolute top-0 left-1 transform -rotate-45"></div>
          </div>
        </div>
        
        {/* Stars for dark mode */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${theme === "dark" ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute bottom-2 left-7 w-0.5 h-0.5 bg-white rounded-full"></div>
        </div>
      </div>
    </button>
  );
}