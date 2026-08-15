CREATE TABLE `fluid_balance_days` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`admission_id` text NOT NULL,
	`patient_label` text NOT NULL,
	`balance_date` text NOT NULL,
	`intake_ml` integer NOT NULL,
	`output_ml` integer NOT NULL,
	`balance_ml` integer NOT NULL,
	`urine_ml_kg_h` real NOT NULL,
	`record_count` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_fluid_days_owner_admission_date` ON `fluid_balance_days` (`owner_id`,`admission_id`,`balance_date`);