import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import { funProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Fun — Zach Backas",
};

export default function FunPage() {
  return (
    <div>
      <ProjectGrid items={funProjects} />
    </div>
  );
}
