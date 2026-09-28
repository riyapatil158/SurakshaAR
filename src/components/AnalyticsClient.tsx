"use client";
import { DEMO_WORKERS } from "@/lib/demo-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

export function AnalyticsClient() {
  const scoreDist = [
    { range: "< 60", count: DEMO_WORKERS.filter((w) => w.safetyScore < 60).length },
    { range: "60-69", count: DEMO_WORKERS.filter((w) => w.safetyScore >= 60 && w.safetyScore < 70).length },
    { range: "70-79", count: DEMO_WORKERS.filter((w) => w.safetyScore >= 70 && w.safetyScore < 80).length },
    { range: "80-89", count: DEMO_WORKERS.filter((w) => w.safetyScore >= 80 && w.safetyScore < 90).length },
    { range: "90+", count: DEMO_WORKERS.filter((w) => w.safetyScore >= 90).length },
  ];
  const avg = Math.round(DEMO_WORKERS.reduce((a, w) => a + w.safetyScore, 0) / DEMO_WORKERS.length);

  const avgCompetencies = [
    { name: "Hazard", value: Math.round(DEMO_WORKERS.reduce((a, w) => a + w.competencies.hazardRecognition, 0) / DEMO_WORKERS.length) },
    { name: "Procedure", value: Math.round(DEMO_WORKERS.reduce((a, w) => a + w.competencies.procedureAccuracy, 0) / DEMO_WORKERS.length) },
    { name: "Decision", value: Math.round(DEMO_WORKERS.reduce((a, w) => a + w.competencies.decisionMaking, 0) / DEMO_WORKERS.length) },
    { name: "Equipment", value: Math.round(DEMO_WORKERS.reduce((a, w) => a + w.competencies.equipmentSelection, 0) / DEMO_WORKERS.length) },
    { name: "Reaction", value: Math.round(DEMO_WORKERS.reduce((a, w) => a + w.competencies.reactionTime, 0) / DEMO_WORKERS.length) },
  ];

  const monthly = [
    { month: "May", certs: 2 },
    { month: "Jun", certs: 5 },
    { month: "Jul", certs: 4 },
    { month: "Aug", certs: 6 },
    { month: "Sep", certs: 7 },
    { month: "Oct", certs: 8 },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
      <p className="text-surface-300 text-sm mt-1">Workforce-wide training performance insights.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold text-white">Score Distribution</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <BarChart data={scoreDist}>
                <CartesianGrid stroke="#1c2536" strokeDasharray="3 3" />
                <XAxis dataKey="range" stroke="#8895a6" fontSize={12} />
                <YAxis stroke="#8895a6" fontSize={12} />
                <Tooltip contentStyle={{ background: "#0b0f16", border: "1px solid #273244", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#ff6a1a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-white">Average Competency Scores</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <BarChart data={avgCompetencies}>
                <CartesianGrid stroke="#1c2536" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#8895a6" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#8895a6" fontSize={12} />
                <Tooltip contentStyle={{ background: "#0b0f16", border: "1px solid #273244", borderRadius: 8 }} />
                <Bar dataKey="value" fill="#22b8cf" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold text-white">Certificates Issued (Last 6 Months)</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <AreaChart data={monthly}>
                <CartesianGrid stroke="#1c2536" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#8895a6" fontSize={12} />
                <YAxis stroke="#8895a6" fontSize={12} />
                <Tooltip contentStyle={{ background: "#0b0f16", border: "1px solid #273244", borderRadius: 8 }} />
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6a1a" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#ff6a1a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="certs" stroke="#ff6a1a" strokeWidth={3} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 card p-5">
        <h3 className="font-bold text-white">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          <Stat label="Total Workers" value={String(DEMO_WORKERS.length)} />
          <Stat label="Average Safety Score" value={`${avg}%`} />
          <Stat label="Total Certificates" value={String(DEMO_WORKERS.reduce((a, w) => a + w.certificates.length, 0))} />
          <Stat label="Workers with 2 Modules" value={String(DEMO_WORKERS.filter((w) => w.modulesCompleted.length === 2).length)} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-900/60 border border-surface-700 p-3">
      <div className="text-[10px] uppercase tracking-wider text-surface-400">{label}</div>
      <div className="text-2xl font-bold text-white mt-1">{value}</div>
    </div>
  );
}
