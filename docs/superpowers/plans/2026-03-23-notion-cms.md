# Notion CMS Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded `src/lib/data.ts` with Notion as the content source, so all project content can be updated in Notion without touching code.

**Architecture:** A Notion database holds all projects (one row per project, page body = description + images). `src/lib/notion.ts` queries this database at build time. Next.js pages use ISR (`revalidate = 3600`) so Notion's signed image URLs refresh before expiry. Vercel Hobby hosts the site for free.

**Tech Stack:** Next.js 16 (App Router), `@notionhq/client`, Vercel Hobby, Notion free plan

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/notion.ts` | **Create** | Notion client, `getProjects()`, `getProject()`, `Project` type |
| `src/lib/data.ts` | **Delete** (Task 9) | Replaced by notion.ts |
| `next.config.ts` | **Modify** | Add Notion/S3 image remote patterns |
| `src/app/projects/page.tsx` | **Modify** | Async, fetch from Notion |
| `src/app/fun/page.tsx` | **Modify** | Async, fetch from Notion |
| `src/app/photography/page.tsx` | **Modify** | Async, fetch from Notion |
| `src/app/projects/[slug]/page.tsx` | **Modify** | Async, fetch from Notion |
| `src/app/fun/[slug]/page.tsx` | **Modify** | Async, fetch from Notion |
| `src/app/photography/[slug]/page.tsx` | **Modify** | Async, fetch from Notion |
| `.env.local` | **Create** | Local dev env vars |

Components (`ProjectGrid.tsx`, `ProjectDetail.tsx`, `Nav.tsx`) are **not touched**.

---

## Task 1: Install @notionhq/client and create .env.local

**Files:**
- Modify: `package.json` (via npm install)
- Create: `.env.local`

- [ ] **Step 1: Install the Notion SDK**

```bash
cd C:/Users/Zach/Dev/portfolio
npm install @notionhq/client
```

Expected: `added 1 package` (or similar), no errors.

- [ ] **Step 2: Create .env.local with placeholder values**

Create `C:/Users/Zach/Dev/portfolio/.env.local`:

```
NOTION_TOKEN=secret_placeholder
NOTION_DATABASE_ID=placeholder
```

(Real values will be filled in during Tasks 2–3.)

- [ ] **Step 3: Verify build still passes**

```bash
npm run build
```

Expected: build succeeds. (Still using data.ts at this point — no changes to pages yet.)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install @notionhq/client"
```

---

## Task 2: Set up Notion database (manual)

This task is done by the user in Notion. No code changes.

- [ ] **Step 1: Create a new Notion database**

In Notion, create a new full-page database called **"Portfolio Projects"**.

- [ ] **Step 2: Add these properties (delete any defaults Notion adds)**

| Property name | Type   | Notes |
|---------------|--------|-------|
| Title         | Title  | Already exists by default |
| Slug          | Text   | URL identifier, e.g. `winghopper` |
| Category      | Select | Options: `projects`, `fun`, `photography` |
| Year          | Number | Leave blank for photography |
| Order         | Number | Controls sort order within each category (1, 2, 3…) |
| Published     | Checkbox | Check to show on site; uncheck to hide |

- [ ] **Step 3: Add all existing projects as rows**

Copy this data exactly (slugs must match the current URL structure).

> **Slug uniqueness:** Slugs must be unique across all categories. Notion does not enforce this — if two rows share a slug, `getProject()` silently returns the first match. Double-check for duplicates whenever adding new projects.

**Projects (category: projects)**
| Title | Slug | Category | Year | Order | Published |
|-------|------|----------|------|-------|-----------|
| Sewing | sewing | projects | 2024 | 1 | ✓ |
| Subwoofer | subwoofer | projects | 2024 | 2 | ✓ |
| WingHopper | winghopper | projects | 2022 | 3 | ✓ |
| Fliteboard | fliteboard | projects | 2017 | 4 | ✓ |
| Darkmatter Hydrofoils | darkmatter-hydrofoils | projects | 2018 | 5 | ✓ |
| Sensorboard | sensorboard | projects | 2016 | 6 | ✓ |

**Fun (category: fun)**
| Title | Slug | Category | Year | Order | Published |
|-------|------|----------|------|-------|-----------|
| Kiteracing | kiteracing | fun | 2024 | 1 | ✓ |
| Totem | totem | fun | 2024 | 2 | ✓ |
| Lightened Table | lightened-table | fun | 2021 | 3 | ✓ |
| Wooden Sailboat | wooden-sailboat | fun | 2012 | 4 | ✓ |

**Photography (category: photography)**
| Title | Slug | Category | Year | Order | Published |
|-------|------|----------|------|-------|-----------|
| FC5K | fc5k | photography | | 1 | ✓ |
| Foil Fiesta | foil-fiesta | photography | | 2 | ✓ |
| Belmont Kite Classic | belmont-kite-classic | photography | | 3 | ✓ |

- [ ] **Step 4: Open each project page and add content**

