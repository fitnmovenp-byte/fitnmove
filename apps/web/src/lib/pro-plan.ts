export const ESEWA_ACCOUNT = "9803526374";
export const SUPPORT_PHONE = "9803526374";
export const SUPPORT_WHATSAPP_URL = `https://wa.me/977${SUPPORT_PHONE}`;
export const ESEWA_QR_SRC = "/QR.jpeg";

export const PRO_PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: "Rs. 199",
    period: "month",
    note: "Best to try FitNMove Pro without thinking too much.",
    highlight: false,
  },
  {
    id: "six-months",
    name: "6 months",
    price: "Rs. 999",
    period: "6 months",
    note: "Steady progress plan with a better monthly value.",
    highlight: false,
  },
  {
    id: "yearly",
    name: "Annual",
    price: "Rs. 1,799",
    period: "year",
    note: "Works out to about Rs. 150/month.",
    highlight: true,
  },
] as const;

export const PRO_FEATURES = [
  "Unlimited food label scans and calorie estimates",
  "100 AI coach chats per day",
  "Micronutrient tracking and saved meals",
  "Exercise hub and workout analysis",
  "Fasting protocols and tracking",
  "Progress photos and data export",
  "Tasks, missions, medals, and leaderboard access",
] as const;
