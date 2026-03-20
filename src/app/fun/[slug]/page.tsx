import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { funProjects } from "@/lib/data";
import ProjectDetail from "@/components/ProjectDetail";

export async function generateStaticParams() {
  return funProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = funProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} — Zach Backas` };
}

export default async function FunProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = funProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  return <ProjectDetail item={project} backHref="/fun" />;
}
