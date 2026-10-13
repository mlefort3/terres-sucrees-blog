import { siteConfig } from '@/site-config'

// robots.txt est généré (comme rss.xml) pour que l'URL du sitemap découle de
// `siteConfig.site` et ne puisse pas diverger du domaine réellement servi.
export const GET = () => {
	const sitemap = new URL('sitemap-index.xml', siteConfig.site).href

	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		'# Espace d’édition (TinaCMS) : jamais destiné aux visiteurs.',
		'Disallow: /admin/',
		'',
		'# Paramètres hérités de l’ancien WordPress. Les redirections 301 qui les',
		'# visent ne sont pas encore actives côté hébergeur : tant qu’elles ne le',
		'# sont pas, on empêche l’indexation de ces doublons.',
		'Disallow: /*?p=',
		'Disallow: /*?author=',
		'Disallow: /*?cat=',
		'',
		`Sitemap: ${sitemap}`,
		''
	].join('\n')

	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8'
		}
	})
}
