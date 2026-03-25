import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { getAllProjects } from "@/lib/notion";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Zach Backas",
  description:
    "Marine Engineer and Entrepreneur in Alameda, California — engineering, design, prototyping, production, and sales of physical hardware and digital design tools.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allProjects = await getAllProjects();

  // Group sub-items by category
  const childrenByCategory: Record<string, { label: string; href: string }[]> = {};
  for (const project of allProjects) {
    const cat = project.category;
    if (!childrenByCategory[cat]) childrenByCategory[cat] = [];
    childrenByCategory[cat].push({
      label: project.title,
      href: `/${cat}/${project.slug}`,
    });
  }

  const sections = [
    { label: "About", href: "/about", children: [] },
    { label: "Projects", href: "/projects", children: childrenByCategory["projects"] ?? [] },
    { label: "Fun", href: "/fun", children: childrenByCategory["fun"] ?? [] },
    { label: "Photography", href: "/photography", children: [] },
    { label: "Events", href: "/events", children: childrenByCategory["events"] ?? [] },
    { label: "Contact", href: "/contact", children: [] },
  ];

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full text-[#111] bg-white font-sans antialiased">
        <div className="flex min-h-screen">
          <Sidebar sections={sections} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
