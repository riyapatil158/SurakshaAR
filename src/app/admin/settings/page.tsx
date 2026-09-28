import { AdminShell } from "@/components/AdminShell";

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        <p className="text-surface-300 text-sm mt-1">Configure your admin console.</p>

        <div className="mt-6 card p-5 space-y-4">
          <Field label="Organization Name" value="Jharkhand Industrial Safety Authority (Demo)" />
          <Field label="Admin Email" value="admin@surakshaar.example" />
          <Field label="Default Language" value="English" />
          <Field label="Certificate Expiry" value="12 months" />
          <Field label="Passing Threshold" value="70%" />
        </div>

        <div className="mt-4 card p-5">
          <h3 className="font-bold text-white">Demo Credentials</h3>
          <p className="text-sm text-surface-300 mt-1">This is a demo environment. The admin login uses placeholder credentials.</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded bg-surface-900/60 border border-surface-700 p-3">
              <div className="text-[10px] uppercase tracking-wider text-surface-400">Username</div>
              <div className="font-mono text-white mt-1">admin</div>
            </div>
            <div className="rounded bg-surface-900/60 border border-surface-700 p-3">
              <div className="text-[10px] uppercase tracking-wider text-surface-400">Password</div>
              <div className="font-mono text-white mt-1">admin123</div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-surface-400">{label}</div>
      <div className="mt-1 w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-white text-sm">
        {value}
      </div>
    </div>
  );
}
