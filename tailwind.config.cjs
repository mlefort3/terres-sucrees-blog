/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,md,mdx,ts}'],
	theme: {
		extend: {
			colors: {
				white: {
					DEFAULT: '#f9f7f8',
					dark: '#1f1f1f'
				},
				black: {
					DEFAULT: '#01052d',
					dark: '#fff'
				},
				primary: {
					DEFAULT: '#6f6bae', // light mode main color (sky-500)
					dark: '#6f6bae'     // dark mode main color
				},
				secondary: {
					DEFAULT: '#708F7a', // purple accent
					dark: '#708F7a'
				},
				primary_second: {
					DEFAULT: '#bdb7fd',
					dark: '#bdb7fd'
				}
			},
			fontFamily: {
				body: ["Outfit", ...defaultTheme.fontFamily.sans]
			},
			gridTemplateColumns: {
				list: 'repeat(auto-fill, minmax(400px, max-content))'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
}
