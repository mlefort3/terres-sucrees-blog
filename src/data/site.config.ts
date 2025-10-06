interface SiteConfig {
	site: string
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	site: 'https://blog-template-gray.vercel.app/', // Write here your website url
	author: 'Terres Sucrées', // Site author
	title: 'Toutes les recettes', // Site title.
	description: 'Recettes de pâtisserie végétale.', // Description to display in the meta tags
	lang: 'fr-FR',
	ogLocale: 'fr_FR',
	shareMessage: 'Partager', // Message to share a post on social media
	paginationSize: 6 // Number of posts per page
}
