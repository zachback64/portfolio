import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Zach Backas",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <h1 className="text-2xl font-medium mb-8">Zach Backas</h1>
      <div className="space-y-5 text-[15px] leading-7 text-gray-700">
        <p>
          Marine Engineer and Entrepreneur in Alameda, California. I specialize
          in engineering, design, prototyping, production, and sales of physical
          hardware and digital design tools.
        </p>
        <p>
          I work with early-stage startups including Principle Power and
          Fliteboard on marine product engineering. I&apos;ve founded or led
          teams at Darkmatter Hydrofoils, WingHopper.com, and Holdfast Robotics,
          connecting innovative marine technologies with relevant markets.
        </p>
      </div>
      <div className="mt-12 flex gap-6 text-sm">
        <a
          href="mailto:zbackas@gmail.com"
          className="underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          zbackas@gmail.com
        </a>
        <a
          href="https://www.linkedin.com/in/zach-backas-136719b6/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
