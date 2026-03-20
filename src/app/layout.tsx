import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Zach Backas",
  description:
    "Marine Engineer and Entrepreneur in Alameda, California — engineering, design, prototyping, production, and sales of physical hardware and digital design tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col text-[#111] bg-white font-sans antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="py-8 px-8 text-xs text-gray-400 flex justify-between items-center">
          <span>© 2024 Zach Backas</span>
          <a href="#top" className="hover:text-gray-600 transition-colors">
            Back to top ↑
          </a>
        </footer>
      </body>
    </html>
  );
}
