import type { EquipmentOption } from "@/lib/data/seed";
import {
  getBestForTags,
  getCategoryLabel,
  getEquipmentPersonality,
  getTraitLabel,
} from "@/lib/helpers/equipmentMeta";
import { Button } from "@/components/ui/Button";

const CATEGORY_BADGE: Record<string, string> = {
  ball:   "border-amber-500/30 bg-amber-500/10 text-amber-400",
  driver: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  irons:  "border-purple-500/30 bg-purple-500/10 text-purple-400",
  shaft:  "border-gb-line bg-gb-panel text-gb-muted",
};

const CATEGORY_DOT: Record<string, string> = {
  ball:   "bg-amber-400",
  driver: "bg-blue-400",
  irons:  "bg-purple-400",
  shaft:  "bg-gb-muted",
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
    <article className="flex flex-col rounded-xl border border-gb-line bg-gb-panel p-6 transition-transform hover:-translate-y-0.5">
      <div>
        <span
          className={`inline-block rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] ${badgeClass}`}
        >
          {categoryLabel}
        </span>
        <h3 className="mt-3 text-xl font-semibold text-gb-text">{option.name}</h3>
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-gb-muted">{description}</p>

      {option.traits.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {option.traits.map((trait) => (
            <span
              key={trait}
              className="rounded-full border border-gb-line bg-gb-bg px-2.5 py-1 text-xs font-medium text-gb-muted"
            >
              {getTraitLabel(trait)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 rounded-lg bg-gb-bg p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gb-muted">
          Best for
        </p>
        <ul className="mt-2 space-y-1.5">
          {bestFor.map((tag) => (
            <li key={tag} className="flex items-start gap-2 text-sm text-gb-muted">
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <Button href="/fit/new" variant="secondary" className="w-full">
          See how this fits your game
        </Button>
      </div>
    </article>
  );
}
