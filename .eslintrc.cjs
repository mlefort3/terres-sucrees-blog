/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: ['plugin:astro/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		tsconfigRootDir: __dirname,
		sourceType: 'module',
		ecmaVersion: 'latest'
	},
	overrides: [
		{
			files: ['*.astro'],
			parser: 'astro-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro']
			},
			rules: {
				// override/add rules settings here, such as:
				'astro/no-set-html-directive': 'error'
			}
		},
		{
			// Seul composant autorisé à écrire du HTML brut : il rend les données
			// structurées JSON-LD, qui doivent être injectées telles quelles côté
			// serveur. Son contenu est du JSON avec `<` échappé en `\\u003c`, donc
			// aucune valeur ne peut fermer la balise <script>.
			files: ['src/components/JsonLd.astro'],
			rules: {
				'astro/no-set-html-directive': 'off'
			}
		}
	]
}
