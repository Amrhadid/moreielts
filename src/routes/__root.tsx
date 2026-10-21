import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AuthProvider, useAuth } from "~/lib/auth";
import { I18nProvider } from "~/lib/i18n";
import appCss from "~/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
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

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LocaleFromProfile>{children}</LocaleFromProfile>
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
