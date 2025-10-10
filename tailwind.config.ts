import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        /* семантичні токени через CSS vars (як і було) */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* ісламські відтінки (як було) */
        islamic: {
          gold: "hsl(var(--islamic-gold))",
          "gold-dark": "hsl(var(--islamic-gold-dark))",
          blue: "hsl(var(--islamic-blue))",
          "blue-light": "hsl(var(--islamic-blue-light))",
          green: "hsl(var(--islamic-green))",
        },

        /* колірна схема для sidebar (як було) */
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        /* 🔶 НОВЕ: фірмова бурштинова палітра (amber) для явних класів */
        brand: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706", // базовий бурштин
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },

        /* опціонально: прямий доступ до стандартного amber */
        amber: colors.amber,
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
      },

      fontFamily: {
        arabic: "var(--arabic-font)",
        body: "var(--body-font)",
        playfair: ["Playfair Display", "serif"],
        sanskrit: ["Noto Sans Devanagari", "serif"],
        "sanskrit-italic": ["Crimson Text", "Georgia", "serif"],
      },

      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-header": "var(--gradient-header)",
        "gradient-card": "var(--gradient-card)",

        /* 🔶 НОВЕ: утиліти для craft-фону (використовуйте bg-craft-paper / bg-craft-paper-soft) */
        "craft-paper":
          "radial-gradient(circle at 20% 50%, rgba(120,119,108,0.10) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(120,119,108,0.10) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120,119,108,0.10) 0%, transparent 50%), radial-gradient(circle at 60% 30%, rgba(120,119,108,0.05) 0%, transparent 50%)",
        "craft-paper-soft":
          "radial-gradient(circle at 15% 35%, rgba(120,119,108,0.08) 0%, transparent 45%), radial-gradient(circle at 75% 65%, rgba(120,119,108,0.06) 0%, transparent 55%)",
      },

      boxShadow: {
        card: "var(--shadow-card)",
        verse: "var(--shadow-verse)",
        header: "var(--shadow-header)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
