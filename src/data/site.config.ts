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
	site: 'https://terres-sucrees.fr/', // Write here your website url
	author: 'Terres Sucrées', // Site author
	title: 'Terres Sucrées — recettes de pâtisserie végane', // Site title.
	// Toutes les recettes publiées sont véganes : on le dit d'entrée de jeu, car
	// c'est la recherche principale à laquelle le site répond.
	description:
		'Recettes de pâtisserie végane : tartes, entremets et gâteaux 100 % végétaux, sans œufs ni produits laitiers.',
	lang: 'fr-FR',
	ogLocale: 'fr_FR',
	shareMessage: 'Partager', // Message to share a post on social media
	paginationSize: 6 // Number of posts per page
}
