import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const fluidBalanceDays = sqliteTable("fluid_balance_days", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  admissionId: text("admission_id").notNull(),
  patientLabel: text("patient_label").notNull(),
  balanceDate: text("balance_date").notNull(),
  intakeMl: integer("intake_ml").notNull(),
  outputMl: integer("output_ml").notNull(),
  balanceMl: integer("balance_ml").notNull(),
  urineMlKgH: real("urine_ml_kg_h").notNull(),
  recordCount: integer("record_count").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("idx_fluid_days_owner_admission_date").on(table.ownerId, table.admissionId, table.balanceDate),
]);
