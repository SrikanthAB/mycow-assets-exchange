
import React from "react";
import { Moon as MoonIcon, Sun as SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Toggling theme to:", newTheme);
    setTheme(newTheme);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <SunIcon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
