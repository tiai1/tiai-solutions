import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  role: text("role"),
  message: text("message").notNull(),
  timeframe: text("timeframe"),
  budget: text("budget"),
  honeypot: text("honeypot").default(""),
  created_at: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(),
  payload: jsonb("payload"),
  created_at: timestamp("created_at").defaultNow(),
});

export const downloads = pgTable("downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  template_name: text("template_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  created_at: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  created_at: true,
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  created_at: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;
