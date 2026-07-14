"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme(defaultTheme: Theme = "light") {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
  };
}
