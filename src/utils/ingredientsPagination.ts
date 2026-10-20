/**
 * Catalogue des préparations (/ingredients/) : tailles de page et styles de la
 * pagination.
 *
 * Les classes sont partagées entre le rendu serveur (flèches
 * précédent/suivant écrites dans le HTML) et la pagination construite côté
 * navigateur (numéros de page), pour que les deux moitiés du contrôle restent
 * identiques sans dupliquer les chaînes.
 */

/** Tailles proposées par le sélecteur « Afficher … par page ». */
export const PAGE_SIZES = [10, 25, 50, 100]

/**
 * 25 par défaut : la première page est pleine dès l'arrivée sur le catalogue,
 * sans rien régler. La valeur est aussi la vue canonique de la page, donc
 * absente de l'URL.
 */
export const DEFAULT_PAGE_SIZE = 25

// Toujours 40 × 40 px (h-10 w-10) : la barre de pagination garde le même
// gabarit, qu'un bouton porte un chiffre, une flèche ou les points de suspension.
const pagerBase =
	'flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition'

export const pagerLinkClass = `${pagerBase} border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-ink-line dark:bg-ink-surface dark:text-ink-body dark:hover:bg-ink-raised`

/**
 * Page courante : pastille pleine, non cliquable (aria-current="page").
 *
 * Chaîne complète et autonome, sans `pagerLinkClass` : les variantes `dark:` de
 * celle-ci (fond et filet) seraient plus spécifiques et effaceraient la pastille
 * en mode sombre.
 */
export const pagerActiveClass =
	'flex h-10 w-10 items-center justify-center rounded-lg border border-primary bg-primary text-sm font-medium text-white'

/**
 * Remplace les numéros du côté étroit de la barre : « Page 3 sur 8 ». Une
 * étiquette texte tient sur la ligne là où sept boutons ne tiennent pas.
 */
export const pagerStatusClass =
	'px-2 text-sm font-medium whitespace-nowrap text-slate-600 dark:text-ink-muted'

/** Trou entre deux pages affichées (« 1 2 … 7 8 »). */
export const pagerGapClass =
	'flex h-10 w-10 items-center justify-center text-sm text-slate-400 dark:text-ink-faint'
