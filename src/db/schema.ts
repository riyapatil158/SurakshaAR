import {
  pgTable,
  text,
  integer,
  timestamp,
  numeric,
  boolean,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

export const workers = pgTable("workers", {
  id: varchar("id", { length: 32 }).primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  experience: text("experience").notNull(),
  language: text("language").notNull().default("en"),
  gender: text("gender"),
  ageGroup: text("age_group"),
  safetyScore: integer("safety_score").notNull().default(0),
  competencies: jsonb("competencies")
    .notNull()
    .$type<Record<string, number>>()
    .default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const trainingProgress = pgTable("training_progress", {
  id: varchar("id", { length: 32 }).primaryKey(),
  workerId: varchar("worker_id", { length: 32 })
    .notNull()
    .references(() => workers.id, { onDelete: "cascade" }),
  moduleId: text("module_id").notNull(),
  status: text("status").notNull().default("not_started"),
  bestScore: integer("best_score").notNull().default(0),
  attempts: integer("attempts").notNull().default(0),
  lastAttemptAt: timestamp("last_attempt_at"),
  competencies: jsonb("competencies")
    .notNull()
    .$type<Record<string, number>>()
    .default({}),
});

export const certificates = pgTable("certificates", {
  id: varchar("id", { length: 32 }).primaryKey(),
  verificationCode: varchar("verification_code", { length: 16 })
    .notNull()
    .unique(),
  workerId: varchar("worker_id", { length: 32 })
    .notNull()
    .references(() => workers.id, { onDelete: "cascade" }),
  moduleId: text("module_id").notNull(),
  score: integer("score").notNull(),
  status: text("status").notNull().default("valid"),
  issueDate: timestamp("issue_date").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  competencies: jsonb("competencies")
    .notNull()
    .$type<Record<string, number>>()
    .default({}),
});

export const modules = pgTable("modules", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  status: text("status").notNull().default("active"),
  skills: jsonb("skills").notNull().$type<string[]>().default([]),
});
