const token = process.env.NOTION_TOKEN!;
const databaseId = process.env.NOTION_DATABASE_ID!;
const API = "https://api.notion.com/v1";

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

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

type RichText = { plain_text: string }[];
type NotionPage = {
  object: string;
  id: string;
  cover: { type: string; external?: { url: string }; file?: { url: string } } | null;
  properties: {
    Title: { type: "title"; title: RichText };
    Slug: { type: "rich_text"; rich_text: RichText };
    Category: { type: "select"; select: { name: string } | null };
    Year: { type: "number"; number: number | null };
  };
};

type NotionBlock = {
  type: string;
  paragraph?: { rich_text: RichText };
  image?: {
    type: string;
    external?: { url: string };
    file?: { url: string };
  };
};

async function queryDatabase(filter: unknown, sorts?: unknown): Promise<NotionPage[]> {
  const res = await fetch(`${API}/databases/${databaseId}/query`, {
    method: "POST",
    headers,
    body: JSON.stringify({ filter, sorts }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion query failed ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.results.filter((p: NotionPage) => p.object === "page");
}

async function getBlocks(blockId: string): Promise<NotionBlock[]> {
  const res = await fetch(`${API}/blocks/${blockId}/children`, { headers });
  if (!res.ok) throw new Error(`Notion blocks failed ${res.status}`);
  const data = await res.json();
  return data.results;
}

function pageToProject(page: NotionPage): Project {
  const props = page.properties;
  const title = props.Title.title.map((t) => t.plain_text).join("");
  const slug = props.Slug.rich_text.map((t) => t.plain_text).join("");
  const category = props.Category.select?.name ?? "";
  const year = props.Year.number ?? undefined;
  const coverImage = page.cover
    ? page.cover.type === "external"
      ? page.cover.external?.url
      : page.cover.file?.url
    : undefined;
  return { id: page.id, slug, title, year, category, description: "", images: [], coverImage };
}

export async function getProjects(category: string): Promise<Project[]> {
  const pages = await queryDatabase(
    {
      and: [
        { property: "Category", select: { equals: category } },
        { property: "Published", checkbox: { equals: true } },
      ],
    },
    [{ property: "Order", direction: "ascending" }]
  );
  return pages.map(pageToProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  const pages = await queryDatabase({
    and: [
      { property: "Slug", rich_text: { equals: slug } },
      { property: "Published", checkbox: { equals: true } },
    ],
  });
  if (pages.length === 0) return null;
  const page = pages[0];
  const blocks = await getBlocks(page.id);

  let description = "";
  const images: string[] = [];

  for (const block of blocks) {
    if (block.type === "paragraph" && block.paragraph) {
      const text = block.paragraph.rich_text.map((t) => t.plain_text).join("");
      if (text && !description) description = text;
    } else if (block.type === "image" && block.image) {
      const url =
        block.image.type === "external"
          ? block.image.external?.url
          : block.image.file?.url;
      if (url) images.push(url);
    }
  }

  const base = pageToProject(page);
  return { ...base, description, images, coverImage: base.coverImage ?? images[0] };
}
