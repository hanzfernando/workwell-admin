/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['"Poppins"', 'sans-serif'],
            },
            fontWeight: {
                light: 300,
                regular: 400,
                medium: 500,
                semibold: 600,
            },
            colors: {
                // Primary and Secondary Colors
                primary: {
                    blue: '#4A90E2', // Serenity Blue
                },
                secondary: {
                    blue: '#B3E5FC', // Light Sky
                },

                // Accent Color
                accent: {
                    aqua: '#00BCD4', // Vibrant Aqua
                },

                // Neutral Colors
                neutral: {
                    dark: '#263238', // Deep Navy
                    light: '#ECEFF1', // Ice Gray
                },
            },
},
    },
    plugins: [],
}

