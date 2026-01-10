/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#ff5a5f',
                    50: '#fff0f1',
                    100: '#ffe1e2',
                    200: '#ffc9cb',
                    300: '#ffa1a4',
                    400: '#ff6b70',
                    500: '#ff5a5f', // Original Brand
                    600: '#ed3e44',
                    700: '#c8262c',
                },
                secondary: {
                    DEFAULT: '#00a699',
                    50: '#f0fdfc',
                    500: '#00a699',
                    600: '#008a7f',
                },
                accent: '#FC642D', // TripAdvisor-ish orange
                dark: '#1e1e1e',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
