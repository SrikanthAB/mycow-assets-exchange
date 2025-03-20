
"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Create a context with default values
const ThemeContext = createContext({
  theme: "",
  setTheme: (theme: string) => {}
})

export function ThemeProvider({ 
  children, 
  ...props 
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
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
      className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Use a default implementation if outside provider
    const [theme, setThemeState] = useState<string>("")
    
    useEffect(() => {
      // Check for system preference or stored preference
      const savedTheme = localStorage.getItem("mycow-theme-preference")
      if (savedTheme) {
        setThemeState(savedTheme)
      } else {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setThemeState(isDark ? "dark" : "light")
      }
    }, [])
    
    const setTheme = (newTheme: string) => {
      setThemeState(newTheme)
      localStorage.setItem("mycow-theme-preference", newTheme)
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
    
    return { theme, setTheme }
  }
  return context
}
