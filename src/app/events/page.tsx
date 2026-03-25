import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import { getProjects } from "@/lib/notion";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events — Zach Backas",
};

export default async function EventsPage() {
  const items = await getProjects("events");
  return (
    <div>
      <ProjectGrid items={items} />
    </div>
  );
}
