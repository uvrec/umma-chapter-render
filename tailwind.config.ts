import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        /* ===========================
           Семантичні токени через CSS vars
           =========================== */
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

        /* ===========================
           Sidebar токени
           =========================== */
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

        /* ===========================
           VEDAVOICE Brand Colors
           Бурштинова палітра для явних класів
           =========================== */
        brand: {
          50: "#fffbeb",   // Дуже світлий кремовий
          100: "#fef3c7",  // Світло-бурштиновий
          200: "#fde68a",  // Яскравий золотий
          300: "#fcd34d",  // Помаранчево-золотий
          400: "#fbbf24",  // Насичений золотий
          500: "#f59e0b",  // Яскравий бурштин
          600: "#d97706",  // БАЗОВИЙ БУРШТИН (primary)
          700: "#b45309",  // Темний бурштин
          800: "#92400e",  // Глибокий коричнево-бурштиновий
          900: "#78350f",  // Дуже темний коричневий
          950: "#451a03",  // Майже чорний коричневий
        },

        /* Духовні відтінки */
        spiritual: {
          saffron: "#f97316",    // Шафран (помаранчевий)
          gold: "#eab308",       // Священне золото
          earth: "#78350f",      // Земля (коричневий)
          amber: "#d97706",      // Бурштин (основний)
        },

        /* Стандартний Tailwind amber (опціонально) */
        amber: colors.amber,
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ===========================
         Анімації
         =========================== */
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
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      /* ===========================
         Шрифти
         =========================== */
      fontFamily: {
        primary: "var(--font-primary)",
        translit: "var(--font-translit)",
        sanskrit: "var(--font-devanagari)",
        "sanskrit-italic": "var(--font-devanagari)", // Додано для підтримки існуючих класів
        bengali: "var(--font-bengali)",
        ui: "var(--font-ui)",

        // Tailwind стандарт
        sans: ["Montserrat", "ui-sans-serif", "system-ui"],
        serif: ["Crimson Text", "Georgia", "serif"],
        mono: ["ui-monospace", "monospace"],
      },

      /* ===========================
         Фони
         =========================== */
      backgroundImage: {
        "brand-gradient": 
          "linear-gradient(135deg, hsl(33, 76%, 42%) 0%, hsl(38, 80%, 55%) 100%)",
        "craft-paper":
          "radial-gradient(circle at 20% 50%, rgba(120,119,108,0.10) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(120,119,108,0.10) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120,119,108,0.10) 0%, transparent 50%), radial-gradient(circle at 60% 30%, rgba(120,119,108,0.05) 0%, transparent 50%)",
        "craft-paper-soft":
          "radial-gradient(circle at 15% 35%, rgba(120,119,108,0.08) 0%, transparent 45%), radial-gradient(circle at 75% 65%, rgba(120,119,108,0.06) 0%, transparent 55%)",
        "warm-gradient":
          "linear-gradient(180deg, hsl(40, 60%, 96%) 0%, hsl(38, 50%, 94%) 100%)",
      },

      /* ===========================
         Тіні
         =========================== */
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08)",
        card: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        verse: "0 4px 12px rgba(0, 0, 0, 0.05)",
        glow: "0 0 20px rgba(217, 119, 6, 0.3)",
      },

      /* ===========================
         Timing Functions
         =========================== */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
