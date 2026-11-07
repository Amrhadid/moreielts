import { Icon } from "~/components/ui/Icon";
import { cn } from "~/lib/cn";
import { sectionMeta } from "~/lib/sections";
import type { SectionCode } from "~/types/content";

/** Tinted tile with the section's icon. */
export function SectionIcon({
  code,
  size = "md",
  className,
}: {
  code: SectionCode | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const meta = sectionMeta(code);
  const box =
    size === "sm"
      ? "h-7 w-7 rounded-lg"
      : size === "lg"
        ? "h-12 w-12 rounded-xl"
        : "h-9 w-9 rounded-[0.625rem]";
  const glyph = size === "sm" ? 15 : size === "lg" ? 22 : 17;
  return (
    <span aria-hidden className={cn("grid shrink-0 place-items-center", box, meta.tile, className)}>
      <Icon name={meta.icon} size={glyph} />
    </span>
  );
}
