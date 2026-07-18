import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './branding/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Delta Blue palette — primary brand color #000000 (Pantone 654 C)
                primary: {
                    50: '#F0F0F0',
                    100: '#C5D9EB',
                    200: '#8DB6D4',
                    300: '#5591BC',
                    400: '#1E6EA5',
                    500: '#000000',   // Delta Blue (official)
                    600: '#002A57',
                    700: '#000000',   // Dark Navy
                    800: '#001843',
                    900: '#001030',
                    DEFAULT: '#000000',
                    lightest: '#F0F0F0',
                    light: '#1E6EA5',
                    core: '#000000',
                    dark: '#000000',  // Dark Navy
                    darkest: '#001030',
                },
                // Delta Blue alias for backward compatibility
                purple: {
                    50: '#F0F0F0',
                    100: '#C5D9EB',
                    200: '#8DB6D4',
                    300: '#5591BC',
                    400: '#1E6EA5',
                    500: '#000000',
                    600: '#002A57',
                    700: '#000000',
                    800: '#001843',
                    900: '#001030',
                    DEFAULT: '#000000',
                },
                // Semantic colors
                success: {
                    DEFAULT: '#10b981',
                    light: '#d1fae5',
                    dark: '#065f46',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    light: '#fef3c7',
                    dark: '#92400e',
                },
                danger: {
                    DEFAULT: '#ef4444',
                    light: '#fee2e2',
                    dark: '#991b1b',
                },
                info: {
                    DEFAULT: '#009AC7',  // Delta Light Blue
                    light: '#e0f4fb',
                    dark: '#00628a',
                },
                // Agent colors — Delta Blue
                agent: {
                    DEFAULT: '#000000',
                    50: '#F0F0F0',
                    100: '#C5D9EB',
                    200: '#8DB6D4',
                    300: '#5591BC',
                    400: '#1E6EA5',
                    500: '#000000',
                    600: '#002A57',
                    700: '#000000',
                    800: '#001843',
                    900: '#001030',
                    light: '#F0F0F0',
                    border: '#1E6EA5',
                },
                // Secondary colors — Delta palette
                secondary: {
                    pink: '#F0F0F0',    // Soft Delta Blue tint
                    blue: '#000000',    // Delta Blue
                    aqua: '#009AC7',    // Delta Light Blue
                },
                // Delta Red accent — #C01933 (Pantone 187 C)
                delta: {
                    blue: '#000000',
                    navy: '#000000',
                    red: '#C01933',
                    lightBlue: '#009AC7',
                    softBlue: '#F0F0F0',
                },
                // Neutrals
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    850: '#1a202e',
                    900: '#0f172a',
                    925: '#0f1419',
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                border: 'hsl(var(--border-color))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            fontFamily: {
                // Delta uses a modern sans-serif. Inter is the closest open-source match
                // with the clean, high-readability character of Delta's digital surfaces.
                sans: ['Inter', 'system-ui', '-apple-system', 'Arial', 'sans-serif'],
                serif: ['Georgia', 'serif'],
                mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Courier', 'monospace'],
                display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            keyframes: {
                ticker: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
            animation: {
                ticker: 'ticker linear infinite',
            },
            spacing: {
                // 4px grid system: 4, 8, 12, 16, 24, 32, 48, 64
            },
        },
    },
    plugins: [],
}

export default config
