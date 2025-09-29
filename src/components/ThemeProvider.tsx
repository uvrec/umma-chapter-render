import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "craft"

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
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "craft",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "craft")
    
    // Add the current theme class
    root.classList.add(theme)
    
    // Apply craft paper styles to body
    if (theme === "craft") {
      document.body.style.backgroundColor = "#F3D4A5"
      document.body.style.backgroundImage = `
        radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(120, 119, 108, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 60% 30%, rgba(120, 119, 108, 0.05) 0%, transparent 50%)
      `
    } else {
      document.body.style.backgroundColor = ""
      document.body.style.backgroundImage = ""
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
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
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}