For each project:
1. Click "Add cover" at the top of the page — upload or paste a cover photo. This becomes the grid thumbnail.
2. Write the project description as a paragraph at the top of the page body.
3. Add project images below the description by dragging in photos or using `/image`.

The first image in the body is also used as a fallback cover if no page cover is set.

- [ ] **Step 5: Note the database ID**

Open the database as a full page. The URL will look like:
`https://www.notion.so/your-workspace/abc123def456...?v=...`

The database ID is the string of characters between the last `/` and the `?v=`. Copy it — you'll need it in Task 3.

---

## Task 3: Create Notion API integration and get token

- [ ] **Step 1: Create a Notion integration**

Go to https://www.notion.so/my-integrations → "New integration" → name it "Portfolio Site" → select your workspace → Submit.

Copy the **Internal Integration Token** (starts with `secret_`).

- [ ] **Step 2: Connect the integration to the database**

Open your Portfolio Projects database in Notion → click the `...` menu (top right) → "Connections" → search "Portfolio Site" → click to connect.

- [ ] **Step 3: Update .env.local with real values**

Edit `C:/Users/Zach/Dev/portfolio/.env.local`:

```
NOTION_TOKEN=secret_your_actual_token_here
NOTION_DATABASE_ID=your_actual_database_id_here
```

---

## Task 4: Write src/lib/notion.ts

**Files:**
- Create: `src/lib/notion.ts`

- [ ] **Step 1: Create the file**

Create `C:/Users/Zach/Dev/portfolio/src/lib/notion.ts` with this exact content:

```typescript
import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID!;

export interface Project {
  id: string;
  slug: string;
  title: string;
  year?: number;
  category: string;
  description: string;
  coverImage?: string;
  images: string[];
}

export async function getProjects(category: string): Promise<Project[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: "Category", select: { equals: category } },
        { property: "Published", checkbox: { equals: true } },
      ],
    },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return response.results
    .filter((page): page is PageObjectResponse => page.object === "page")
    .map(pageToProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: "Slug", rich_text: { equals: slug } },
        { property: "Published", checkbox: { equals: true } },
      ],
    },
  });

  const page = response.results.find(
    (p): p is PageObjectResponse => p.object === "page"
  );
  if (!page) return null;

  const blocks = await notion.blocks.children.list({ block_id: page.id });

  let description = "";
  const images: string[] = [];

  for (const block of blocks.results) {
    if (!("type" in block)) continue;
    if (block.type === "paragraph") {
      const text = block.paragraph.rich_text
        .map((t) => t.plain_text)
        .join("");
      if (text && !description) description = text;
    } else if (block.type === "image") {
      const url =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      images.push(url);
    }
  }

  const base = pageToProject(page);
  return {
    ...base,
    description,
    images,
    coverImage: base.coverImage ?? images[0],
  };
}

function pageToProject(page: PageObjectResponse): Project {
  const props = page.properties;

  const title =
    props.Title?.type === "title"
      ? props.Title.title.map((t) => t.plain_text).join("")
      : "";

  const slug =
    props.Slug?.type === "rich_text"
      ? props.Slug.rich_text.map((t) => t.plain_text).join("")
      : "";

  const category =
    props.Category?.type === "select"
      ? (props.Category.select?.name ?? "")
      : "";

  const year =
    props.Year?.type === "number"
      ? (props.Year.number ?? undefined)
      : undefined;

  const coverImage = page.cover
    ? page.cover.type === "external"
      ? page.cover.external.url
      : page.cover.file.url
    : undefined;

  return {
    id: page.id,
    slug,
    title,
    year,
    category,
    description: "",
    images: [],
    coverImage,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. (If you see "cannot find module @notionhq/client/build/src/api-endpoints", run `npm install` first.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/notion.ts
git commit -m "feat: add Notion API client with getProjects and getProject"
```

---

## Task 5: Update next.config.ts for Notion images

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Replace next.config.ts content**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "notion.so" },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: allow Notion and S3 image domains"
```

---

## Task 6: Convert category listing pages to use Notion

**Files:**
- Modify: `src/app/projects/page.tsx`
- Modify: `src/app/fun/page.tsx`
- Modify: `src/app/photography/page.tsx`

- [ ] **Step 1: Replace src/app/projects/page.tsx**

```typescript
import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import { getProjects } from "@/lib/notion";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects — Zach Backas",
};

export default async function ProjectsPage() {
  const items = await getProjects("projects");
  return (
    <div>
      <ProjectGrid items={items} />
    </div>
  );
}
```

- [ ] **Step 2: Replace src/app/fun/page.tsx**

```typescript
import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import { getProjects } from "@/lib/notion";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fun — Zach Backas",
};

export default async function FunPage() {
  const items = await getProjects("fun");
  return (
    <div>
      <ProjectGrid items={items} />
    </div>
  );
}
```

- [ ] **Step 3: Replace src/app/photography/page.tsx**

```typescript
import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import { getProjects } from "@/lib/notion";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Photography — Zach Backas",
};

