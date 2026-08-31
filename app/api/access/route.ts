export const dynamic = "force-dynamic";

type AccessResponse = {
  status: "basic" | "trial" | "active" | "expired" | "pending";
  source: "store/backend" | "configuration";
  trialDays: number;
  licenseDays: number;
  reviewedOn: string;
  note: string;
};

function readConfiguredAccess(): AccessResponse {
  const status = process.env.AME_ACCESS_STATUS;
  const source = process.env.AME_ACCESS_SOURCE;
  const trialDays = Number(process.env.AME_TRIAL_DAYS ?? 30);
  const licenseDays = Number(process.env.AME_LICENSE_DAYS ?? 180);

  return {
    status: status === "basic" || status === "trial" || status === "active" || status === "expired" ? status : "pending",
    source: source === "store/backend" ? "store/backend" : "configuration",
    trialDays: Number.isFinite(trialDays) && trialDays > 0 ? trialDays : 30,
    licenseDays: Number.isFinite(licenseDays) && licenseDays > 0 ? licenseDays : 180,
    reviewedOn: "2026-08-31",
    note: "Store/backend integration pending.",
  };
}

export async function GET() {
  return Response.json(readConfiguredAccess(), {
    headers: {
      "cache-control": "no-store, max-age=0",
    },
  });
}
