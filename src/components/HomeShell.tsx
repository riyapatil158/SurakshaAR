import Link from "next/link";
import { Logo } from "./Logo";
import { HomeNav } from "./HomeNav";

export function HomeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid-bg relative">
      <header className="sticky top-0 z-30 backdrop-blur bg-surface-950/70 border-b border-surface-700/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <HomeNav />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">{children}</main>
      <footer className="mt-16 border-t border-surface-700/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 text-xs text-surface-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} SurakshaAR · Prototype for educational use.
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/solution" className="hover:text-white">Solution</Link>
            <Link href="/safety-information" className="hover:text-white">Safety Info</Link>
            <Link href="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
