import { CheckIcon } from "@/components/icons";

type CheckListProps = {
  /** Short H4 labels, e.g. ["Oversikt", "Varsling", "Sporbarhet"]. */
  items: string[];
  className?: string;
};

/**
 * Plain checkmark + bold label list used by /anlegg's "Digital overvåking"
 * key points and /industri's "Tilpassede serviceavtaler" key points
 * (docs/reference/anlegg.desktop.jpg, industri.desktop.jpg) — both routes
 * render the same three-short-labels-with-a-checkmark shape, so it's shared
 * rather than duplicated per page.
 */
export function CheckList({ items, className }: CheckListProps) {
  return (
    <ul className={`space-y-3${className ? ` ${className}` : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <CheckIcon className="h-4 w-4 shrink-0 text-neutral-900" />
          <h4 className="font-ui text-base font-semibold text-neutral-900">{item}</h4>
        </li>
      ))}
    </ul>
  );
}
