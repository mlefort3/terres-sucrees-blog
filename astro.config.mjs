import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/utils/readTime.ts'
import { siteConfig } from './src/data/site.config'

// https://astro.build/config
export default defineConfig({
	site: siteConfig.site,
	markdown: {
		remarkPlugins: [remarkReadingTime],
		drafts: true,
		shikiConfig: {
			theme: 'material-theme-palenight',
			wrap: true
		}
	},
	integrations: [
		mdx({
			syntaxHighlight: 'shiki',
			shikiConfig: {
				experimentalThemes: {
					light: 'vitesse-light',
					dark: 'material-theme-palenight',
				  },
				wrap: true
			},
			drafts: true
		}),
		sitemap({
			// Les pages de liste paginées sont soit des doublons de la page d'accueil
			// (/all/1), soit en noindex (page ≥ 2) : on les écarte du sitemap.
			filter: (page) => {
				const { pathname } = new URL(page)
				if (/^\/all\/\d+\/?$/.test(pathname)) return false
				const categoryPage = pathname.match(/^\/category\/[^/]+\/(\d+)\/?$/)
				if (categoryPage && Number(categoryPage[1]) > 1) return false
				return true
			}
		}),
		tailwind()
	]
})