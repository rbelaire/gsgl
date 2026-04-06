# Gulf South Golf Lab Website Foundation

Premium, responsive front-end foundation for Gulf South Golf Lab built with Next.js App Router, TypeScript, and Tailwind CSS.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Component-driven UI architecture
- Static export configuration for GitHub Pages deployment

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

## Deploying to GitHub Pages

This repo is configured for project Pages at:

- `https://rbelaire.github.io/gsgl/`

Key deployment settings:

- `next.config.ts` uses `output: "export"`
- `basePath` and `assetPrefix` are set to `/gsgl` in production
- `.github/workflows/deploy-pages.yml` builds and deploys the `out/` directory

After merging to `main`, GitHub Actions should publish the latest build to Pages.
