import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-600 backdrop-blur-md transition-all duration-300 hover:border-amber-300 hover:text-amber-600 active:scale-95 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:border-amber-500/50 dark:hover:text-amber-400"
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
