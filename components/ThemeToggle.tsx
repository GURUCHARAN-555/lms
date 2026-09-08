"use client";

import { useEffect, useState } from "react";
type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => {
    const saved = (localStorage.getItem("qa-theme") as Theme | null) ?? "system";
    setTheme(saved); applyTheme(saved);
  }, []);
  function applyTheme(value: Theme) {
    const dark = value === "dark" || (value === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  }
  function change(value: Theme) { setTheme(value); localStorage.setItem("qa-theme", value); applyTheme(value); }
  const next: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };
  return <button onClick={() => change(next[theme])} className="theme-button" aria-label={`Theme: ${theme}. Activate to change theme`} title={`Theme: ${theme}`}>
    <span aria-hidden>{theme === "dark" ? "◐" : theme === "light" ? "☼" : "◌"}</span><span className="theme-label">{theme}</span>
  </button>;
}
