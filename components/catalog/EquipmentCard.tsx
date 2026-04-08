import type { EquipmentOption } from "@/lib/data/seed";
import {
  getBestForTags,
  getCategoryLabel,
  getEquipmentPersonality,
  getTraitLabel,
} from "@/lib/helpers/equipmentMeta";
import { Button } from "@/components/ui/Button";

const CATEGORY_BADGE: Record<string, string> = {
  ball: "border-gsgl-gold/40 bg-gsgl-gold/10 text-gsgl-navy",
  driver: "border-gsgl-navy/20 bg-gsgl-navy/10 text-gsgl-navy",
  irons: "border-gsgl-slate/20 bg-gsgl-slate/10 text-gsgl-slate",
  shaft: "border-gsgl-gray/25 bg-gsgl-gray/10 text-gsgl-dark",
};

const CATEGORY_DOT: Record<string, string> = {
  ball: "bg-gsgl-gold",
  driver: "bg-gsgl-navy",
  irons: "bg-gsgl-slate",
  shaft: "bg-gsgl-gray",
};

interface EquipmentCardProps {
  option: EquipmentOption;
}

export function EquipmentCard({ option }: EquipmentCardProps) {
  const description = getEquipmentPersonality(option);
  const bestFor = getBestForTags(option);
  const categoryLabel = getCategoryLabel(option.category);
  const badgeClass = CATEGORY_BADGE[option.category] ?? CATEGORY_BADGE.ball;
  const dotClass = CATEGORY_DOT[option.category] ?? CATEGORY_DOT.ball;

  return (
    <article className="flex flex-col rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5">
      {/* Category badge + name */}
      <div>
        <span
          className={`inline-block rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] ${badgeClass}`}
        >
          {categoryLabel}
        </span>
        <h3 className="mt-3 text-xl font-semibold text-gsgl-navy">{option.name}</h3>
      </div>

      {/* Plain-English description */}
      <p className="mt-3 flex-1 text-sm leading-6 text-gsgl-gray">{description}</p>

      {/* Trait pills */}
      {option.traits.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {option.traits.map((trait) => (
            <span
              key={trait}
              className="rounded-full bg-gsgl-offwhite px-2.5 py-1 text-xs font-medium text-gsgl-slate"
            >
              {getTraitLabel(trait)}
            </span>
          ))}
        </div>
      )}

      {/* Best for */}
      <div className="mt-5 rounded-lg bg-gsgl-offwhite p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gsgl-slate">
          Best for
        </p>
        <ul className="mt-2 space-y-1.5">
          {bestFor.map((tag) => (
            <li key={tag} className="flex items-start gap-2 text-sm text-gsgl-gray">
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-5">
        <Button href="/fit/new" variant="secondary" className="w-full">
          See how this fits your game
        </Button>
      </div>
    </article>
  );
}
