import { getCollection } from 'astro:content'
import { CATEGORIES } from '@/data/categories'
import { sluglify } from './sluglify'

/**
 * Identifiant d'URL d'un tag. « Gâteaux de voyage » et « gâteaux-de-voyage »
 * désignent le même tag : les deux graphies doivent produire une seule page,
 * sinon Google voit deux pages de taxonomie concurrentes pour un même sujet.
 */
export const tagSlug = (tag: string) => sluglify(tag.trim().toLowerCase())

export const getCategories = async () => {
	const posts = await getCollection('blog')
	const categories = new Set<string>()
	posts
		.filter((post) => !post.data.draft)
		.forEach((post) => {
			;(post.data.categories || []).forEach((cat: string) => {
				if (cat) categories.add(cat)
			})
		})
	return Array.from(categories).sort((a, b) => {
		const aIdx = CATEGORIES.includes(a as (typeof CATEGORIES)[number])
			? CATEGORIES.indexOf(a as (typeof CATEGORIES)[number])
			: 999
		const bIdx = CATEGORIES.includes(b as (typeof CATEGORIES)[number])
			? CATEGORIES.indexOf(b as (typeof CATEGORIES)[number])
			: 999
		return aIdx - bIdx
	})
}

export const getPosts = async (max?: number) => {
	return (await getCollection('blog'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.slice(0, max)
}

export const getTags = async () => {
	const posts = await getCollection('blog')
	const tags = new Set<string>()
	posts
		.filter((post) => !post.data.draft)
		.forEach((post) => {
			post.data.tags.forEach((tag) => {
				const slug = tagSlug(tag)
				if (slug != '') {
					tags.add(slug)
				}
			})
		})

	return Array.from(tags).sort()
}

export const getPostByTag = async (tag: string) => {
	const posts = await getPosts()
	const tagSlugToMatch = tagSlug(tag)
	return posts.filter((post) => {
		return post.data.tags.some((postTag) => tagSlug(postTag) === tagSlugToMatch)
	})
}

export const filterPostsByCategory = async (category: string) => {
	const posts = await getPosts()
	return posts
		.filter((post) => !post.data.draft)
		.filter((post) =>
			(post.data.categories || [])
				.map((c: string) => c.toLowerCase())
				.includes(category.toLowerCase())
		)
}
