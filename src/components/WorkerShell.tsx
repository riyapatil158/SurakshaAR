"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Home, Layers, IdCard, User as UserIcon, LogOut, Shield } from "lucide-react";
import { useSession, useLang } from "@/components/SessionProvider";
import { t } from "@/lib/i18n";
import { ReactNode } from "react";

export function WorkerShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { session, logout } = useSession();
  const { lang } = useLang();

  const worker = session?.worker;

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <div className="card p-8 text-center max-w-md">
          <Logo compact />
          <h1 className="mt-4 text-xl font-bold text-white">No worker profile selected</h1>
          <p className="mt-2 text-surface-300 text-sm">Please select or create a profile to begin.</p>
          <Link href="/login" className="btn btn-primary mt-5">Select Profile</Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/worker", label: t(lang, "worker.nav.home"), icon: Home, exact: true },
    { href: "/worker/modules", label: t(lang, "worker.nav.modules"), icon: Layers },
    { href: "/worker/passport", label: t(lang, "worker.nav.passport"), icon: IdCard },
    { href: "/worker/profile", label: t(lang, "worker.nav.profile"), icon: UserIcon },
  ];

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur bg-surface-950/80 border-b border-surface-700/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/worker" className="flex items-center">
            <Logo compact />
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-surface-700 mr-2">
              <div className="h-8 w-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400">
                {worker.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">{worker.name}</div>
                <div className="text-[10px] text-surface-400">{worker.id}</div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="btn btn-ghost !py-2 !px-3 text-xs"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <nav className="sticky bottom-0 z-20 md:hidden border-t border-surface-700 bg-surface-950/90 backdrop-blur">
        <div className="grid grid-cols-4">
          {navItems.map((n) => {
            const active = n.exact ? path === n.href : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex flex-col items-center py-2.5 text-[10px] uppercase tracking-wider transition ${
                  active ? "text-brand-400" : "text-surface-400"
                }`}
              >
                <n.icon className="h-5 w-5 mb-0.5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
