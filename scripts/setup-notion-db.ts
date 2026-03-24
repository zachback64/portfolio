// Throwaway script: creates Portfolio Projects database in Notion and populates all projects
// Run with: bun run scripts/setup-notion-db.ts
export {};

const TOKEN = process.env.NOTION_TOKEN!;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

async function notion(method: string, path: string, body?: unknown) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    console.error("Notion API error:", JSON.stringify(json, null, 2));
    throw new Error(`Notion API ${res.status}: ${json.message}`);
  }
  return json;
}

// Step 1: Find a parent page to put the database in
async function findParentPage() {
  const result = await notion("POST", "/search", {
    filter: { value: "page", property: "object" },
    page_size: 10,
  });
  if (result.results.length === 0) throw new Error("No pages found in workspace");
  // Prefer a top-level page
  const page = result.results[0];
  console.log(`Using parent page: "${page.properties?.title?.title?.[0]?.plain_text ?? page.id}"`);
  return page.id;
}

// Step 2: Create the database
async function createDatabase(parentPageId: string) {
  const db = await notion("POST", "/databases", {
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ type: "text", text: { content: "Portfolio Projects" } }],
    properties: {
      Title: { title: {} },
      Slug: { rich_text: {} },
      Category: {
        select: {
          options: [
            { name: "projects", color: "blue" },
            { name: "fun", color: "green" },
            { name: "photography", color: "purple" },
          ],
        },
      },
      Year: { number: { format: "number" } },
      Order: { number: { format: "number" } },
      Published: { checkbox: {} },
    },
  });
  console.log(`Created database: ${db.id}`);
  return db.id;
}

// Step 3: Add a project row
async function addProject(dbId: string, project: {
  title: string;
  slug: string;
  category: string;
  year?: number;
  order: number;
}) {
  const properties: Record<string, unknown> = {
    Title: { title: [{ text: { content: project.title } }] },
    Slug: { rich_text: [{ text: { content: project.slug } }] },
    Category: { select: { name: project.category } },
    Order: { number: project.order },
    Published: { checkbox: true },
  };
  if (project.year) {
    properties.Year = { number: project.year };
  }
  await notion("POST", "/pages", {
    parent: { database_id: dbId },
    properties,
  });
  console.log(`  Added: ${project.title}`);
}

const PROJECTS = [
  // Projects
  { title: "Sewing", slug: "sewing", category: "projects", year: 2024, order: 1 },
  { title: "Subwoofer", slug: "subwoofer", category: "projects", year: 2024, order: 2 },
  { title: "WingHopper", slug: "winghopper", category: "projects", year: 2022, order: 3 },
  { title: "Fliteboard", slug: "fliteboard", category: "projects", year: 2017, order: 4 },
  { title: "Darkmatter Hydrofoils", slug: "darkmatter-hydrofoils", category: "projects", year: 2018, order: 5 },
  { title: "Sensorboard", slug: "sensorboard", category: "projects", year: 2016, order: 6 },
  // Fun
  { title: "Kiteracing", slug: "kiteracing", category: "fun", year: 2024, order: 1 },
  { title: "Totem", slug: "totem", category: "fun", year: 2024, order: 2 },
  { title: "Lightened Table", slug: "lightened-table", category: "fun", year: 2021, order: 3 },
  { title: "Wooden Sailboat", slug: "wooden-sailboat", category: "fun", year: 2012, order: 4 },
  // Photography
  { title: "FC5K", slug: "fc5k", category: "photography", order: 1 },
  { title: "Foil Fiesta", slug: "foil-fiesta", category: "photography", order: 2 },
  { title: "Belmont Kite Classic", slug: "belmont-kite-classic", category: "photography", order: 3 },
];

// Main
const parentId = await findParentPage();
const dbId = await createDatabase(parentId);

console.log("\nPopulating projects...");
for (const project of PROJECTS) {
  await addProject(dbId, project);
}

console.log(`\nDone! Database ID: ${dbId}`);
console.log(`\nAdd to .env.local:\nNOTION_DATABASE_ID=${dbId}`);
