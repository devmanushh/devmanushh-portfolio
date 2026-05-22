"use client";

import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return {
    theme,
    setTheme,
  };
}