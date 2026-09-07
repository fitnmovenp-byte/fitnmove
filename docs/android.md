# FitNMove Android

## Architecture

The Android app loads https://openhealth-web-o2yc.vercel.app/hub in Capacitor's Android WebView. The same deployed Next.js server handles pages, API routes, tRPC, server actions, Supabase sessions, uploads and database access. iOS Safari, Windows and other browsers continue using the existing website.

Static export is incompatible with this repository: the root layout calls headers(), middleware rewrites localized pages, auth/callback exchanges OAuth codes, and API routes/server actions require a server. next.config.ts remains unchanged with output: standalone. capacitor-web is a minimal bundled connection/error shell, not a Next.js build; never copy .next into it. npm run build builds the website; cap sync copies the shell and native configuration. Deploy frontend changes to Vercel before expecting them in Android.

Tradeoff: Capacitor documents server.url as intended for live reload rather than production (https://capacitorjs.com/docs/config). This remote shell is the least disruptive integration for this server-dependent app, but requires connectivity and device/release testing. It is not an offline bundled frontend or a guarantee of Play approval. A bundled production frontend would require a separate client build and explicit remote API/auth integration, beyond this preservation-focused change. Keep navigation restricted to the configured origin; do not add wildcard allowNavigation. External sites open outside the app. Only public configuration is packaged; server secrets remain on Vercel.

## Packages and permissions

Root dependencies: @capacitor/core 8.5.1, @capacitor/android 8.5.1. Root development dependencies: @capacitor/cli 8.5.1, typescript 5.9.3, @types/node 22.19.13. The pnpm lockfile is authoritative. No iOS project and no extra native feature plugins are installed. SystemBars is built into Capacitor 8.5.

Android permissions: INTERNET, CAMERA, RECORD_AUDIO, MODIFY_AUDIO_SETTINGS, ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION. Camera, autofocus, microphone and location hardware are optional. Capacitor's existing WebChromeClient requests runtime camera/microphone/location permissions when browser APIs are used, including approximate-location fallback. No background location, storage, notification or foreground-service permission is added. Backups of app data are disabled and cleartext/mixed content is blocked.

## Local commands (PowerShell, repository root)

Prerequisites: Node 22+, pnpm 10.11.0, Android Studio 2025.2.1 or newer, JDK 21 (Studio's bundled runtime), Android SDK platform 36 and its build tools. See https://capacitorjs.com/docs/getting-started/environment-setup.

```powershell
npx --yes pnpm@10.11.0 install --frozen-lockfile
npm run build
npx cap sync android
npx cap open android
```

Use pnpm 10.11.0 on PATH because Turbo invokes pnpm. If an unrelated globally installed pnpm shadows it, run the unchanged build with:

```powershell
npx --yes --package=pnpm@10.11.0 -c "npm run build"
```

The Android project has already been created with npx cap add android; do not add it again. If Android Studio is installed in a nonstandard location:

```powershell
$env:CAPACITOR_ANDROID_STUDIO_PATH = 'C:\Program Files\Android\Android Studio\bin\studio64.exe'
npx cap open android
```

Optional URL override, before every sync in that shell (not automatically loaded from apps/web/.env.local):

```powershell
$env:CAPACITOR_SERVER_URL = 'https://openhealth-web-o2yc.vercel.app/hub'
npx cap sync android
```

Keep Vercel NEXT_PUBLIC_APP_URL set to https://openhealth-web-o2yc.vercel.app (origin only), and allow https://openhealth-web-o2yc.vercel.app/auth/callback in Supabase. Local .env.local currently points at localhost for web development; it is not copied into Android. Existing server-side localhost defaults for optional Ollama services likewise need proper remote values in Vercel when enabled.

## Debug APK

Install SDK 36 in Studio's SDK Manager, let Studio create android/local.properties, and select its JDK 21 for Gradle. For a typical Windows installation:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
npx cap sync android
Push-Location android
.\gradlew.bat assembleDebug
Pop-Location
```

Output: android/app/build/outputs/apk/debug/app-debug.apk. Install on a connected USB-debugging device using:

```powershell
& "$env:ANDROID_HOME\platform-tools\adb.exe" install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Signed release AAB

1. Deploy the tested website and run npx cap sync android.
2. Increment versionCode/versionName in android/app/build.gradle for each release.
3. Run npx cap open android. Choose Build > Generate Signed Bundle / APK > Android App Bundle, module app.
4. Create or select your upload keystore and alias. Store the keystore/passwords securely outside the repository; back it up. Do not commit signing secrets.
5. Select release and finish. Studio reports the output location, normally android/app/release/app-release.aab.
6. Upload to Play Console internal testing and configure Play App Signing before production rollout.

The generated Gradle release build is intentionally unsigned without your key. Running bundleRelease alone does not create a signed Play-ready bundle. Replace the generated Capacitor launcher/splash artwork with approved FitNMove assets before release. Review Play requirements for health data, permissions, account deletion, payments and privacy against the features you ship.

## Device feature audit and differences

| Feature | Android behavior / validation needed |
| --- | --- |
| Camera and switching | Existing getUserMedia video streams and facingMode are retained; analyzer stops tracks before switching and falls back from exact to ideal rear camera. Test both lenses, deny/regrant, and switching repeatedly on a physical device. Capacitor Camera still-photo APIs would not replace the continuous CV stream. |
| MediaPipe | Existing HTTPS CDN modules, WASM/models, canvas and GPU/CPU fallback remain. Needs an up-to-date Android System WebView and network for model loading; throughput/thermal throttling varies by device. Test each game/analyzer. |
| Microphone/audio | Existing getUserMedia audio and Web Audio remain. Permission prompts are native; playback may require a user tap. speechSynthesis support/voices vary by WebView; spoken coaching may be missing even when sound effects work. |
| GPS | Existing navigator.geolocation.watchPosition remains for foreground use. Approximate permission reduces accuracy. Screen lock/background can suspend updates; routes may contain gaps. Continuous background tracking requires a separate foreground-service implementation. |
| Notifications | In-app inbox remains on the existing backend. Web Push/VAPID and browser Notification reminders are not native Android push; native push requires Firebase configuration, an FCM token path/server sender and a notification permission flow. No claim that background reminders work in this shell. The push hook guards unsupported Notification APIs. |
| Authentication | Email/password uses the same HTTPS origin and Supabase cookies. Cookies are flushed on pause; persistence/expiry/logout need device verification. Chrome and the installed app do not share cookies. Social login is explicitly blocked with an email/password message only in the Android shell; provider OAuth requires external-browser PKCE and a verified app-link/session handoff. Opening OAuth externally alone would leave the session in the browser. Google disallows embedded user-agent OAuth (https://developers.google.com/identity/protocols/oauth2/policies). |
| Back | Android Back navigates WebView history; at the root it backgrounds the task. Keyboard normally consumes Back first. Test Next.js route history and modal flows; dialogs with no history entry are not automatically closed by route Back. |
| Lifecycle | WebView pauses/resumes without reloading the route or clearing auth. OS process death can still lose unsaved exercise state. Test app switching/lock/unlock; camera or audio may need to be restarted from existing controls. No automatic background sensor service is introduced. |
| Safe areas and bars | Native parent padding keeps the whole responsive WebView inside system bars/cutouts, including landscape. Built-in SystemBars CSS injection is disabled to avoid competing inset strategies. No website CSS or layout changes. |
| Keyboard | adjustResize plus native IME insets keeps forms above the keyboard. Test sign-in, chat and long forms with gesture and three-button navigation. |
| Splash/offline | Standard native launch splash remains. A bundled connection-error page appears on failed remote loads; close/reopen to retry. The app needs connectivity; an existing optional service worker is not an offline app guarantee. |
| Downloads/external links | Test export/download, share, payment and new-window flows. Desktop Blob downloads and provider windows can differ in WebView; no filesystem/share/payment plugins are added. |

## Files changed

- package.json: Capacitor dependencies and CLI/TypeScript development dependencies.
- pnpm-lock.yaml: reproducible dependency resolution.
- .gitignore: track root Android source, exclude signing keys.
- capacitor.config.ts: Android identity, hosted URL validation, shell webDir, HTTPS and native inset configuration.
- capacitor-web/index.html: minimal required bundled index.
- capacitor-web/offline.html: bundled connection failure page.
- apps/web/src/lib/auth-client.ts: Android-only social sign-in guard; browser auth and email/password unchanged.
- apps/web/src/hooks/use-push-subscription.ts: guard missing Notification API.
- docs/android.md: architecture, commands, signing, audit and verification.
- android/: generated by cap add android: Gradle build/settings/wrapper, app build/proguard, Capacitor integration, manifests, resource layout/themes/strings/file provider, default launcher and splash assets, sample tests and ignore files. MainActivity.java adds native insets, keyboard, Back and lifecycle/cookie handling; AndroidManifest.xml adds permissions, optional hardware, resize and HTTPS/backup policy. The companion android-files.txt lists every generated source file individually.

Pre-existing/concurrent changes to analyzer, tasks page/router and muscle map were not part of this integration.

Additional file details: apps/web/src/components/auth/login-dialog.tsx displays returned social-auth errors and resets loading so the Android guidance is visible. The generated ExampleInstrumentedTest.java package assertion is updated to com.fitnmove.app. docs/android-files.txt is the complete generated-file inventory.

## Verification on this machine

- npx cap add android: passed.
- npx cap sync android: passed, with the configured Vercel URL and bundled error page.
- Capacitor config TypeScript check and URL-validation assertions: passed.
- Full web TypeScript check (tsc --noEmit --incremental false): passed.
- Android manifest XML parse and git diff --check: passed.
- npx cap open android: attempted; reported Android Studio missing. This CLI printed an error despite returning exit code zero.
- Android APK/AAB compilation and physical-device checks: not run; only Java 8 was detected and Android Studio/SDK were absent. Install the toolchain above before claiming a tested Android release.
- npm run build under pinned pnpm 10.11.0: passed (exit 0, 7m23s). Existing Sentry warnings and dynamic-cookie route diagnostics were emitted. Turbo also reported a Windows long-link-name warning while caching standalone output; the build itself succeeded. The initial unpinned invocation failed because this environment's fallback pnpm 11 conflicts with the repository's pnpm 10 installation.
