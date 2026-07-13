import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * quizzes
 * One row per quiz a creator makes.
 * - slug: short public link, e.g. /q/abc123
 * - editTokenHash: hashed magic-link token — lets the creator view
 *   the leaderboard and edit without an account/password.
 */
export const quizzes = pgTable(
  "quizzes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    editTokenHash: text("edit_token_hash").notNull(),
    creatorName: text("creator_name").notNull(),
    language: text("language").notNull().default("en"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("quizzes_slug_idx").on(table.slug),
    uniqueIndex("quizzes_edit_token_hash_idx").on(table.editTokenHash),
  ]
);

/**
 * questions
 * Belongs to a quiz. `options` is a JSON array of up to 4 strings.
 * `correctIndex` points at the creator's chosen answer.
 */
export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    prompt: text("prompt").notNull(),
    options: jsonb("options").$type<string[]>().notNull(),
    correctIndex: integer("correct_index").notNull(),
    position: integer("position").notNull(),
  },
  (table) => [index("questions_quiz_id_idx").on(table.quizId)]
);

/**
 * responses
 * One row per person who takes a quiz.
 * - ipHash: salted hash, never the raw IP (see spec Section 13).
 *   Used only for lightweight duplicate-response throttling.
 */
export const responses = pgTable(
  "responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    takerName: text("taker_name").notNull(),
    answers: jsonb("answers").$type<number[]>().notNull(),
    scorePercent: numeric("score_percent", { precision: 5, scale: 2 }).notNull(),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("responses_quiz_id_idx").on(table.quizId),
    index("responses_quiz_id_ip_hash_idx").on(table.quizId, table.ipHash),
  ]
);

/**
 * reports
 * A flagged quiz, awaiting manual moderation review.
 */
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
  responses: many(responses),
  reports: many(reports),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes, { fields: [questions.quizId], references: [quizzes.id] }),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  quiz: one(quizzes, { fields: [responses.quizId], references: [quizzes.id] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  quiz: one(quizzes, { fields: [reports.quizId], references: [quizzes.id] }),
}));
