# Handbook (Astro + Tailwind CSS v4)

A GitBook-inspired handbook site powered by [Astro 5](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com). Markdown content drives the navigation, while reusable Astro layouts deliver a polished authoring experience without maintaining a custom color system.

## Quick start

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`. Press `/` from any page to focus the header search field. Build static assets for deployment with:

```bash
pnpm build
```

The production output lives in `./dist` and can be hosted on any static provider (GitHub Pages, Netlify, Vercel, Cloudflare Pages, or an internal CDN).

## Project structure

```
/
├── public/                     # Static assets served at the root URL
├── src/
│   ├── components/             # Layout shell pieces (header, sidebar, TOC, theme toggle)
│   ├── content/
│   │   ├── config.ts           # Zod schema for the `docs` collection
│   │   └── docs/               # Markdown sources grouped by directory
│   ├── layouts/
│   │   └── DocsLayout.astro    # GitBook-style three-column layout with slots
│   ├── pages/
│   │   ├── docs/[...slug].astro# Dynamic renderer for every handbook article
│   │   └── index.astro         # Redirects to the first available doc, or shows onboarding
│   ├── styles/
│   │   └── global.css          # Tailwind directives, typography plugin, custom utilities
│   └── utils/
│       └── navigation.ts       # Builds grouped sidebar data and next/previous links
├── astro.config.mjs            # Adds the @tailwindcss/vite plugin to Vite
├── tailwind.config.ts          # Tailwind v4 content globs, theme extensions, dark mode
├── package.json
└── README.md
```

## Authoring content

1. Add Markdown files under `src/content/docs`. Nested folders create nested slugs (e.g. `src/content/docs/overview/introduction.md` → `/docs/overview/introduction`).
2. Include frontmatter fields:
   - `title`: page heading and sidebar label
   - `description`: optional summary in cards and meta tags
   - `group`: sidebar section (e.g. `Overview`, `Content`, `Customization`)
   - `order`: numeric ordering within the group
3. Use standard Markdown, MDX shortcodes, or Astro components. The layout applies Tailwind's `prose` typography styles automatically.

## Customization guide

- **Tailwind tokens:** extend spacing, radius, or typography in `tailwind.config.ts`. Tailwind v4 removes the need to maintain a manual color palette—lean on built-in palettes like `slate`, `sky`, and `emerald` for consistent theming.
- **Layout tweaks:** adjust grid templates, card styling, or utility classes inside `src/styles/global.css`. The stylesheet defines `.docs-grid`, `.docs-sidebar`, `.docs-card`, and `.docs-toc` helpers for quick experimentation.
- **Navigation logic:** update `src/utils/navigation.ts` if you need custom grouping or filtering rules. Hidden pages can set `sidebar.hidden: true` in frontmatter.
- **Theme presets:** the header theme toggle stores preferences in `localStorage` and respects `prefers-color-scheme`. Add new schemes by extending the toggle script and creating additional `body[data-theme="*"]` selectors.

## Recommended workflows

- Commit new docs alongside automated previews so stakeholders can review rendered content.
- Schedule dependency updates monthly (`astro`, `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/typography`).
- Add automated linting or visual regression tests as the component surface grows.

Enjoy building a highly customizable handbook without sacrificing maintainability.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
