"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-full border border-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-800"
    >
      {theme === "dark" ? (
        <LightMode sx={{ fontSize: 18 }} className="text-neutral-400" />
      ) : (
        <DarkMode sx={{ fontSize: 18 }} className="text-neutral-600" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
