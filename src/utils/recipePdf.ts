import type { jsPDF } from 'jspdf'

export type RecipePdfIngredient = {
	item: string
	quantity?: string | null
}

export type RecipePdfSource = string | { title: string; url: string } | null | undefined

export type RecipePdfComponent = {
	name: string
	description?: string | null
	source?: RecipePdfSource
	ingredients: RecipePdfIngredient[]
	steps: string[]
}

export type RecipePdfData = {
	/** Nom de la recette, utilisé comme titre et comme nom de fichier. */
	name?: string | null
	/** Libellé de repli quand la recette n'a pas de nom (ex. « Tarte »). */
	kindLabel?: string
	/** Type technique de la recette, utilisé en dernier recours pour le fichier. */
	kind?: string
	/** Chapeau optionnel affiché sous le titre. */
	description?: string | null
	components: RecipePdfComponent[]
}

declare global {
	interface Window {
		/** Données lues par l'export PDF de la page « Créer ma recette ». */
		__recipePdfData?: RecipePdfData | null
	}
}

const MARGIN = 48
const GUTTER = 28
const LINE_FACTOR = 1.3
const ITEM_GAP = 4
const CARD_PAD = 14
const CARD_GAP = 14
const CARD_RADIUS = 9
const PRIMARY = [111, 107, 174]
const BODY = [45, 45, 55]
const MUTED = [122, 122, 138]
const CARD_FILL = [244, 244, 248]
const FONT = 'helvetica'

// Les polices standard de jsPDF (WinAnsi) ne connaissent ni les emojis ni les
// symboles. On les retire et on ramène la ponctuation typographique à son
// équivalent ASCII pour ne rien perdre à l'impression.
const cleanText = (value: unknown) =>
	String(value ?? '')
		.replace(/[\u2018\u2019\u201A\u201B]/g, "'")
		.replace(/[\u201C\u201D\u201E\u201F]/g, '"')
		.replace(/[\u2013\u2014\u2015]/g, '-')
		.replace(/\u2026/g, '...')
		.replace(/\u00A0/g, ' ')
		.replace(
			/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}]/gu,
			''
		)

const sourceLabel = (source: RecipePdfSource) => {
	if (!source) return ''
	if (typeof source === 'string') return `Basé sur la recette de ${source}`
	const url = source.url ? ` - ${source.url}` : ''
	return `Basé sur la recette de ${source.title}${url}`
}

const slugify = (value: string) =>
	value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60)

/**
 * Met en page une recette dans un document jsPDF déjà créé : en-tête, montage
 * puis une carte grise par élément (ingrédients / étapes). Le texte est
 * vectoriel, sélectionnable, et la table des matières n'est pas reprise.
 */
