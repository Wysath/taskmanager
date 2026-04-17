/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/services/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.{css,scss}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  // Phase 6: Safelist for dynamically generated classes (rarely used)
  safelist: [
    // Dynamic grid classes (if generated at runtime)
    { pattern: /^grid-cols-/ },
    { pattern: /^col-span-/ },
    // Dynamic spacing (if generated at runtime)
    { pattern: /^(p|m|gap)-/ },
  ],
  theme: {
    extend: {
      colors: {
        // Core Monster Hunter Wilds Design System
        // Reduced palette: Removed unused light blues, kept only essential colors
        surface: "#151310",
        "surface-dim": "#151310",
        "surface-bright": "#3b3935",
        "surface-container-low": "#1d1b18",
        "surface-container": "#211f1c",
        "surface-container-high": "#2c2a26",
        "surface-container-highest": "#373431",
        
        // Text colors
        "on-surface": "#e3d5b8",
        "on-surface-variant": "#d4c4b3",
        
        // Primary accent (gold/copper)
        primary: "#c28e46",
        "primary-fixed": "#f6bc6f",
        "primary-fixed-dim": "#f6bc6f",
        "on-primary": "#151310",
        
        // Secondary
        secondary: "#4d4638",
        "secondary-fixed": "#ede1ce",
        "secondary-fixed-dim": "#d0c5b3",
        "on-secondary": "#363023",
        
        // Tertiary
        tertiary: "#cec5bb",
        "tertiary-fixed": "#eae1d7",
        "tertiary-fixed-dim": "#cec5bb",
        "on-tertiary": "#343029",
        
        // Error
        error: "#93000a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        
        // Outline
        outline: "#504538",
        "outline-variant": "#504538",
        
        // Inverse
        "inverse-surface": "#e8e1dc",
        "inverse-primary": "#815511",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      // Limit spacing scale to reduce CSS output
      spacing: {
        // Keep essential values only
        "0": "0px",
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
        "32": "128px",
      },
      // Limit font sizes
      fontSize: {
        "xs": "10px",
        "sm": "12px",
        "base": "14px",
        "lg": "16px",
        "xl": "18px",
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
        "5xl": "40px",
      },
    },
  },
  plugins: [],
};





