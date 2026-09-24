export const THEME_STORAGE_KEY = "cfa:theme";

// Inlined in <head> (see app/layout.tsx) so a saved choice applies before first paint.
export const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
