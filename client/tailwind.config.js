/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--text-primary)",
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
          inset: "var(--surface-inset)",
          hover: "var(--surface-hover)",
          selected: "var(--surface-selected)",
          overlay: "var(--surface-overlay)",
        },
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          default: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        brand: {
          DEFAULT: "var(--brand-primary)",
          hover: "var(--brand-primary-hover)",
          active: "var(--brand-primary-active)",
          subtle: "var(--brand-primary-subtle)",
          focus: "var(--brand-primary-focus)",
        },
        positive: {
          DEFAULT: "var(--positive)",
          subtle: "var(--positive-subtle)",
          border: "var(--positive-border)",
        },
        negative: {
          DEFAULT: "var(--negative)",
          subtle: "var(--negative-subtle)",
          border: "var(--negative-border)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          subtle: "var(--warning-subtle)",
          border: "var(--warning-border)",
        },
        info: {
          DEFAULT: "var(--info)",
          subtle: "var(--info-subtle)",
          border: "var(--info-border)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
          inverse: "var(--text-inverse)",
        },
        // Component compatibility mapping
        card: {
          DEFAULT: "var(--surface-1)",
          foreground: "var(--text-primary)",
        },
        popover: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--text-primary)",
        },
        primary: {
          DEFAULT: "var(--brand-primary)",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "var(--surface-3)",
          foreground: "var(--text-primary)",
        },
        muted: {
          DEFAULT: "var(--surface-3)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--surface-hover)",
          foreground: "var(--text-primary)",
        },
        destructive: {
          DEFAULT: "var(--negative)",
          foreground: "#FFFFFF",
        },
        input: "var(--border-default)",
        ring: "var(--brand-primary-focus)",
      },
      boxShadow: {
        "elevation-none": "var(--elevation-none)",
        "elevation-sm": "var(--elevation-sm)",
        "elevation-md": "var(--elevation-md)",
        "elevation-lg": "var(--elevation-lg)",
        "elevation-modal": "var(--elevation-modal)",
      },
      borderRadius: {
        badge: "var(--radius-badge)",
        control: "var(--radius-control)",
        card: "var(--radius-card)",
        modal: "var(--radius-modal)",
        hero: "var(--radius-hero)",
        full: "var(--radius-full)",
      },
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
