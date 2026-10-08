// Helpers for the "Créer ma recette" builder page.
//
// Every ingredient declares its own `category`. A recipe "kind" (tarte or
// entremet) decides which slots are shown, whether they are required for the
// recipe to be complete, and where they sit in the montage. The dropdowns are
// fed by the ingredient categories.
//
// The slot array of a kind is ordered from the bottom of the cake to the top:
// that single order is the montage order. `primary` only decides whether the
// dropdown shows up in the main grid or in the optional panel.

export type RecipeCategory =
	| 'pâte'
	| 'biscuit'
	| 'sirop'
	| 'croustillant'
	| 'insert'
	| 'mousse'
	| 'glaçage'
	| 'décor'
	| 'autre'

export type RecipeKind = 'tarte' | 'entremet'

export interface RecipeKindOption {
	key: RecipeKind
	label: string
}

export const RECIPE_KINDS: RecipeKindOption[] = [
	{ key: 'tarte', label: 'Tarte' },
	{ key: 'entremet', label: 'Entremet' }
]

export interface RecipeSlot {
	/** Identifier used for the select and in the layer order. */
	key: string
	label: string
	/** Ingredient category that feeds this dropdown. */
	category: RecipeCategory
	/** Shown in the main grid of dropdowns (otherwise in the optional panel). */
	primary: boolean
	/** A recipe is only "complète" once every required slot is filled. */
	required: boolean
	hint: string
}

export const RECIPE_KIND_SLOTS: Record<RecipeKind, RecipeSlot[]> = {
	tarte: [
		{
			key: 'fond',
			label: 'Fond',
			category: 'pâte',
			primary: true,
			required: true,
			hint: 'La pâte de base'
		},
		{
			key: 'biscuit',
			label: 'Biscuit',
			category: 'biscuit',
			primary: false,
			required: false,
			hint: 'Une couche de biscuit, entre le fond et le croustillant'
		},
		{
			key: 'sirop',
			label: 'Sirop',
			category: 'sirop',
			primary: false,
			required: false,
			hint: 'Le sirop d’imbibage, appliqué sur le fond ou le biscuit'
		},
		{
			key: 'croustillant',
			label: 'Croustillant',
			category: 'croustillant',
			primary: true,
			required: false,
			hint: "Entre le fond (ou le biscuit) et l'insert"
		},
		{
			key: 'insert',
			label: 'Insert',
			category: 'insert',
			primary: true,
			required: true,
			hint: "L'insert fruité"
		},
		{
			key: 'mousse',
			label: 'Mousse',
			category: 'mousse',
			primary: true,
			required: true,
			hint: "La mousse, au-dessus de l'insert"
		},
		{
			key: 'decor',
			label: 'Décor',
			category: 'décor',
			primary: false,
			required: false,
			hint: 'Les éléments de décor, à la fin'
		}
	],
	entremet: [
		{
			key: 'biscuit',
			label: 'Biscuit',
			category: 'biscuit',
			primary: true,
			required: true,
			hint: 'Le biscuit de base'
		},
		{
			key: 'sirop',
			label: 'Sirop',
			category: 'sirop',
			primary: false,
			required: false,
			hint: 'Le sirop d’imbibage, appliqué sur le biscuit'
		},
		{
			key: 'croustillant',
			label: 'Croustillant',
			category: 'croustillant',
			primary: true,
			required: false,
			hint: "Entre le biscuit et l'insert"
		},
		{
			key: 'insert',
			label: 'Insert',
			category: 'insert',
			primary: true,
			required: true,
			hint: "L'insert fruité"
		},
		{
			key: 'mousse',
			label: 'Mousse',
			category: 'mousse',
			primary: true,
			required: true,
			hint: "La mousse, au-dessus de l'insert"
		},
		{
			key: 'glaçage',
			label: 'Glaçage',
			category: 'glaçage',
			primary: false,
			required: false,
			hint: 'Le glaçage, à la fin mais avant le décor'
		},
		{
			key: 'decor',
			label: 'Décor',
			category: 'décor',
			primary: false,
			required: false,
			hint: 'Les éléments de décor, à la fin'
		}
	]
}

/** Dropdowns of the main grid, in montage order. */
export const primarySlots = (kind: RecipeKind) =>
	RECIPE_KIND_SLOTS[kind].filter((slot) => slot.primary)

/** Dropdowns of the optional panel, in montage order. */
export const optionSlots = (kind: RecipeKind) =>
	RECIPE_KIND_SLOTS[kind].filter((slot) => !slot.primary)

/** Slots that must be filled for the recipe to be complete. */
export const requiredSlotKeys = (kind: RecipeKind) =>
	RECIPE_KIND_SLOTS[kind].filter((slot) => slot.required).map((slot) => slot.key)

/** Layer order, from the bottom of the cake to the top. */
export const RECIPE_KIND_ORDER: Record<RecipeKind, string[]> = {
	tarte: RECIPE_KIND_SLOTS.tarte.map((slot) => slot.key),
	entremet: RECIPE_KIND_SLOTS.entremet.map((slot) => slot.key)
}
