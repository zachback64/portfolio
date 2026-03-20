import Link from "next/link";
import Image from "next/image";

interface Project {
  slug: string;
  title: string;
  year?: number;
  category: string;
  coverImage?: string;
}

export default function ProjectGrid({ items }: { items: Project[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-100">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/${item.category}/${item.slug}`}
          className="group relative bg-white aspect-[4/3] overflow-hidden block"
        >
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-50" />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 p-4">
            <p className="text-sm font-medium text-white drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.title}
            </p>
            {item.year && (
              <p className="text-xs text-white/80 drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.year}
              </p>
            )}
          </div>
          {/* Always-visible label below image on mobile */}
          <div className="absolute bottom-3 left-3 md:hidden">
            <p className="text-xs font-medium text-gray-800">
              {item.title}
              {item.year ? ` — ${item.year}` : ""}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
