---
title: "Authoring Content"
description: "Structure Markdown articles, add callouts, and reference assets."
group: "Content"
order: 1
---

## Markdown essentials

Use standard Markdown syntax for headings, lists, strong emphasis, and inline code. The layout automatically renders typography via Tailwind's `prose` styles, so content stays legible across themes.

```md
---
title: "Release Process"
description: "Template for shipping product releases"
order: 3
group: "Operations"
---

## Goals

- Confirm readiness checklist
- Publish release notes
```

## Callouts and tips

Add fenced blocks with custom classes for inline callouts. Tailwind utilities let you express intent without hex codes:

```md
> **Heads up**
> Wrap complex callouts in blockquotes and style them with classes such as `border-l-4 border-sky-400 bg-sky-50/70 p-4`.
```

## Embedding components

Astro components can live alongside Markdown. Import UI primitives at the top of a document, then use them inline for reusable diagrams, KPI cards, or CTA banners.

```
import MetricCard from "../../components/MetricCard.astro";

<MetricCard title="Support SLA" value="98%" />
```

## Managing assets

Uploads placed inside `public/` become available at `/` paths (e.g. `public/diagrams/team-structure.png` becomes `/diagrams/team-structure.png`). Keep visuals optimized and compressed for fast loads.
