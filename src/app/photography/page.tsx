import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import { photography } from "@/lib/data";

export const metadata: Metadata = {
  title: "Photography — Zach Backas",
};

export default function PhotographyPage() {
  return (
    <div>
      <ProjectGrid items={photography} />
    </div>
  );
}
