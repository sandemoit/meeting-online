import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			dark: {
				1: '#1C1F2E',
				2: '#161925',
				3: '#252A41',
				4: '#1E2757',
			},
			blue: {
				1: '#0E78F9',
				2: '#ffffff',
			},
			sky: {
				1: '#C9DDFF',
				2: '#ECF0FF',
				3: '#F5FCFF',
			},
			orange: {
				1: '#FF742E',
			},
			purple: {
				1: '#830EF9',
			},
			yellow: {
				1: '#F9A90E',
			},
  		},
		backgroundImage: {
			hero: "url('/images/hero-background.png')"
		},
		keyframes: {
			'accordion-down': {
				from: { height: '0' },
				to: { height: 'var(--radix-accordion-content-height)' },
			},
			'accordion-up': {
				from: { height: 'var(--radix-accordion-content-height)' },
				to: { height: '0' },
			},
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
		},
		radius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		}
	}
	},
plugins: [require("tailwindcss-animate")],
};
export default config;
