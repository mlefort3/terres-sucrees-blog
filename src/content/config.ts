import { defineCollection, z } from 'astro:content'
import { CATEGORIES } from '@/data/categories'

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
		steps: z.array(z.string()),
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
