/**
 * The MoreIELTS WhatsApp line (the same number MoreTOEFL uses). Hard-coded so
 * deployment needs no configuration; change it here in one place.
 */
export const WHATSAPP_PHONE = "201097965058";

export const WHATSAPP_MESSAGES = {
  general: "Hi, I have a question about MoreIELTS",
  premium: "Hi, I want to subscribe to MoreIELTS Premium",
} as const;

export function whatsappLink(message: string = WHATSAPP_MESSAGES.general): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
