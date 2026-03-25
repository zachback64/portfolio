import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Photography — Zach Backas",
};

const photos = [
  "000008860001.jpg",
  "000008900018.jpg",
  "000008900022.jpg",
  "000008920007.jpg",
  "000008930021.jpg",
  "000008930035.jpg",
  "000205100006.jpg",
  "000205100015.jpg",
  "000205120002.jpg",
  "000205120009.jpg",
  "000205120029.jpg",
  "000205120030.jpg",
  "000205120037.jpg",
];

export default function PhotographyPage() {
  return (
    <div className="columns-2 md:columns-3 gap-px">
      {photos.map((filename) => (
        <div key={filename} className="break-inside-avoid">
          <Image
            src={`/images/film/${filename}`}
            alt=""
            width={800}
            height={600}
            className="w-full block"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}