export default async function PhotographyPage() {
  const items = await getProjects("photography");
  return (
    <div>
      <ProjectGrid items={items} />
    </div>
  );
}
```

- [ ] **Step 4: Run dev server and verify all three pages load**

```bash
npm run dev
```

Open http://localhost:3000/projects, http://localhost:3000/fun, http://localhost:3000/photography.

Expected: pages load, projects appear in grid. If `.env.local` has real values, cover images show. If still using placeholder values, grid shows gray placeholders (that's fine for now).

- [ ] **Step 5: Commit**

```bash
git add src/app/projects/page.tsx src/app/fun/page.tsx src/app/photography/page.tsx
git commit -m "feat: convert category pages to fetch from Notion"
```

---

## Task 7: Convert detail pages to use Notion

**Files:**
- Modify: `src/app/projects/[slug]/page.tsx`
- Modify: `src/app/fun/[slug]/page.tsx`
- Modify: `src/app/photography/[slug]/page.tsx`

- [ ] **Step 1: Replace src/app/projects/[slug]/page.tsx**

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/notion";
import ProjectDetail from "@/components/ProjectDetail";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects("projects");
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Zach Backas` };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return <ProjectDetail item={project} backHref="/projects" />;
}
```

- [ ] **Step 2: Replace src/app/fun/[slug]/page.tsx**

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/notion";
import ProjectDetail from "@/components/ProjectDetail";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects("fun");
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Zach Backas` };
}

export default async function FunProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return <ProjectDetail item={project} backHref="/fun" />;
}
```

- [ ] **Step 3: Replace src/app/photography/[slug]/page.tsx**

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/notion";
import ProjectDetail from "@/components/ProjectDetail";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects("photography");
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Zach Backas` };
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return <ProjectDetail item={project} backHref="/photography" />;
}
```

- [ ] **Step 4: Verify a detail page loads**

With `npm run dev` running, open http://localhost:3000/projects/winghopper.

Expected: page loads with title "WingHopper", description and images from Notion (or empty placeholders if Notion has no content yet).

- [ ] **Step 5: Commit**

```bash
git add src/app/projects/[slug]/page.tsx src/app/fun/[slug]/page.tsx src/app/photography/[slug]/page.tsx
git commit -m "feat: convert detail pages to fetch from Notion"
```

---

## Task 8: Full build verification

- [ ] **Step 1: Run a full production build**

```bash
npm run build
```

Expected: build completes successfully. You'll see each route listed. No TypeScript or build errors.

If build fails because `NOTION_TOKEN` / `NOTION_DATABASE_ID` are still placeholders, complete Tasks 2–3 first, update `.env.local` with real values, then re-run.

- [ ] **Step 2: Start production server and do a smoke test**

```bash
npm run start
```

Open http://localhost:3000. Click through: Projects → a project detail, Fun → a project detail, Photography → a photo detail. All pages should load correctly.

---

## Task 9: Delete data.ts

**Files:**
- Delete: `src/lib/data.ts`

Only do this after Task 8 passes.

- [ ] **Step 1: Delete the file**

```bash
rm src/lib/data.ts
```

- [ ] **Step 2: Verify build still passes**

```bash
npm run build
```

Expected: build succeeds with no references to `data.ts`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: remove data.ts — content now served from Notion"
```

---

## Task 10: Add env vars to Vercel and deploy

- [ ] **Step 1: Add env vars in Vercel dashboard**

Go to https://vercel.com → your portfolio project → Settings → Environment Variables.

Add:
- `NOTION_TOKEN` = your `secret_...` token
- `NOTION_DATABASE_ID` = your database ID

Set both for **Production**, **Preview**, and **Development** environments.

- [ ] **Step 2: Push to GitHub to trigger deploy**

```bash
git push origin master
```

- [ ] **Step 3: Monitor the Vercel build**

In the Vercel dashboard, watch the deployment build log. Expected: build completes, all routes generated successfully.

- [ ] **Step 4: Verify live site**

Open https://zachbackas.com (or the vercel.app URL). Click through all sections. Cover images and project detail pages should all work.

---

## Task 11: Set up auto-deploy webhook (optional but recommended)

This makes it so edits to Notion **property fields** (Title, Year, Order, Published) automatically trigger a redeploy.

> **Note:** This only fires on property changes, not page body edits. For description/image-only changes, wait up to 1hr for ISR or manually trigger a redeploy.

- [ ] **Step 1: Create a Vercel deploy hook**

Go to Vercel → your project → Settings → Git → Deploy Hooks.

Create a hook named "Notion Content Update" for the `master` branch. Copy the generated URL.

- [ ] **Step 2: Create a Notion automation**

Open your Portfolio Projects database in Notion → click "Automate" (lightning bolt icon) → "New automation".

Set trigger: **"When property is edited"** → select any property (e.g. Published).

Set action: **"Send webhook"** → paste the Vercel deploy hook URL.

Repeat for the other properties you'd want to trigger a deploy (Title, Order, etc.) — or use one automation with multiple triggers.

- [ ] **Step 3: Test it**

In Notion, toggle "Published" off and back on for any project. Watch Vercel dashboard — a new deployment should start within a few seconds.