export const buildRecipePdf = (doc: jsPDF, data: RecipePdfData) => {
	const pageW = doc.internal.pageSize.getWidth()
	const pageH = doc.internal.pageSize.getHeight()
	const contentW = pageW - MARGIN * 2
	const innerW = contentW - CARD_PAD * 2
	const colW = (innerW - GUTTER) / 2
	const bottom = pageH - 54
	doc.setLineHeightFactor(LINE_FACTOR)

	let y = MARGIN

	const applyFont = (size: number, style = 'normal', color = BODY) => {
		doc.setFont(FONT, style)
		doc.setFontSize(size)
		doc.setTextColor(color[0], color[1], color[2])
	}

	// Hauteur d'un texte une fois replié sur `width`.
	const heightOf = (text: unknown, width: number, size: number, style = 'normal') => {
		doc.setFont(FONT, style)
		doc.setFontSize(size)
		return doc.splitTextToSize(cleanText(text), width).length * size * LINE_FACTOR
	}

	// Dessine un paragraphe replié depuis son bord haut et renvoie sa hauteur.
	const draw = (
		text: unknown,
		x: number,
		top: number,
		width: number,
		size: number,
		style = 'normal',
		color = BODY
	) => {
		applyFont(size, style, color)
		const lines = doc.splitTextToSize(cleanText(text), width)
		doc.text(lines, x, top, { baseline: 'top' })
		return lines.length * size * LINE_FACTOR
	}

	const newPage = () => {
		doc.addPage()
		y = MARGIN
	}

	// Carte grise d'un élément de la recette : son fond est posé avant son
	// contenu, d'où une hauteur calculée à l'avance (voir columnHeight).
	const fillCard = (top: number, height: number) => {
		doc.setFillColor(CARD_FILL[0], CARD_FILL[1], CARD_FILL[2])
		doc.roundedRect(MARGIN, top, contentW, height, CARD_RADIUS, CARD_RADIUS, 'F')
	}

	// --- En-tête : le nom de la recette à gauche, le blog à droite ---
	const title =
		cleanText((data.name || '').trim() || data.kindLabel || 'Ma recette')
			.replace(/\s+/g, ' ')
			.trim() || 'Ma recette'
	applyFont(11, 'bold', MUTED)
	const brand = 'Terres Sucrées'
	const brandW = doc.getTextWidth(brand)
	doc.text(brand, pageW - MARGIN, y + 7, { align: 'right', baseline: 'top' })
	applyFont(22, 'bold', PRIMARY)
	const titleLines = doc.splitTextToSize(title, contentW - brandW - 24)
	doc.text(titleLines, MARGIN, y, { baseline: 'top' })
	y += titleLines.length * 22 * LINE_FACTOR + 12
	doc.setDrawColor(PRIMARY[0], PRIMARY[1], PRIMARY[2])
	doc.setLineWidth(1.2)
	doc.line(MARGIN, y, pageW - MARGIN, y)
	y += 24

	// --- Chapeau optionnel (description de la recette) -------------------
	if (data.description) {
		y += draw(data.description, MARGIN, y, contentW, 11, 'normal', BODY) + 16
	}

	// --- Montage ---------------------------------------------------
	y += draw('Montage', MARGIN, y, contentW, 16, 'bold', PRIMARY) + 8
	data.components.forEach((component, index) => {
		const text = `${index + 1}.  ${component.name}`
		const h = heightOf(text, contentW - 8, 11)
		if (y + h > bottom) newPage()
		y += draw(text, MARGIN + 4, y, contentW - 8, 11) + 5
	})
	y += 20

	// --- Recette : une carte grise par élément ----------------------
	if (y + 34 > bottom) newPage()
	y += draw('Recette', MARGIN, y, contentW, 16, 'bold', PRIMARY) + 14

	// Deux colonnes côte à côte, à l'intérieur d'une carte.
	const drawColumns = (ingredients: string[], steps: string[], top: number) => {
		const leftX = MARGIN + CARD_PAD
		const rightX = leftX + colW + GUTTER

		let ly = top
		ly += draw('INGRÉDIENTS', leftX, ly, colW, 9, 'bold', PRIMARY) + 8
		ingredients.forEach((item) => {
			ly += draw(item, leftX + 2, ly, colW - 12, 10) + ITEM_GAP
		})

		let ry = top
		ry += draw('ÉTAPES', rightX, ry, colW, 9, 'bold', PRIMARY) + 8
		steps.forEach((item) => {
			ry += draw(item, rightX + 2, ry, colW - 12, 10) + ITEM_GAP
		})

		return Math.max(ly, ry) - top
	}

	const columnHeight = (ingredients: string[], steps: string[]) => {
		const head = heightOf('INGRÉDIENTS', colW, 9, 'bold') + 8
		const list = (items: string[]) =>
			items.reduce((total, item) => total + heightOf(item, colW - 12, 10) + ITEM_GAP, 0)
		return Math.max(head + list(ingredients), head + list(steps))
	}

	data.components.forEach((component) => {
		const ingredients = component.ingredients.map(
			(ing) => `-  ${ing.item}${ing.quantity ? ` (${ing.quantity})` : ''}`
		)
		const steps = component.steps.map((step, index) => `${index + 1}.  ${step}`)
		const source = sourceLabel(component.source)

		const headH =
			heightOf(component.name, innerW, 13, 'bold') +
			(source ? 4 + heightOf(source, innerW, 9, 'italic') : 0) +
			(component.description ? 10 + heightOf(component.description, innerW, 10) : 0) +
			(source || component.description ? 10 : 0)
		const cardH = CARD_PAD * 2 + headH + columnHeight(ingredients, steps)

		// La carte tient sur une page : fond gris, puis contenu par-dessus.
		if (cardH <= bottom - MARGIN) {
			if (y + cardH > bottom) newPage()
			const top = y
			const leftX = MARGIN + CARD_PAD
			fillCard(top, cardH)
			let cy = top + CARD_PAD
			cy += draw(component.name, leftX, cy, innerW, 13, 'bold', PRIMARY)
			if (source) {
				cy += 4
				cy += draw(source, leftX, cy, innerW, 9, 'italic', MUTED)
			}
			if (component.description) {
				cy += 10
				cy += draw(component.description, leftX, cy, innerW, 10)
			}
			if (source || component.description) cy += 10
			drawColumns(ingredients, steps, cy)
			y = top + cardH + CARD_GAP
			return
		}

		// Élément plus haut qu'une page (rare) : les sections s'empilent et la
		// carte est découpée page par page.
		type Row =
			| { gap: number }
			| {
					text: unknown
					size: number
					style: string
					color: number[]
					width: number
					indent: number
					height: number
			  }
		const rows: Row[] = []
		const pushRow = (
			text: unknown,
			size: number,
			style: string,
			color: number[],
			width: number,
			indent = 0
		) => {
			rows.push({
				text,
				size,
				style,
				color,
				width,
				indent,
				height: heightOf(text, width, size, style)
			})
		}
		const pushGap = (gap: number) => rows.push({ gap })

		pushRow(component.name, 13, 'bold', PRIMARY, innerW)
		if (source) {
			pushGap(4)
			pushRow(source, 9, 'italic', MUTED, innerW)
		}
		if (component.description) {
			pushGap(10)
			pushRow(component.description, 10, 'normal', BODY, innerW)
		}
		pushGap(10)
		pushRow('INGRÉDIENTS', 9, 'bold', PRIMARY, innerW)
		pushGap(8)
		ingredients.forEach((item) => {
			pushRow(item, 10, 'normal', BODY, innerW - 2, 2)
			pushGap(ITEM_GAP)
		})
		pushGap(14)
		pushRow('ÉTAPES', 9, 'bold', PRIMARY, innerW)
		pushGap(8)
		steps.forEach((item) => {
			pushRow(item, 10, 'normal', BODY, innerW - 2, 2)
			pushGap(ITEM_GAP)
		})

		// Découpe en segments d'une page, sans laisser de blanc en fin de carte.
		const limit = bottom - MARGIN - CARD_PAD * 2
		const segments: Row[][] = []
		let segment: Row[] = []
		let used = 0
		for (const row of rows) {
			const height = 'height' in row ? row.height : row.gap
			if (used + height > limit && segment.some((item) => 'height' in item)) {
				while (segment.length && !('height' in segment[segment.length - 1])) {
					const last = segment.pop()
					if (last && 'gap' in last) used -= last.gap
				}
				segments.push(segment)
				segment = []
				used = 0
			}
			segment.push(row)
			used += height
		}
		segments.push(segment)

		segments.forEach((segmentRows) => {
			const height =
				CARD_PAD * 2 +
				segmentRows.reduce((total, row) => total + ('height' in row ? row.height : row.gap), 0)
			if (y + height > bottom) newPage()
			const top = y
			fillCard(top, height)
			let cy = top + CARD_PAD
			for (const row of segmentRows) {
				if (!('height' in row)) {
					cy += row.gap
					continue
				}
				draw(
					row.text,
					MARGIN + CARD_PAD + row.indent,
					cy,
					row.width,
					row.size,
					row.style,
					row.color
				)
				cy += row.height
			}
			y = top + height + CARD_GAP
		})
	})

	// --- Pied de page ----------------------------------------------
	const total = doc.getNumberOfPages()
	for (let page = 1; page <= total; page++) {
		doc.setPage(page)
		applyFont(8, 'normal', MUTED)
		doc.text(`Terres Sucrées - page ${page}/${total}`, pageW / 2, pageH - 26, {
			align: 'center',
			baseline: 'top'
		})
	}

	// Le fichier téléchargé porte le nom choisi, sinon le type de recette.
	const suffix = (data.name || '').trim() ? slugify(data.name || '') : ''
	doc.save(`recette-${suffix || data.kind || 'sans-nom'}.pdf`)
}

/** Charge jsPDF à la demande et déclenche le téléchargement du PDF. */
export const downloadRecipePdf = async (data: RecipePdfData) => {
	const { jsPDF } = await import('jspdf')
	const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
	buildRecipePdf(doc, data)
}
