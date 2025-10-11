// src/main.tsx
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

/**
 * 1) Виставляємо тему на <html> до маунта React (без FOUC)
 * 2) Підтягуємо збережені налаштування читалки (шрифт/міжряддя)
 */
(() => {
  const THEME_KEY = "veda-ui-theme";
  const READER_KEY = "veda-reader-settings";

  // Тема: craft за замовченням
  const savedTheme = (localStorage.getItem(THEME_KEY) as "light" | "dark" | "craft" | null) ?? "craft";
  const root = document.documentElement;
  root.classList.remove("light", "dark", "craft");
  root.classList.add(savedTheme);

  // Налаштування читалки (CSS-перемінні на :root)
  try {
    const saved = JSON.parse(localStorage.getItem(READER_KEY) || "{}");
    if (saved.fontSize) root.style.setProperty("--vv-reader-font-size", saved.fontSize);
    if (saved.lineHeight) root.style.setProperty("--vv-reader-line-height", saved.lineHeight);
    if (saved.maxWidth) root.style.setProperty("--vv-reader-max-width", saved.maxWidth);
  } catch {}
})();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
