import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Header } from "~/components/layout/Header";
import { AdminOnly } from "~/lib/auth";

export const Route = createFileRoute("/admin")({ component: AdminRoute });

function AdminRoute() {
  return <AdminLayout />;
}

const ADMIN_NAV = [
  { label: "Test forms", to: "/admin" },
  { label: "Students", to: "/admin/students" },
  { label: "Access codes", to: "/admin/codes" },
  { label: "Analytics", to: "/admin/analytics" },
];

/** Admin chrome is denser and more utilitarian than the student app. */
function AdminLayout() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="border-b border-line bg-surface">
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/admin" }}
              className="-mb-px shrink-0 border-b-2 border-transparent px-3 py-3 text-sm font-medium text-muted transition-colors hover:text-ink data-[status=active]:border-brand-600 data-[status=active]:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Guarded here so the nav renders but no admin data is fetched
            for a non-admin. RLS blocks the queries regardless. */}
        <AdminOnly>
          <Outlet />
        </AdminOnly>
      </main>
    </div>
  );
}
