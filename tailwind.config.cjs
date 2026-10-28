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
				// Encre des contours et des ombres pleines : un aubergine profond
				// plutôt qu'un noir pur, accordé au violet primaire.
				outline: '#241e38',
				primary: {
					DEFAULT: '#6f6bae', // violet principal
					dark: '#6f6bae'
				},
				// Surfaces du mode sombre : un violet très désaturé plutôt que du noir
				// pur ou du slate, pour que les cartes se détachent du fond.
				ink: {
					DEFAULT: '#151220', // fond de page
					surface: '#1d1929', // cartes, header, dialogues
					raised: '#272135', // survols, panneaux creusés
					line: '#3a3350', // filets et bordures
					text: '#f3f0f7', // titres et texte principal
					body: '#cfc9dd', // texte courant
					muted: '#a9a2bd', // texte secondaire
					faint: '#857ea0' // légendes, indications
				},
				secondary: {
					DEFAULT: '#708F7a', // vert sauge
					dark: '#708F7a'
				},
				primary_second: {
					DEFAULT: '#bdb7fd',
					dark: '#bdb7fd'
				},
				// Pastels « stickers » : fonds de pastilles et d'aplats.
				lilac: '#bdb7fd',
				mint: '#b8d1b1',
				blush: '#fab7cf',
				butter: '#fce5a8',
				sage: '#708f7a',
				grape: '#6f6bae',
				paper: {
					DEFAULT: '#f9f7f8',
					deep: '#f1ecec'
				}
			},
			fontFamily: {
				// Motter Corpus (déjà dans public/fonts) donne le titrage serif épais.
				display: ['Motter Corpus Std', 'Georgia', ...defaultTheme.fontFamily.serif],
				body: ['Manrope', ...defaultTheme.fontFamily.sans],
				sans: ['Manrope', ...defaultTheme.fontFamily.sans]
			},
			// Ombres pleines, sans flou : le relief « impression » du site.
			boxShadow: {
				pop: '6px 6px 0 0 #241e38',
				'pop-sm': '3px 3px 0 0 #241e38',
				'pop-lg': '10px 10px 0 0 #241e38'
			},
			gridTemplateColumns: {
				list: 'repeat(auto-fill, minmax(400px, max-content))'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
}
