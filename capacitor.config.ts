import type { CapacitorConfig } from "@capacitor/cli";

// Next.js needs a server: never point webDir at .next or enable static export.
// Only public settings belong here; this config is packaged inside the APK.
const serverUrl = new URL(
  process.env.CAPACITOR_SERVER_URL || "https://openhealth-web-o2yc.vercel.app/hub",
);
if (
  serverUrl.protocol !== "https:" || serverUrl.username || serverUrl.password ||
  serverUrl.hostname === "localhost" || serverUrl.hostname.endsWith(".localhost") ||
  !serverUrl.hostname.includes(".") || /^[\d.]+$/.test(serverUrl.hostname) ||
  serverUrl.search || serverUrl.hash
) {
  throw new Error("CAPACITOR_SERVER_URL must be a public HTTPS URL without credentials, query, or fragment.");
}

const config: CapacitorConfig = {
  appId: "com.fitnmove.app",
  appName: "FitNMove",
  webDir: "capacitor-web",
  server: {
    url: serverUrl.href,
    cleartext: false,
    errorPath: "offline.html",
  },
  android: {
    allowMixedContent: false,
    appendUserAgent: " FitNMoveAndroid/1.0",
  },
  // MainActivity fits the whole WebView inside bars/cutouts and the keyboard.
  plugins: { SystemBars: { insetsHandling: "disable" } },
};

export default config;
