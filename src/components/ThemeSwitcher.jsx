"use client";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      // User chose manually
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // auto detect user system theme 👇
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const defaultTheme = systemPrefersDark ? "dark" : "light";

      setTheme(defaultTheme);
      document.documentElement.classList.toggle("dark", systemPrefersDark);
      document.documentElement.setAttribute(
        "data-theme",
        defaultTheme
      );
    }
  }, []);

  // when user toggles theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme === "light" ? "dark" : "light");

  return (
    <button
      onClick={toggleTheme}
      className="relative w-20 h-10 rounded-full p-1 transition-all duration-500 ease-in-out focus:outline-none
                   bg-gradient-to-r from-amber-200 to-yellow-100 
                   dark:from-blue-900 dark:to-green-900
                   shadow-lg hover:shadow-xl border border-amber-300 dark:border-blue-600
                   hover:scale-105 active:scale-95"
    >
      <span
        className={`absolute top-1 w-8 h-8 rounded-full shadow-lg transform transition-all duration-500 ease-in-out flex items-center justify-center
        ${theme === "dark"
            ? "translate-x-10 bg-gradient-to-br from-gray-800 to-gray-900 text-white"
            : "translate-x-0 bg-gradient-to-br from-white to-gray-100 text-amber-500"}`}
      >
        {theme === "dark" ? "🌙" : "☀"}
      </span>
    </button>
  );
}