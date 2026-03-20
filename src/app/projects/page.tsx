import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects — Zach Backas",
};

export default function ProjectsPage() {
  return (
    <div>
      <ProjectGrid items={projects} />
    </div>
  );
}
