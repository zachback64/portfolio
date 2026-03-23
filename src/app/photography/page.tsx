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
