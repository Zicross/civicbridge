import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const address_lookup = pgTable("address_lookup", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  addressJson: text("address_json").notNull(), // store normalized address snapshot as JSON
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  issueCategory: varchar("issue_category", { length: 50 }).notNull(),
  issueTags: text("issue_tags"), // JSON array stringified
  body: text("body").notNull(),
  status: varchar("status", { length: 30 }).notNull(),
  consentVersion: varchar("consent_version", { length: 50 }).notNull(),
  consentedAt: timestamp("consented_at").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const audit_events = pgTable("audit_events", {
  id: serial("id").primaryKey(),
  entityType: varchar("entity_type", { length: 30 }).notNull(),
  entityId: varchar("entity_id", { length: 50 }).notNull(),
  actorType: varchar("actor_type", { length: 30 }).notNull(),
  actorId: varchar("actor_id", { length: 50}),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  previousState: varchar("previous_state", { length: 30 }),
  newState: varchar("new_state", { length: 30 }),
  reasonCode: varchar("reason_code", { length: 30 }),
  reasonSummary: text("reason_summary"),
  metadata: text("metadata"), // store redacted metadata as JSON string
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const schema = { users, address_lookup, messages, audit_events };
