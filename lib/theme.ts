export const THEME_STORAGE_KEY = "cfa:theme";
export const THEME_CHANGE_EVENT = "cfa:theme-change";

export type Theme = "light" | "dark";

// Inlined in <head> (see app/layout.tsx) so the theme applies before first
// paint: a saved choice if there is one, otherwise the device setting.
export const themeScript = `(function(){var t;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t})()`;

export function readSavedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

export function applyTheme(theme: Theme, { save }: { save: boolean }) {
  document.documentElement.dataset.theme = theme;
  if (save) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage blocked: the switch still works for this page view.
    }
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}
