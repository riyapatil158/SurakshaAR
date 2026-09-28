"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, Users, Layers, ShieldCheck, Award, BarChart3, Settings, LogOut, Home } from "lucide-react";
import { ReactNode } from "react";

export function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/workers", label: "Workers", icon: Users },
    { href: "/admin/modules", label: "Modules", icon: Layers },
    { href: "/admin/compliance", label: "Compliance", icon: ShieldCheck },
    { href: "/admin/certificates", label: "Certificates", icon: Award },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen grid-bg flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-surface-700 bg-surface-950/60 backdrop-blur flex-col">
        <div className="p-5 border-b border-surface-700">
          <Logo />
        </div>
        <div className="text-[10px] uppercase tracking-wider text-surface-400 px-5 pt-5">Admin Console</div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = n.exact ? path === n.href : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  active ? "bg-brand-500/15 text-brand-400 border border-brand-500/30" : "text-surface-200 hover:bg-surface-800"
                }`}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-surface-700 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-200 hover:bg-surface-800">
            <Home className="h-4 w-4" /> Back to site
          </Link>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-200 hover:bg-surface-800 w-full text-left"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 backdrop-blur bg-surface-950/80 border-b border-surface-700/60">
          <div className="px-4 py-3 flex items-center justify-between">
            <Logo compact />
            <Link href="/" className="btn btn-secondary !py-2 !px-3 text-xs">Exit</Link>
          </div>
          <nav className="flex gap-1 overflow-x-auto no-scrollbar px-4 pb-3">
            {nav.map((n) => {
              const active = n.exact ? path === n.href : path.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                    active ? "bg-brand-500/15 text-brand-400 border border-brand-500/30" : "bg-surface-800 text-surface-200"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
