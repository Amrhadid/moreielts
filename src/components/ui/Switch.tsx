import * as S from "@radix-ui/react-switch";
import { cn } from "~/lib/cn";

export function Switch({
  checked,
  onCheckedChange,
  id,
  className,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
}) {
  return (
    <S.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "h-6 w-11 rounded-full border border-line-strong bg-line transition-colors",
        "data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600",
        className,
      )}
    >
      <S.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[1.375rem]" />
    </S.Root>
  );
}
