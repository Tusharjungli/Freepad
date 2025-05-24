// components/Header.tsx
"use client";
import { useState, useEffect } from "react";
import { Sun, Moon, Notebook, Timer } from "lucide-react";

export default function Header({
  onMenuClick,
  onTimerClick,
  timerDisplay,
}: {
  onMenuClick?: () => void;
  onTimerClick?: () => void;
  timerDisplay?: string | null;
}) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      const newDark = !prev;
      localStorage.setItem("theme", newDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newDark);
      return newDark;
    });
  };

  return (
    <header className="w-full py-4 px-4 flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm mb-4 border-b border-gray-200 dark:border-gray-800">
      {/* Drawer Icon - left */}
      <button
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Open menu"
        onClick={onMenuClick}
        type="button"
      >
        <Notebook size={22} className="text-gray-700 dark:text-gray-200" />
      </button>
      {/* App Name Center */}
      <div className="flex-1 flex justify-center">
        <span
          className="font-extrabold text-2xl tracking-tight"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          FreePad
        </span>
      </div>
      {/* Actions on right: Timer Display + Timer Button + Theme */}
      <div className="flex items-center gap-2 ml-auto">
        {timerDisplay && (
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 rounded-md shadow transition">
            <Timer size={18} />
            <span className="font-mono text-base">{timerDisplay}</span>
          </span>
        )}
        <button
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Focus timer"
          onClick={onTimerClick}
          type="button"
        >
          <Timer size={22} className="text-gray-700 dark:text-gray-200" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Toggle theme"
          type="button"
        >
          {dark ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>
    </header>
  );
}
