
"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

type ThemeProviderContextProps = {
  theme: string;
  setTheme: (theme: string) => void;
}

// Create a context with default values
const ThemeContext = createContext<ThemeProviderContextProps>({
  theme: "dark",
  setTheme: () => {},
})

export function ThemeProvider({ 
  children, 
  defaultTheme = "dark",
  ...props 
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<string>("dark");
  
  useEffect(() => {
    // Get saved theme or use default
    const savedTheme = localStorage.getItem("mycow-theme-preference") || defaultTheme;
    setThemeState(savedTheme);
    
    // Apply the theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
  }, [defaultTheme]);
  
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem("mycow-theme-preference", newTheme);
    
    // Update document class for theme
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {theme === "light" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="M5 5l1.5 1.5"/>
          <path d="M17.5 17.5 19 19"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
          <path d="M5 19l1.5-1.5"/>
          <path d="M17.5 6.5 19 5"/>
        </svg>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export const useTheme = () => {
  return useContext(ThemeContext);
}
