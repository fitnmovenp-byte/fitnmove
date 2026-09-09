export const NEPAL_SUBSCRIPTION_PLANS = {
  monthly: {
    id: "monthly",
    name: "Monthly",
    amountPaisa: 19_900,
    durationMonths: 1,
  },
  "six-months": {
    id: "six-months",
    name: "6 months",
    amountPaisa: 99_900,
    durationMonths: 6,
  },
  yearly: {
    id: "yearly",
    name: "Annual",
    amountPaisa: 179_900,
    durationMonths: 12,
  },
} as const;

export type NepalPlanId = keyof typeof NEPAL_SUBSCRIPTION_PLANS;
export type NepalPaymentProvider = "esewa" | "khalti";

export function formatNpr(amountPaisa: number) {
  return `Rs. ${(amountPaisa / 100).toLocaleString("en-NP")}`;
}
