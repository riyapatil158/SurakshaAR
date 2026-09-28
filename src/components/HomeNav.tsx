"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGUAGES } from "@/lib/i18n";
import { useLang } from "./SessionProvider";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";

export function HomeNav() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const linkCls = (p: string) =>
    `text-sm font-medium px-3 py-2 rounded-md transition ${
      pathname === p ? "text-white bg-surface-700/60" : "text-surface-200 hover:text-white hover:bg-surface-800/60"
    }`;

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="hidden md:flex items-center gap-1">
        <Link href="/" className={linkCls("/")}>Home</Link>
        <Link href="/worker" className={linkCls("/worker")}>Worker</Link>
        <Link href="/admin" className={linkCls("/admin")}>Admin</Link>
        <Link href="/about" className={linkCls("/about")}>About</Link>
        <Link href="/solution" className={linkCls("/solution")}>Solution</Link>
      </div>

      <div className="relative">
        <button
          onClick={() => setLangOpen((v) => !v)}
          className="btn btn-secondary !py-2 !px-3"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs uppercase">{lang}</span>
        </button>
        {langOpen && (
          <div className="absolute right-0 mt-2 w-40 card p-1 shadow-xl z-40">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setLangOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  lang === l.code ? "bg-surface-700 text-white" : "text-surface-200 hover:bg-surface-800"
                }`}
              >
                <div className="font-medium">{l.native}</div>
                <div className="text-[10px] text-surface-400">{l.label}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="md:hidden btn btn-secondary !py-2 !px-3" onClick={() => setOpen((v) => !v)}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full md:hidden bg-surface-900 border-b border-surface-700 px-4 py-3 flex flex-col gap-1">
          <Link href="/" className={linkCls("/")} onClick={() => setOpen(false)}>Home</Link>
          <Link href="/worker" className={linkCls("/worker")} onClick={() => setOpen(false)}>Worker</Link>
          <Link href="/admin" className={linkCls("/admin")} onClick={() => setOpen(false)}>Admin</Link>
          <Link href="/about" className={linkCls("/about")} onClick={() => setOpen(false)}>About</Link>
          <Link href="/solution" className={linkCls("/solution")} onClick={() => setOpen(false)}>Solution</Link>
          <Link href="/safety-information" className={linkCls("/safety-information")} onClick={() => setOpen(false)}>Safety Info</Link>
        </div>
      )}
    </div>
  );
}
