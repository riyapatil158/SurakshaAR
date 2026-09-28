"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DEMO_WORKERS } from "@/lib/demo-data";
import { Users, Award, Clock, AlertTriangle, XCircle, Search, Filter } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const COLORS = ["#ff6a1a", "#22b8cf", "#1fbf75", "#ffb020", "#ef4444", "#8895a6"];

export function AdminDashboardClient() {
  const [search, setSearch] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const workers = DEMO_WORKERS;

  const certified = workers.filter((w) => w.certificates.some((c) => c.status === "valid")).length;
  const expiring = workers.reduce(
    (a, w) => a + w.certificates.filter((c) => c.status === "expiring").length,
    0
  );
  const expired = workers.reduce(
    (a, w) => a + w.certificates.filter((c) => c.status === "expired").length,
    0
  );
  const inTraining = workers.filter((w) => w.modulesCompleted.length < 2 && w.modulesCompleted.length > 0).length;

  const completionData = [
    { name: "Fire", completed: workers.filter((w) => w.modulesCompleted.includes("fire")).length },
    { name: "Gas", completed: workers.filter((w) => w.modulesCompleted.includes("gas")).length },
    { name: "Machine", completed: workers.filter((w) => w.modulesCompleted.includes("machine")).length },
    { name: "PPE", completed: workers.filter((w) => w.modulesCompleted.includes("ppe")).length },
    { name: "First Aid", completed: workers.filter((w) => w.modulesCompleted.includes("firstaid")).length },
  ];

  const industryData = useMemo(() => {
    const map: Record<string, number> = {};
    workers.forEach((w) => {
      map[w.industry] = (map[w.industry] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const avgScoresByIndustry = useMemo(() => {
    const map: Record<string, { sum: number; count: number }> = {};
    workers.forEach((w) => {
      if (!map[w.industry]) map[w.industry] = { sum: 0, count: 0 };
      map[w.industry].sum += w.safetyScore;
      map[w.industry].count += 1;
    });
    return Object.entries(map).map(([name, v]) => ({
      name,
      avg: Math.round(v.sum / v.count),
    }));
  }, []);

  const filtered = workers.filter((w) => {
    const q = search.toLowerCase();
    const matchesQ = !q || w.name.toLowerCase().includes(q) || w.id.toLowerCase().includes(q);
    const matchesIndustry = filterIndustry === "all" || w.industry === filterIndustry;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "valid" && w.certificates.some((c) => c.status === "valid")) ||
      (filterStatus === "expiring" && w.certificates.some((c) => c.status === "expiring")) ||
      (filterStatus === "expired" && w.certificates.some((c) => c.status === "expired")) ||
      (filterStatus === "none" && w.certificates.length === 0);
    return matchesQ && matchesIndustry && matchesStatus;
  });

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-surface-400">SurakshaAR · Admin</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Industrial Safety Compliance</h1>
          <p className="text-surface-300 text-sm mt-1">Monitor workforce certification and training compliance.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Kpi icon={<Users className="h-4 w-4" />} label="Total Workers" value={workers.length} accent="info" />
        <Kpi icon={<Award className="h-4 w-4" />} label="Certified" value={certified} accent="safe" />
        <Kpi icon={<Clock className="h-4 w-4" />} label="In Training" value={inTraining} accent="brand" />
        <Kpi icon={<AlertTriangle className="h-4 w-4" />} label="Expiring Soon" value={expiring} accent="warn" />
        <Kpi icon={<XCircle className="h-4 w-4" />} label="Expired" value={expired} accent="danger" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold text-white">Training Completion by Module</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <BarChart data={completionData}>
                <CartesianGrid stroke="#1c2536" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#8895a6" fontSize={12} />
                <YAxis stroke="#8895a6" fontSize={12} />
                <Tooltip contentStyle={{ background: "#0b0f16", border: "1px solid #273244", borderRadius: 8 }} />
                <Bar dataKey="completed" fill="#ff6a1a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-white">Workers by Industry</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={industryData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {industryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0b0f16", border: "1px solid #273244", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5 lg:col-span-3">
          <h3 className="font-bold text-white">Average Safety Score by Industry</h3>
          <div className="h-56 mt-3">
            <ResponsiveContainer>
              <LineChart data={avgScoresByIndustry}>
                <CartesianGrid stroke="#1c2536" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#8895a6" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#8895a6" fontSize={12} />
                <Tooltip contentStyle={{ background: "#0b0f16", border: "1px solid #273244", borderRadius: 8 }} />
                <Line type="monotone" dataKey="avg" stroke="#ff6a1a" strokeWidth={3} dot={{ r: 5, fill: "#ff6a1a" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workers…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-white focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Industries</option>
            <option value="Mining">Mining</option>
            <option value="Steel">Steel</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-white focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="valid">Valid Certificate</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
            <option value="none">No Certificate</option>
          </select>
          <Filter className="h-4 w-4 text-surface-400" />
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-surface-400 border-b border-surface-700">
                <th className="py-2 pr-3">Worker</th>
                <th className="py-2 pr-3">Industry</th>
                <th className="py-2 pr-3">Modules</th>
                <th className="py-2 pr-3">Score</th>
                <th className="py-2 pr-3">Certificate</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Last Training</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => {
                const bestCert = w.certificates[0];
                const status = bestCert ? bestCert.status : "none";
                return (
                  <tr key={w.id} className="border-b border-surface-800 hover:bg-surface-800/40 transition">
                    <td className="py-3 pr-3">
                      <Link href={`/admin/workers/${w.id}`} className="block">
                        <div className="font-semibold text-white">{w.name}</div>
                        <div className="text-xs text-surface-400 font-mono">{w.id}</div>
                      </Link>
                    </td>
                    <td className="py-3 pr-3 text-surface-200">{w.industry}</td>
                    <td className="py-3 pr-3 text-surface-200">{w.modulesCompleted.length}/5</td>
                    <td className="py-3 pr-3 font-bold text-white">{w.safetyScore}%</td>
                    <td className="py-3 pr-3 font-mono text-xs text-surface-300">
                      {bestCert ? bestCert.code : <span className="text-surface-500">—</span>}
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`tag ${
                        status === "valid" ? "border-safe-500/40 bg-safe-500/10 text-safe-400" :
                        status === "expiring" ? "border-amber-400/40 bg-amber-400/10 text-amber-400" :
                        status === "expired" ? "border-danger-500/40 bg-danger-500/10 text-danger-500" :
                        "border-surface-600 bg-surface-700/40 text-surface-300"
                      }`}>
                        {status === "none" ? "NONE" : status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-xs text-surface-300">{new Date(w.lastTrainingAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-6 text-center text-surface-400 text-sm">No workers match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: "info" | "safe" | "brand" | "warn" | "danger" }) {
  const styles: Record<string, string> = {
    info: "border-info-500/30 bg-info-500/5 text-info-500",
    safe: "border-safe-500/30 bg-safe-500/5 text-safe-400",
    brand: "border-brand-500/30 bg-brand-500/5 text-brand-400",
    warn: "border-amber-400/30 bg-amber-400/5 text-amber-400",
    danger: "border-danger-500/30 bg-danger-500/5 text-danger-500",
  };
  return (
    <div className={`card p-4 border ${styles[accent]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-surface-300">{label}</span>
        <span className={styles[accent].split(" ").pop()}>{icon}</span>
      </div>
      <div className="mt-2 text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
