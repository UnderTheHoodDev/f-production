"use client"

import * as React from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "fproduction-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => (typeof window !== "undefined" && (localStorage.getItem(storageKey) as Theme)) || defaultTheme
  )

  React.useEffect(() => {
    const root = window.document.documentElement
    const path = window.location.pathname
    
    // Chỉ thay đổi theme khi ở trang admin (không phải login)
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
      // Remove both theme classes first
      root.classList.remove("light", "dark")
      // Add the current theme class
      if (theme) {
        root.classList.add(theme)
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, theme)
      }
    }
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

