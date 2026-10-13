<div align="center">

# 🍰 Terres Sucrées

**Recettes de pâtisserie végétale**

[terres-sucrees.fr](https://terres-sucrees.fr/) · [Instagram](https://instagram.com/terres.sucrees)

</div>

## 🌱 Le projet

**Terres Sucrées** est un blog de pâtisserie végétale. Chaque recette est
décomposée en **éléments modulaires** (fond, biscuit, croustillant, insert,
mousse, glaçage, décor…) qui peuvent être assemblés pour composer de nouvelles
créations.

Le site rassemble :

- un **catalogue de recettes** classées par saison ;
- sur chaque recette, le **détail de ses éléments modulaires** (ingrédients et
  étapes) ;
- un outil **« Créer ma recette »** qui assemble les éléments et génère un PDF.

## ✨ Fonctionnalités

- ✅ Recettes saisonnières — catégories Printemps, Été, Automne, Hiver
- ✅ Composants modulaires réutilisables entre les recettes
- ✅ **Créer ma recette** : assemblage guidé (Tarte ou Entremet) et export PDF
- ✅ Suggestions de saveurs compatibles entre les couches (« Recommandé »)
- ✅ Recherche statique ([Pagefind](https://pagefind.app/), en production)
- ✅ Flux RSS et sitemap
- ✅ Table des matières et temps de lecture sur les recettes
- ✅ Support Markdown & MDX avec coloration syntaxique
- ✅ Mode sombre
- ✅ Optimisation des images
- ✅ CMS dans le dépôt (Tina CMS)

## ⚙️ Stack

- [**Astro** + **TypeScript**](https://astro.build/) — le framework tout-en-un pensé pour la vitesse.
- [**Tailwind CSS** + **tailwind-merge** + **clsx**](https://tailwindcss.com/) — styles utilitaires.
- [**MDX**](https://docs.astro.build/en/guides/integrations-guide/mdx/) — contenu enrichi.
- [**Pagefind**](https://pagefind.app/) — recherche statique.
- [**jsPDF**](https://github.com/parallax/jsPDF) — export PDF des recettes composées.
- [**Motion**](https://motion.dev/) — animations.
- [**Tina CMS**](https://tina.io/) — édition du contenu.
- [**ESLint**](https://eslint.org/) + [**Prettier**](https://prettier.io/) + Husky — qualité de code.

## 🗂️ Structure

```
├── public/                       # assets statiques (favicon, open-graph, robots.txt…)
├── src/
│   ├── assets/                   # images des recettes
│   ├── components/               # composants Astro (PostCard, RecipeIngredientsDisplay, RecipeSlotSelect…)
│   ├── content/
│   │   ├── blog/                 # les recettes (.mdx)
│   │   └── recipeIngredients/    # les éléments modulaires (.yml)
│   ├── data/                     # site.config.ts, categories.ts, links.ts
│   ├── layouts/
│   ├── pages/                    # index, post, category, tags, creer-ma-recette, about…
│   ├── styles/
│   └── utils/
├── tina/                         # configuration Tina CMS
├── ingredients-flavors.json      # affinités de saveurs entre les couches
└── astro.config.mjs
```

## 📄 Les recettes

Une recette est un fichier `.mdx` dans **src/content/blog**. Le nom du fichier
donne le slug de l'URL (`Tarte-fraise-basilic-.mdx` → `/post/Tarte-fraise-basilic-/`).

Le frontmatter est validé par Zod (voir **src/content/config.ts**) :

```yaml
---
title: 'Tarte fraise basilic 🌿'
description: 'Une tarte fraise basilic, avec du pesto sucré !'
pubDate: 2025-04-16
heroImage: /src/assets/images/img_8210-scaled.jpg
categories: [Printemps] # saison(s)
tags: [fruits, tartes]
draft: false # optionnel, absent = false
recipeIngredients: # ids des éléments modulaires utilisés
  - croustillant-amande-huile-olive
  - gel-fraise
  - pesto-sucre
  - mousse-vanille
---
```

## 🧩 Les ingrédients modulaires

Chaque élément est un fichier `.yml` dans **src/content/recipeIngredients**.
La `category` détermine la couche qu'il occupe dans le montage :

`pâte` · `biscuit` · `sirop` · `croustillant` · `insert` · `mousse` · `glaçage` ·
`décor` · `autre`

```yaml
name: 'Mousse vanille'
category: mousse
description: 'Mousse légère et vanillée montée à la crème végétale'
ingredients:
  - item: '250 ml de crème végétale à monter'
flavor: [vanille] # saveurs portées par la préparation
steps:
  - 'Monter la crème en chantilly et la réserver au froid'
source:
  title: 'Terres Sucrées'
  url: https://terres-sucrees.fr/
```

Le fichier **ingredients-flavors.json** associe à chaque saveur ses saveurs
compatibles ; il alimente les recommandations de la page _Créer ma recette_.

## 🛠️ Créer ma recette

La page **/creer-ma-recette** permet de composer une recette à partir des
éléments modulaires :

1. Choisir le type de recette — **Tarte** ou **Entremet** ;
2. Sélectionner un élément dans chaque catégorie (les couches nécessaires à la
   complétude de la recette sont marquées comme telles) ;
3. Les options dont les saveurs s'accordent avec les couches déjà choisies sont
   signalées **« Recommandé »** ;
4. Le nom se génère automatiquement (type + saveurs du montage) et reste
   modifiable ;
5. Une fois la recette complète, **Télécharger en PDF** exporte le montage et
   ses préparations.

## 📐 Configuration

- **src/data/site.config.ts** — métadonnées du site (URL, titre, description,
  langue, pagination).
- **src/data/links.ts** — réseaux sociaux affichés.
- **src/data/categories.ts** — liste des saisons (`Printemps`, `Été`, `Automne`,
  `Hiver`).
- **public/** — favicon, `robots.txt` (penser à y mettre l'URL du sitemap),
  open-graph.

## 🧞 Commandes

All commands are run from the root of the project, from a terminal:

| Command                 | Action                                                                                                                           |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`          | Installs dependencies                                                                                                            |
| `pnpm run dev`          | Starts local dev server at `localhost:3000`                                                                                      |
| `pnpm run build`        | Build your production site to `./dist/`                                                                                          |
| `pnpm run preview`      | Preview your build locally, before deploying                                                                                     |
| `pnpm run format:check` | Check code format with Prettier                                                                                                  |
| `pnpm run format`       | Format codes with Prettier                                                                                                       |
| `pnpm run sync`         | Generates TypeScript types for all Astro modules. [Learn more](https://docs.astro.build/en/reference/cli-reference/#astro-sync). |
| `pnpm run lint`         | Lint with ESLint                                                                                                                 |
