import { useRouterState } from "@tanstack/react-router";
import { cn } from "~/lib/cn";
import { WHATSAPP_MESSAGES, whatsappLink } from "~/lib/whatsapp";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.95L2 22l4.27-1.12a9.86 9.86 0 0 0 5.76 1.84h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm0 18.06h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-2.5.65.66-2.45-.2-.31a8.17 8.17 0 1 1 14.45-5.7c0 4.52-3.69 8.13-8.13 8.13zm4.7-6.07c-.26-.13-1.53-.76-1.77-.85-.24-.09-.41-.13-.59.13-.18.26-.68.85-.83 1.02-.15.18-.31.2-.57.07-.26-.13-1.1-.41-2.1-1.3-.78-.7-1.3-1.55-1.45-1.81-.15-.26-.02-.4.12-.53.12-.12.26-.31.39-.46.13-.15.18-.26.27-.44.09-.18.04-.33-.02-.46-.07-.13-.59-1.42-.81-1.94-.21-.51-.43-.44-.59-.45h-.5c-.18 0-.46.07-.7.33-.24.26-.92.9-.92 2.2 0 1.3.94 2.55 1.07 2.72.13.18 1.85 2.83 4.49 3.97.63.27 1.12.43 1.5.55.63.2 1.2.17 1.66.1.51-.08 1.53-.62 1.74-1.22.21-.6.21-1.12.15-1.22-.06-.1-.24-.16-.5-.29z" />
    </svg>
  );
}

/**
 * Floating WhatsApp chat button, bottom corner of every page, matching
 * MoreTOEFL's. Hidden in the admin console and inside the timed test
 * players, where it would sit on top of the exam.
 */
export function WhatsAppFloatingButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin") || pathname.startsWith("/test/")) return null;

  return (
    <a
      href={whatsappLink(WHATSAPP_MESSAGES.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="animate-wa-pop group fixed bottom-5 end-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl active:scale-95 sm:bottom-6 sm:end-6 sm:h-14 sm:w-14"
    >
      <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
      <span className="pointer-events-none absolute end-full me-3 hidden whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}

/** "Get Premium on WhatsApp" call to action for locked pages and /pricing. */
export function WhatsAppPremiumButton({ className, label = "Get Premium on WhatsApp" }: { className?: string; label?: string }) {
  return (
    <a
      href={whatsappLink(WHATSAPP_MESSAGES.premium)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5b]",
        className,
      )}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {label}
    </a>
  );
}
