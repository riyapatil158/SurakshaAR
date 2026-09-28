"use client";
import { useState } from "react";
import Link from "next/link";
import { DEMO_WORKERS } from "@/lib/demo-data";
import { Search, Filter } from "lucide-react";

export function AdminWorkersClient() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("all");

  const filtered = DEMO_WORKERS.filter((w) => {
    const q = search.toLowerCase();
    return (
      (!q || w.name.toLowerCase().includes(q) || w.id.toLowerCase().includes(q)) &&
      (industry === "all" || w.industry === industry)
    );
  });

  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Workers</h1>
      <p className="text-surface-300 text-sm mt-1">{DEMO_WORKERS.length} workers enrolled in the program.</p>

      <div className="mt-5 card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-white focus:border-brand-500 focus:outline-none"
          />
        </div>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-white">
          <option value="all">All Industries</option>
          <option value="Mining">Mining</option>
          <option value="Steel">Steel</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <Filter className="h-4 w-4 text-surface-400 self-center" />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((w) => (
          <Link key={w.id} href={`/admin/workers/${w.id}`} className="card card-hover p-4">
            <div className="flex items-center gap-3">
              <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm ${
                w.gender === "Female" ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" : "bg-brand-500/20 text-brand-400 border border-brand-500/30"
              }`}>
                {w.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{w.name}</div>
                <div className="text-xs text-surface-400 font-mono">{w.id}</div>
              </div>
              <span className={`tag ${w.safetyScore >= 85 ? "border-safe-500/40 bg-safe-500/10 text-safe-400" : w.safetyScore >= 70 ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-danger-500/40 bg-danger-500/10 text-danger-500"}`}>
                {w.safetyScore}%
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded bg-surface-900/60 border border-surface-700 p-2">
                <div className="text-surface-400">Industry</div>
                <div className="text-white font-semibold">{w.industry}</div>
              </div>
              <div className="rounded bg-surface-900/60 border border-surface-700 p-2">
                <div className="text-surface-400">Modules</div>
                <div className="text-white font-semibold">{w.modulesCompleted.length}/5</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
