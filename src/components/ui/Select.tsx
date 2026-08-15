import * as S from "@radix-ui/react-select";
import { cn } from "~/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  className,
  "aria-label": ariaLabel,
}: {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <S.Root value={value} onValueChange={onValueChange}>
      <S.Trigger
        aria-label={ariaLabel}
        className={cn(
          "inline-flex h-10 w-full items-center justify-between gap-2 rounded-lg",
          "border border-line-strong bg-surface px-3 text-left text-sm",
          "data-[placeholder]:text-muted/70",
          className,
        )}
      >
        <S.Value placeholder={placeholder} />
        <S.Icon aria-hidden className="text-muted">
          ▾
        </S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Content
          position="popper"
          sideOffset={4}
          className="z-50 max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-line bg-surface shadow-lg"
        >
          <S.Viewport className="p-1">
            {options.map((o) => (
              <S.Item
                key={o.value}
                value={o.value}
                className="cursor-pointer select-none rounded-md px-2.5 py-2 text-sm data-[highlighted]:bg-brand-50 data-[highlighted]:outline-none"
              >
                <S.ItemText>{o.label}</S.ItemText>
              </S.Item>
            ))}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  );
}
