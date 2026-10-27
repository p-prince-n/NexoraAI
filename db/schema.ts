import { boolean } from "drizzle-orm/gel-core";
import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image:text("image").default("https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"),
  agentCredits: integer("agentCredits").default(3),
  usageCredits: integer("usageCredits").default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tools = pgTable("tools", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  provider: varchar("provider", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  status: varchar("status", { length: 50 }).default("active"),
  requiresAuth: boolean("requires_auth").default(false),
  authType: varchar("auth_type", { length: 50 }),
  authProvider: varchar("auth_provider", { length: 100 }),
  capabilities: jsonb("capabilities").$type<string[]>().default([]),
  useCases: jsonb("use_cases").$type<string[]>().default([]),
  permissions: jsonb("permissions").$type<string[]>().default([]),
  approvalRules: jsonb("approval_rule").$type<Record<string, boolean>>(),
  config: jsonb("config").$type<Record<string, any>>(),
  riskLevel: varchar("risk_level", { length: 30 }).default("low"),
  canRead: boolean("can_read").default(false),
  canWrite: boolean("can_write").default(false),
  canDelete: boolean("can_delete").default(false),
  canExecute: boolean("can_execute").default(false),
  enabled: boolean("enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agentConfig = pgTable("agentConfig", {
  id: serial("id").primaryKey(),
  userEmail: text("user_email").references(() => users.email),
  agentId: varchar("agentId").notNull().unique(),
  name: varchar("name"),
  agentImage: varchar("agentImage"),
  description: text("description"),
  instructions: text("instruction"),
  objective: text("objective"),
  tools: jsonb("tools"),
  skills: jsonb("skills"),
  schedule: jsonb("schedule"),
  outputFormate: text("outputFormate"),
  status: varchar("status").default("active"),
  composioSessionId: varchar("composioSessionId"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agentRun = pgTable(
  "agentRun",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agentid: varchar("agentId")
      .notNull()
      .references(() => agentConfig.agentId, {
        onDelete: "cascade"
      }),
    userEmail: text("email").references(()=> users.email, {
      onDelete: "cascade"
    }).notNull(),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull(),
    timezone: varchar("timezone", { length: 100 }).notNull(),
    status: varchar("status").default("scheduled").notNull(),
    output: jsonb("output"),
    error: text("error"),
    queuedAt: timestamp("queued_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_agent_occurrence").on(
      table.agentid,
      table.scheduledFor,
    ),

    index("agent_run_schedule_lookup").on(table.status, table.scheduledFor),
  ],
);

export const dashboardBrief = pgTable("dashboardBrief", {
  id: serial("id").primaryKey(),

  userEmail: text("user_email")
    .notNull()
    .unique()
    .references(() => users.email),

  brief: text("brief").notNull(),

  generatedAt: timestamp("generated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
