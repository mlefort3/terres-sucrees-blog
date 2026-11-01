import { getCollection } from 'astro:content'

/**
 * Préparations publiées. Un fichier `draft: true` n'a ni page
 * `/ingredients/<id>/`, ni ligne dans le catalogue, ni présence dans les
 * recettes (affichage, sommaire, export PDF, JSON-LD, « Créer ma recette »).
 */
export const getRecipeIngredients = async () =>
	(await getCollection('recipeIngredients')).filter((ingredient) => !ingredient.data.draft)
