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
