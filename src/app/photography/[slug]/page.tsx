import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { photography } from "@/lib/data";
import ProjectDetail from "@/components/ProjectDetail";

export async function generateStaticParams() {
  return photography.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = photography.find((p) => p.slug === slug);
  if (!item) return {};
  return { title: `${item.title} — Zach Backas` };
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = photography.find((p) => p.slug === slug);
  if (!item) notFound();

  return <ProjectDetail item={item} backHref="/photography" />;
}
