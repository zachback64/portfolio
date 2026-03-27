import Link from "next/link";
import Image from "next/image";

interface Project {
  slug: string;
  title: string;
  year?: number;
  category: string;
  coverImage?: string;
}

interface CardProps {
  item: Project;
  priority?: boolean;
  aspectClass?: string;
}

function ProjectCard({ item, priority, aspectClass = "aspect-[4/3]" }: CardProps) {
  return (
    <Link
      href={`/${item.category}/${item.slug}`}
      className="block bg-white group"
    >
      <div className={`${aspectClass} relative overflow-hidden`}>
        {item.coverImage ? (
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-50" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <div className="pt-2 pb-3">
        <p className="text-[13px] text-[var(--foreground)] leading-snug">
          {item.title}
        </p>
        {item.year && (
          <p className="text-[11px] text-[var(--text-tertiary)] tabular-nums mt-0.5">
            {item.year}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function ProjectGrid({ items }: { items: Project[] }) {
  if (items.length === 0) return null;

  const [hero, ...rest] = items;

  return (
    <div className="flex flex-col gap-px bg-[var(--separator)]">
      {/* Hero: full width, wider aspect ratio */}
      <div className="bg-white">
        <ProjectCard item={hero} priority aspectClass="aspect-[16/9]" />
      </div>

      {/* Remaining items: responsive grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[var(--separator)]">
          {rest.map((item, index) => (
            <ProjectCard key={item.slug} item={item} priority={index < 5} />
          ))}
        </div>
      )}
    </div>
  );
}
