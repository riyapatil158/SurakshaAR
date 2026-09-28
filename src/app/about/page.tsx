import { HomeShell } from "@/components/HomeShell";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowRight, Shield, Target, Sparkles, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <HomeShell>
      <div className="max-w-4xl mx-auto">
        <Logo />
        <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-white">About SurakshaAR</h1>
        <p className="text-surface-300 text-lg mt-3">
          Safe Today · Skilled Tomorrow · A Safer Jharkhand.
        </p>

        <section className="mt-8 card p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Target className="h-5 w-5 text-brand-400" /> Problem</h2>
          <p className="text-surface-200 mt-3 leading-relaxed">
            Industrial workers in mining, steel, and manufacturing may receive classroom or manual safety
            training, but practical retention and realistic emergency drills are often difficult to deliver
            at scale. Remote sites, language barriers, and limited training infrastructure further reduce
            access to hands-on practice.
          </p>
        </section>

        <section className="mt-4 card p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="h-5 w-5 text-brand-400" /> Solution</h2>
          <p className="text-surface-200 mt-3 leading-relaxed">
            SurakshaAR delivers interactive smartphone-based AR and 3D safety training. Workers complete
            game-like safety missions inside simulated industrial environments, receive deterministic
            competency feedback, and earn digitally verifiable credentials — all from their own device.
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "AR/3D interactive training",
              "Safety Mission Mode",
              "Hazard Hunt practice",
              "Adaptive refresher training",
              "Digital certificates",
              "QR verification",
              "Hindi + Santali",
              "Admin compliance dashboard",
              "Inclusive UX for diverse workforce",
            ].map((i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-surface-200">
                <Shield className="h-4 w-4 text-brand-400" /> {i}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 card p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Award className="h-5 w-5 text-brand-400" /> Impact</h2>
          <ul className="mt-3 space-y-2 text-surface-200 list-disc list-inside">
            <li>Safer, better-trained workforce with measurable competencies</li>
            <li>Scalable training accessible to remote worksites</li>
            <li>Digital, tamper-evident training records</li>
            <li>Improved practical engagement compared to passive instruction</li>
            <li>Reduced compliance gaps with proactive alerts</li>
          </ul>
        </section>

        <div className="mt-6 p-4 rounded-lg bg-amber-400/5 border border-amber-400/30 text-sm text-surface-200">
          <strong className="text-amber-400">Disclaimer:</strong> This training simulator is an educational prototype and does not replace site-specific safety procedures, statutory requirements, qualified safety trainers, emergency response plans, or authorized industrial operating procedures.
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/solution" className="btn btn-primary">Explore Solution <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </HomeShell>
  );
}
