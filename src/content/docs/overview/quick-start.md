---
title: "Quick Start"
description: "Install dependencies, run the dev server, and ship your handbook."
group: "Overview"
order: 2
---

## Prerequisites

- Node.js 20 or newer
- pnpm 10+
- Git for version control

## Install and develop locally

```bash
pnpm install
pnpm dev
```

Astro's dev server provides instant reloads and accessible error overlays. Open `http://localhost:4321` to browse the handbook. Press `o` in the terminal to open the site directly in your default browser.

## Build and deploy

```bash
pnpm build
```

The production build generates static assets inside `./dist`. Deploy these files to any static host—GitHub Pages, Netlify, Vercel, or an internal CDN. Astro's output is framework-agnostic and works with your existing pipelines.

## Keep dependencies updated

- Follow Astro's release notes for CLI upgrades.
- Monitor Tailwind CSS v4 announcements for plugin updates.
- Schedule monthly dependency reviews so custom components stay aligned with upstream improvements.

Next, explore how Markdown content collections are structured.
