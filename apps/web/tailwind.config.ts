import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Papel tipográfico "display" para números de destaque (peso/pressão).
      fontSize: {
        metric: ['2.25rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'metric-lg': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      // Escala de elevação nomeada (níveis 1–4: cartão → cartão elevado → popover/menu → modal/sheet).
      // Sombra com tom frio (slate) em vez de preto puro, para estética premium.
      boxShadow: {
        sm: '0 1px 2px 0 hsl(220 43% 11% / 0.06)',
        DEFAULT: '0 1px 3px 0 hsl(220 43% 11% / 0.08), 0 1px 2px -1px hsl(220 43% 11% / 0.06)',
        md: '0 4px 12px -2px hsl(220 43% 11% / 0.10), 0 2px 6px -2px hsl(220 43% 11% / 0.06)',
        lg: '0 10px 24px -4px hsl(220 43% 11% / 0.12), 0 4px 8px -4px hsl(220 43% 11% / 0.08)',
        xl: '0 20px 40px -8px hsl(220 43% 11% / 0.18), 0 6px 14px -6px hsl(220 43% 11% / 0.10)',
      },
      // Tokens de movimento — microinterações discretas (120–200 ms) com easing único.
      transitionDuration: {
        fast: '120ms',
        DEFAULT: '160ms',
        slow: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
