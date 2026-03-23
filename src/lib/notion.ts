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
  const response = await notion.dataSources.query({
    data_source_id: databaseId,
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
  const response = await notion.dataSources.query({
    data_source_id: databaseId,
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
