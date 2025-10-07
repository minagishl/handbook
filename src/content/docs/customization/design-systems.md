---
title: "Design System Controls"
description: "Adapt typography, layout, and interactive elements without reinventing colors."
group: "Customization"
order: 1
---

## Layout variables

`src/styles/global.css` exposes utility classes that drive the handbook layout:

- `.docs-grid` controls the responsive grid columns.
- `.docs-sidebar` and `.docs-toc` pin navigation elements on large screens.
- `.docs-card` styles the main article surface with blur and border states that honor light and dark themes.

Update these classes to try alternate compositions—two-column wikis, single-column blog posts, or left-aligned hero sections.

## Theme toggles

Readers can switch between light and dark themes from the header. The logic saves preference in `localStorage` and falls back to the device's `prefers-color-scheme` setting. Add more schemes by extending the toggle script and `body[data-theme="*"]` selectors in the global stylesheet.

## Component slots

`src/layouts/DocsLayout.astro` exposes named slots (`hero`, `actions`) so individual pages can override hero content or header CTAs. Compose bespoke layouts per section while keeping a consistent navigation shell.
