import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/notion";
import ProjectDetail from "@/components/ProjectDetail";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects("fun");
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Zach Backas` };
}

export default async function FunProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return <ProjectDetail item={project} backHref="/fun" />;
}
