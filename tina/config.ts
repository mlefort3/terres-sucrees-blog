import { CATEGORIES } from '../src/data/categories.ts'
import { defineConfig } from 'tinacms'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

export default defineConfig({
	branch,
	clientId: null, // Get this from tina.io
	token: null, // Get this from tina.io

	build: {
		outputFolder: 'admin',
		publicFolder: 'public'
	},
	media: {
		tina: {
			mediaRoot: '/src/assets/images',
			publicFolder: ''
		}
	},
	schema: {
		collections: [
			{
				name: 'post',
				label: 'Blog Post',
				path: 'src/content/blog',
				format: 'mdx',
				fields: [
					{
						type: 'image',
						label: 'Cover Image',
						required: true,
						name: 'heroImage',
						description: 'The image used for the cover of the post'
					},

					{
						type: 'string',
						required: true,
						name: 'categories',
						label: 'Categories',
						description: 'Select one or more categories for this post',
						options: [...CATEGORIES],
						list: true,
						ui: {
							component: 'tags'
						}
					},
					{
						type: 'string',
						label: 'description',
						required: true,
						name: 'description',
						description: 'A short description of the post'
					},
					{
						type: 'datetime',
						name: 'pubDate',
						label: 'Publication Date',
						required: true
					},
					{
						type: 'string',
						name: 'prepTime',
						label: 'Temps de préparation',
						description:
							'Temps actif au format ISO 8601, ex. « PT45M » ou « PT1H30M ». Repris dans les données structurées.',
						ui: {
							validate: (value?: string) =>
								!value || /^PT(?=\d)(\d+H)?(\d+M)?(\d+S)?$/.test(value.trim())
									? undefined
									: 'Format ISO 8601 attendu, ex. « PT45M »'
						}
					},
					{
						type: 'string',
						name: 'cookTime',
						label: 'Temps de cuisson',
						description:
							'Temps au four ou sur le feu au format ISO 8601, ex. « PT20M » ou « PT1H ». Repris dans les données structurées.',
						ui: {
							validate: (value?: string) =>
								!value || /^PT(?=\d)(\d+H)?(\d+M)?(\d+S)?$/.test(value.trim())
									? undefined
									: 'Format ISO 8601 attendu, ex. « PT20M »'
						}
					},
					{
						name: 'draft',
						label: 'Draft',
						type: 'boolean',
						description: 'If this is checked the post will not be published'
					},
					{
						type: 'string',
						name: 'tags',
						required: true,
						label: 'Tags',
						description: 'Tags for this post',
						list: true,
						ui: {
							component: 'tags'
						}
					},
					{
						type: 'string',
						name: 'title',
						label: 'Title',
						isTitle: true,
						required: true
					},
					{
						type: 'string',
						name: 'recipeIngredients',
						label: 'Préparations de la recette',
						description:
							'Identifiants des préparations (fichiers de src/content/recipeIngredients, sans extension), ex. « pate-sucree ».',
						list: true,
						ui: {
							component: 'tags'
						}
					},
					{
						type: 'rich-text',
						label: 'Body',
						name: 'SButton',
						isBody: true,
						templates: [
							// Custom Components
							{
								label: 'SButton',
								name: 'SButton',
								fields: [
									{
										type: 'rich-text',
										label: 'SButton',
										name: 'children',
										isBody: true
									}
								]
							}
						]
					}
				]
			}
		]
	}
})
