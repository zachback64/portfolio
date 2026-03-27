import Link from "next/link";
import Image from "next/image";

interface Item {
  slug: string;
  title: string;
  year?: number;
  description: string;
  images: string[];
}

export default function ProjectDetail({
  item,
  backHref,
}: {
  item: Item;
  backHref: string;
}) {
  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <Link
        href={backHref}
        className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors mb-8 inline-block"
      >
        ← Back
      </Link>

      <div className="flex items-baseline gap-4 mb-6">
        <h1 className="font-display text-[2rem] font-light tracking-tight leading-tight">{item.title}</h1>
        {item.year && <span className="text-[13px] text-[var(--text-tertiary)] tabular-nums">{item.year}</span>}
      </div>

      {item.description && (
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-10 max-w-[60ch]">
          {item.description}
        </p>
      )}

      {item.images.length > 0 ? (
        <div className="space-y-4">
          {item.images.map((src, i) => (
            <div key={i} className="relative w-full aspect-[16/9] bg-gray-50">
              <Image
                src={src}
                alt={`${item.title} ${i + 1}`}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full aspect-[16/9] bg-[var(--separator)] flex items-center justify-center text-[var(--text-tertiary)] text-sm">
          Images coming soon
        </div>
      )}
    </div>
  );
}
