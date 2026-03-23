# Notion CMS Integration — Design Spec

**Date:** 2026-03-23
**Status:** Approved

## Goal

Replace hardcoded `src/lib/data.ts` with Notion as the content source for zachbackas.com. The site design, layout, and components remain exactly as-is. Content (project titles, descriptions, images) becomes editable in Notion without touching code.

## Architecture

```
Notion database
      ↓ (Notion API, build time)
Next.js (src/lib/notion.ts)
      ↓ (static generation + ISR)
Vercel Hobby (free)
      ↓
zachbackas.com
```

Auto-deploy: Notion automation → Vercel deploy hook URL → triggers fresh build on content change.

## Notion Database Schema

One database contains all projects across all categories.

| Property    | Type     | Notes                                        |
|-------------|----------|----------------------------------------------|
| Title       | Title    | Project name displayed on site               |
| Slug        | Text     | URL-safe identifier (e.g. `winghopper`)      |
| Category    | Select   | `projects`, `fun`, or `photography`          |
| Year        | Number   | Optional. Shown on grid card and detail page |
| Order       | Number   | Controls sort order within each category     |
| Published   | Checkbox | Unchecked = hidden from site                 |

**Page body** contains the project description (as paragraph blocks) followed by image blocks in display order. The first image in the page body is used as the grid cover image.

## Data Shape

```typescript
interface Project {
  id: string;
  slug: string;
  title: string;
  year?: number;
  category: string;
  description: string;
  coverImage?: string;
  images: string[];
}
```

## Code Changes

### New file: `src/lib/notion.ts`
- Initializes `@notionhq/client` with `NOTION_TOKEN` env var
- `getProjects(category: string): Promise<Project[]>` — queries DB filtered by category and `Published = true`, sorted by Order
- `getProject(slug: string): Promise<Project | null>` — queries DB for matching slug, fetches page blocks for description + images

### Modified: `src/app/projects/page.tsx`, `src/app/fun/page.tsx`, `src/app/photography/page.tsx`
- Replace `import { projects } from "@/lib/data"` with `getProjects(category)` call
- Add `export const revalidate = 3600`

### Modified: detail page (`src/app/[category]/[slug]/page.tsx` or equivalent)
- Replace data.ts lookup with `getProject(slug)`
- Add `export const revalidate = 3600`

### Modified: `next.config.ts`
- Add Notion image domains to `images.remotePatterns`:
  - `www.notion.so`
  - `prod-files-secure.s3.us-west-2.amazonaws.com`
  - `s3.us-west-2.amazonaws.com`

### Removed: `src/lib/data.ts`
- Deleted once Notion integration is verified working.

## Environment Variables

| Variable             | Where to set          |
|----------------------|-----------------------|
| `NOTION_TOKEN`       | Vercel project env    |
| `NOTION_DATABASE_ID` | Vercel project env    |

Both also added to `.env.local` for local development.

## Image Handling

Notion stores uploaded images as signed S3 URLs that expire after ~1 hour. To handle this:

- Pages use `export const revalidate = 3600` (ISR) — Vercel regenerates pages hourly, refreshing image URLs before expiry.
- When the user edits content in Notion, the Vercel deploy webhook triggers a fresh build, immediately refreshing all URLs.

No image downloading or re-hosting required.

## Deployment / Auto-Update Flow

1. User edits a project page in Notion
2. Notion automation fires a webhook to a Vercel deploy hook URL
3. Vercel rebuilds and deploys (~30s)
4. zachbackas.com reflects the update

Setup: one-time configuration of Notion automation + Vercel deploy hook (documented in implementation plan).

## Out of Scope

- Redesigning any part of the site
- Changing the URL structure
- Adding new sections or pages
- Any CMS UI beyond Notion itself
