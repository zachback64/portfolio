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
