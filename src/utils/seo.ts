import { siteConfig } from '@/data/site.config'
import { sluglify } from './sluglify'

export const SITE_URL = siteConfig.site
export const ORGANIZATION_ID = `${SITE_URL}#organization`
export const WEBSITE_ID = `${SITE_URL}#website`

/** URL absolue à partir d'un chemin interne (le site se termine par « / »). */
export const absoluteUrl = (path = '/') => new URL(path, SITE_URL).href

// Logo / image de marque reprise par les données structurées.
const BRAND_IMAGE = '/android-chrome-512x512.png'
const SOCIAL_PROFILES = ['https://instagram.com/terres.sucrees']

// Le site ne publie que des recettes véganes : ces mots-clés accompagnent
// chaque recette pour appuyer le positionnement.
export const DIET_KEYWORDS = [
	'recette végane',
	'recette vegan',
	'pâtisserie végane',
	'pâtisserie végétale',
	'sans œufs',
	'sans produits laitiers'
]

const organizationNode = () => ({
	'@type': 'Organization',
	'@id': ORGANIZATION_ID,
	name: siteConfig.author,
	url: absoluteUrl('/'),
	logo: { '@type': 'ImageObject', url: absoluteUrl(BRAND_IMAGE) },
	description: siteConfig.description,
	sameAs: SOCIAL_PROFILES
})

/** WebSite + Organization, à poser sur la page d'accueil. */
export const homeJsonLd = () => ({
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': WEBSITE_ID,
			url: absoluteUrl('/'),
			name: siteConfig.author,
			description: siteConfig.description,
			inLanguage: siteConfig.lang,
			publisher: { '@id': ORGANIZATION_ID }
		},
		organizationNode()
	]
})

export const breadcrumbNode = (items: { name: string; url: string }[]) => ({
	'@type': 'BreadcrumbList',
	itemListElement: items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.name,
		item: item.url
	}))
})

/** Fil d'Ariane seul (pages de liste). */
export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
	'@context': 'https://schema.org',
	'@graph': [breadcrumbNode(items)]
})

export type RecipeJsonLdInput = {
	title: string
	description: string
	url: string
	image?: string
	datePublished: string
	categories?: string[]
	tags?: string[]
	components: {
		name: string
		ingredients: { item: string; quantity?: string | null }[]
		steps: string[]
	}[]
}

/**
 * Recipe + fil d'Ariane. La recette est déclarée « VeganDiet » : c'est le
 * signal que Google attend pour souligner qu'une recette est végane.
 */
export const recipeJsonLd = (input: RecipeJsonLdInput) => {
	const ingredients = input.components.flatMap((component) =>
		component.ingredients.map((ing) => (ing.quantity ? `${ing.item} (${ing.quantity})` : ing.item))
	)
	const instructions = input.components.map((component) => ({
		'@type': 'HowToSection',
		name: component.name,
		itemListElement: component.steps.map((step) => ({ '@type': 'HowToStep', text: step }))
	}))

	const category = input.categories?.[0]
	const crumbs = [
		{ name: 'Accueil', url: absoluteUrl('/') },
		...(category
			? [{ name: category, url: absoluteUrl(`/category/${sluglify(category.toLowerCase())}/1`) }]
			: []),
		{ name: input.title, url: input.url }
	]

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Recipe',
				'@id': `${input.url}#recipe`,
				name: input.title,
				description: input.description,
				url: input.url,
				...(input.image ? { image: [input.image] } : {}),
				author: organizationNode(),
				publisher: organizationNode(),
				datePublished: input.datePublished,
				inLanguage: siteConfig.lang,
				recipeCategory: ['Dessert', 'Pâtisserie végane'],
				recipeCuisine: 'Française',
				suitableForDiet: 'https://schema.org/VeganDiet',
				isAccessibleForFree: true,
				keywords: [...DIET_KEYWORDS, ...(input.tags ?? []), ...(input.categories ?? [])].join(', '),
				recipeIngredient: ingredients,
				recipeInstructions: instructions,
				mainEntityOfPage: { '@type': 'WebPage', '@id': input.url }
			},
			breadcrumbNode(crumbs),
			// Présent pour que les références `@id` d'author/publisher se résolvent.
			organizationNode()
		]
	}
}
