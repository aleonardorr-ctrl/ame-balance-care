import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

async function ownerId() {
  const user = await getChatGPTUser();
  return user?.userId ?? null;
}

export async function GET(request: Request) {
  const owner = await ownerId();
  if (!owner) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const admissionId = new URL(request.url).searchParams.get("admissionId")?.trim();
  if (!admissionId) return Response.json({ days: [] });
  const result = await env.DB.prepare(`SELECT id, admission_id AS admissionId, patient_label AS patientLabel,
    balance_date AS balanceDate, intake_ml AS intakeMl, output_ml AS outputMl, balance_ml AS balanceMl,
    urine_ml_kg_h AS urineMlKgH, record_count AS recordCount
    FROM fluid_balance_days WHERE owner_id = ? AND admission_id = ? ORDER BY balance_date, id`)
    .bind(owner, admissionId).all();
  return Response.json({ days: result.results });
}

export async function POST(request: Request) {
  const owner = await ownerId();
  if (!owner) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const admissionId = String(body.admissionId ?? "").trim().slice(0, 80);
  const patientLabel = String(body.patientLabel ?? "").trim().slice(0, 160);
  const balanceDate = String(body.balanceDate ?? "").slice(0, 10);
  if (!admissionId || !balanceDate) return Response.json({ error: "Missing fields" }, { status: 400 });
  const values = [Number(body.intakeMl)||0, Number(body.outputMl)||0, Number(body.balanceMl)||0, Number(body.urineMlKgH)||0, Number(body.recordCount)||0];
  await env.DB.prepare(`INSERT INTO fluid_balance_days
    (owner_id, admission_id, patient_label, balance_date, intake_ml, output_ml, balance_ml, urine_ml_kg_h, record_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(owner_id, admission_id, balance_date) DO UPDATE SET
    patient_label=excluded.patient_label, intake_ml=excluded.intake_ml, output_ml=excluded.output_ml,
    balance_ml=excluded.balance_ml, urine_ml_kg_h=excluded.urine_ml_kg_h, record_count=excluded.record_count`)
    .bind(owner, admissionId, patientLabel, balanceDate, ...values).run();
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const owner = await ownerId();
  if (!owner) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json() as { id?: number };
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await env.DB.prepare("DELETE FROM fluid_balance_days WHERE id = ? AND owner_id = ?").bind(id, owner).run();
  return Response.json({ ok: true });
}
