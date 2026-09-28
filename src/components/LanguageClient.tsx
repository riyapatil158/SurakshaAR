"use client";
import { LANGUAGES } from "@/lib/i18n";
import { useLang } from "@/components/SessionProvider";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";

export function LanguageClient() {
  const { lang, setLang } = useLang();
  const router = useRouter();

  const choose = (code: (typeof LANGUAGES)[number]["code"]) => {
    setLang(code);
    router.push("/login");
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="card p-6 sm:p-8">
        <div className="tag border-brand-500/40 bg-brand-500/10 text-brand-400">Step 1 of 2</div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white">Choose your language</h1>
        <p className="mt-2 text-surface-300 text-sm">You can change this anytime in settings.</p>

        <div className="mt-6 grid gap-3">
          {LANGUAGES.map((l) => {
            const selected = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => choose(l.code)}
                className={`flex items-center justify-between text-left p-4 rounded-lg border transition ${
                  selected
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-surface-700 bg-surface-800/40 hover:border-surface-500"
                }`}
              >
                <div>
                  <div className="text-lg font-bold text-white">{l.native}</div>
                  <div className="text-xs text-surface-400 uppercase tracking-wider">{l.label}</div>
                </div>
                <div className="flex items-center gap-2">
                  {selected && <Check className="h-5 w-5 text-brand-400" />}
                  <ChevronRight className="h-5 w-5 text-surface-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
