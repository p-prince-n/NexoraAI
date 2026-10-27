CREATE TABLE "agentConfig" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" text,
	"agentId" varchar NOT NULL,
	"name" varchar,
	"agentImage" varchar,
	"description" text,
	"instruction" text,
	"objective" text,
	"tools" jsonb,
	"skills" jsonb,
	"schedule" jsonb,
	"outputFormate" text,
	"status" varchar DEFAULT 'active',
	"composioSessionId" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "agentConfig_agentId_unique" UNIQUE("agentId")
);
--> statement-breakpoint
CREATE TABLE "agentRun" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agentId" varchar NOT NULL,
	"email" text NOT NULL,
	"scheduled_for" timestamp with time zone NOT NULL,
	"timezone" varchar(100) NOT NULL,
	"status" varchar DEFAULT 'scheduled' NOT NULL,
	"output" jsonb,
	"error" text,
	"queued_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dashboardBrief" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" text NOT NULL,
	"brief" text NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dashboardBrief_user_email_unique" UNIQUE("user_email")
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"provider" varchar(100) NOT NULL,
	"icon" varchar(100),
	"status" varchar(50) DEFAULT 'active',
	"requires_auth" boolean DEFAULT false,
	"auth_type" varchar(50),
	"auth_provider" varchar(100),
	"capabilities" jsonb DEFAULT '[]'::jsonb,
	"use_cases" jsonb DEFAULT '[]'::jsonb,
	"permissions" jsonb DEFAULT '[]'::jsonb,
	"approval_rule" jsonb,
	"config" jsonb,
	"risk_level" varchar(30) DEFAULT 'low',
	"can_read" boolean DEFAULT false,
	"can_write" boolean DEFAULT false,
	"can_delete" boolean DEFAULT false,
	"can_execute" boolean DEFAULT false,
	"enabled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"image" text DEFAULT 'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
	"agentCredits" integer DEFAULT 3,
	"usageCredits" integer DEFAULT 100,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "agentConfig" ADD CONSTRAINT "agentConfig_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agentRun" ADD CONSTRAINT "agentRun_agentId_agentConfig_agentId_fk" FOREIGN KEY ("agentId") REFERENCES "public"."agentConfig"("agentId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agentRun" ADD CONSTRAINT "agentRun_email_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dashboardBrief" ADD CONSTRAINT "dashboardBrief_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_agent_occurrence" ON "agentRun" USING btree ("agentId","scheduled_for");--> statement-breakpoint
CREATE INDEX "agent_run_schedule_lookup" ON "agentRun" USING btree ("status","scheduled_for");