import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { AuthProvider, useAuth } from "~/lib/auth";
import { installErrorReporter, registerServiceWorker } from "~/lib/error-reporter";
import { WhatsAppFloatingButton } from "~/components/WhatsApp";
import { I18nProvider } from "~/lib/i18n";
import appCss from "~/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0875c9" },
      { property: "og:site_name", content: "MoreIELTS" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/icons/icon-512.png" },
      { title: "MoreIELTS — IELTS practice and mock exams" },
      {
        name: "description",
        content:
          "Practice every IELTS question type and sit full timed mock exams with band-scored feedback.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  // One client per document. Retries are kept low because most failures here
  // are RLS denials, which will never succeed on a retry.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
        },
      }),
  );

  useEffect(() => {
    installErrorReporter();
    registerServiceWorker();
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lg"
        >
          Skip to content
        </a>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LocaleFromProfile>
              {children}
              <WhatsAppFloatingButton />
            </LocaleFromProfile>
          </AuthProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

function LocaleFromProfile({ children }: { children: ReactNode }) {
  const { profile, user } = useAuth();
  return (
    <I18nProvider profileLocale={profile?.locale ?? null} userId={user?.id ?? null}>
      {children}
    </I18nProvider>
  );
}

export default function RootComponent() {
  return <Outlet />;
}
