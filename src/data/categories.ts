// List of categories for blog posts
export const CATEGORIES = ['Printemps', 'Été', 'Automne', 'Hiver'] as const

/**
 * Une seule couleur par saison, prise dans la palette du site.
 *
 * - Printemps : vert menthe (#b8d1b1), les jeunes pousses.
 * - Été : jaune beurre (#fce5a8), le soleil.
 * - Automne : rose blush (#fab7cf), le seul ton chaud restant, qui évoque les
 *   fruits mûrs.
 * - Hiver : lilas (#bdb7fd), le givre et les baies froides.
 *
 * `chip` est la classe complète de pastille, `dot` la même teinte en fond pour
 * la petite puce des filtres de saison.
 */
export const SEASON_STYLES: Record<string, { chip: string; dot: string }> = {
	printemps: { chip: 'pop-chip--mint', dot: 'bg-mint' },
	été: { chip: 'pop-chip--butter', dot: 'bg-butter' },
	automne: { chip: 'pop-chip--blush', dot: 'bg-blush' },
	hiver: { chip: 'pop-chip--lilac', dot: 'bg-lilac' }
}

const FALLBACK_STYLE = { chip: '', dot: 'bg-ink/25' }

/**
 * Couleur d'une saison, insensible à la casse et aux espaces. Une catégorie
 * inconnue retombe sur la pastille neutre, sans jamais changer de teinte au fil
 * des pages : c'est le nom qui décide, pas la position dans la liste.
 */
export const seasonStyle = (name: string) =>
	SEASON_STYLES[name.trim().toLowerCase()] ?? FALLBACK_STYLE

/** Classe de pastille d'une saison (« Automne » → `pop-chip--blush`). */
export const seasonChipClass = (name: string) => seasonStyle(name).chip
