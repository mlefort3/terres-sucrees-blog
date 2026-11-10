import { defineCollection, z } from 'astro:content'
import { CATEGORIES } from '@/data/categories'

// Durée ISO 8601 attendue par les données structurées (« PT45M », « PT1H30M »).
const isoDuration = z
	.string()
	.regex(/^PT(?=\d)(\d+H)?(\d+M)?(\d+S)?$/, 'Durée ISO 8601 attendue, ex. « PT45M »')

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string().max(80),
			description: z.string(),
			// Transform string to Date object
			pubDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			// Temps de préparation et de cuisson, repris dans le JSON-LD (Google les
			// recommande ensemble). Absents : aucune durée n'est déclarée.
			prepTime: isoDuration.optional(),
			cookTime: isoDuration.optional(),
			heroImage: image(),
			categories: z.array(z.enum(CATEGORIES)),
			tags: z.array(z.string()),
			draft: z.boolean().default(false),
			// References to recipe ingredients (optional)
			recipeIngredients: z.array(z.string()).optional()
		})
})

const recipeIngredients = defineCollection({
	type: 'data',
	schema: z.object({
		name: z.string(),
		category: z.enum([
			'pâte',
			'biscuit',
			'sirop',
			'croustillant',
			'insert',
			'mousse',
			'glaçage',
			'décor',
			'autre'
		]),
		description: z.string().optional(),
		ingredients: z.array(
			z.object({
				item: z.string(),
				quantity: z.string().optional()
			})
		),
		// Saveurs portées par la préparation (ex. « vanille », « chocolat noir »)
		flavor: z.array(z.string()),
		steps: z.array(z.string()),
		// Préparation en cours de rédaction : ni page, ni catalogue, ni recette
		draft: z.boolean().default(false),
		source: z
			.union([
				z.string(),
				z.object({
					title: z.string(),
					url: z.string().url()
				})
			])
			.optional(),
		notes: z.string().optional()
	})
})

export const collections = { blog, recipeIngredients }
