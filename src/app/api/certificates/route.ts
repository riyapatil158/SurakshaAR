import { NextResponse } from "next/server";
import { db } from "@/db";
import { certificates, workers } from "@/db/schema";

export const dynamic = "force-dynamic";

type Body = {
  code: string;
  moduleId: string;
  score: number;
  issueDate: string;
  competencies?: Record<string, number>;
  worker: {
    id: string;
    name: string;
    industry: string;
    experience: string;
    language?: string;
    gender?: string;
    ageGroup?: string;
    safetyScore?: number;
  };
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { code, moduleId, score, issueDate, worker, competencies } = body;
  if (!code || !/^SA-[A-Z0-9]{4,10}$/.test(code) || !moduleId || !worker?.id || !worker?.name) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const issued = new Date(issueDate || Date.now());
  const expires = new Date(issued);
  expires.setFullYear(expires.getFullYear() + 1);

  try {
    await db
      .insert(workers)
      .values({
        id: worker.id,
        name: worker.name,
        industry: worker.industry || "Other",
        experience: worker.experience || "—",
        language: worker.language || "en",
        gender: worker.gender ?? null,
        ageGroup: worker.ageGroup ?? null,
        safetyScore: Math.round(worker.safetyScore ?? 0),
      })
      .onConflictDoUpdate({
        target: workers.id,
        set: { name: worker.name, updatedAt: new Date() },
      });

    await db
      .insert(certificates)
      .values({
        id: code,
        verificationCode: code,
        workerId: worker.id,
        moduleId,
        score: Math.round(Math.max(0, Math.min(100, score))),
        status: "valid",
        issueDate: issued,
        expiresAt: expires,
        competencies: competencies ?? {},
      })
      .onConflictDoNothing();

    return NextResponse.json({ ok: true, code });
  } catch (err) {
    console.error("Failed to store certificate", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
