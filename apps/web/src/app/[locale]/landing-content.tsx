"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Lock,
  Route,
  Salad,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
  Trophy,
  Waves,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnailUrl: string | null;
  tags: string[] | null;
  videoPublishedAt: Date | null;
  createdAt: Date;
}

const primaryActions = [
  {
    href: "/hub/workout",
    title: "Train",
    body: "Build strength sessions, follow guided sets, and keep every rep accountable.",
    icon: Dumbbell,
  },
  {
    href: "/hub/track",
    title: "Move",
    body: "Track walks, runs, mobility, hydration, and the daily rhythm that keeps you going.",
    icon: Route,
  },
  {
    href: "/hub/tasks",
    title: "Compete",
    body: "Turn consistency into points, ranks, daily tasks, and leaderboard momentum.",
    icon: Trophy,
  },
];

const rhythmRows = [
  ["Train", "42m", "Strong"],
  ["Move", "6.4k", "On pace"],
  ["Compete", "+180", "Rank up"],
];

const learnTiles = [
  {
    title: "What changed today?",
    summary: "See the few signals that matter without sorting through a full dashboard.",
  },
  {
    title: "What should I eat next?",
    summary: "Use your recent meals to make the next plate a little easier to balance.",
  },
  {
    title: "What does this report mean?",
    summary: "Turn dense health language into careful, readable explanations.",
  },
];

function ProductStage() {
  return (
    <div className="relative mx-auto w-full max-w-[370px] lg:max-w-[350px]">
      <div className="absolute left-1/2 top-10 h-[84%] w-[72%] -translate-x-1/2 rounded-full border border-primary/15" />
      <div className="absolute left-1/2 top-16 h-[70%] w-[58%] -translate-x-1/2 rounded-full border border-[#3976b9]/15" />
      <div className="landing-phone relative mx-auto overflow-hidden rounded-[28px] border border-[#1A4D40] bg-[#041A15] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-[22px] bg-[#041A15]">
          <video src="/images/introvid.mp4" autoPlay muted loop playsInline preload="auto" className="h-full w-full object-cover" aria-label="FitNMove introduction" />
          {/* Decorative mobile UI is intentionally omitted: this panel is the intro video only. */}
          <div className="hidden">
          <div className="relative px-5 pb-5 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-[#35D39A]">FitNMove</p>
                <h2 className="mt-1 text-2xl font-semibold leading-tight text-[#F4F8F5]">Train. Move. Compete.</h2>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#B8F34A] text-[#041A15]">
                <HeartPulse className="h-5 w-5" strokeWidth={1.8} />
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-[#1A4D40] bg-[#0B2C24]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#041A15]">
                <video src="/images/introvid.mp4" autoPlay muted loop playsInline preload="auto" className="h-full w-full object-cover" aria-label="FitNMove introduction" />
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  {["Train", "Move", "Compete"].map((item) => (
                    <span key={item} className="rounded-lg bg-[#041A15]/82 px-2 py-2 text-center text-xs font-black text-[#B8F34A] shadow-sm backdrop-blur">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {rhythmRows.map(([label, value, status], index) => (
                <div
                  key={label}
                  className="landing-row flex items-center justify-between rounded-lg border border-[#1A4D40] bg-[#0B2C24] px-3 py-2.5"
                  style={{ animationDelay: `${220 + index * 120}ms` }}
                >
                  <span className="text-sm font-medium text-[#C0D1CA]">{label}</span>
                  <span className="text-sm font-semibold text-[#F4F8F5]">{value}</span>
                  <span className="text-xs font-semibold text-[#B8F34A]">{status}</span>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate px-4 pb-16 pt-24 sm:px-6 lg:pb-24 lg:pt-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[680px] bg-[radial-gradient(circle_at_50%_0%,rgba(184,243,74,0.14),transparent_34%),linear-gradient(180deg,#041A15_0%,#063A2D_54%,rgba(7,37,30,0)_100%)]" />
      <div className="absolute inset-x-0 top-16 -z-10 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

      <div className="mx-auto grid max-w-[1120px] items-center gap-12 lg:grid-cols-[1fr_430px]">
        <div className="landing-hero-copy max-w-3xl px-2 sm:px-0">
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            DISCIPLINE BUILDS A <span className="text-[#8FF5C8]">BRIGHTER YOU.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Train, track progress, and build better habits in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/hub"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-[#C8FA69] active:bg-[#9ED52E]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
            </Link>
            <Link
              href="#features"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#1A4D40] bg-[#0B2C24]/85 px-5 text-sm font-semibold text-[#B8F34A] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-[#16453A]"
            >
              <Camera className="h-4 w-4" strokeWidth={1.8} />
              Watch Preview
            </Link>
          </div>

          <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-4">
            {[
              [Dumbbell, "Track Workouts"],
              [Trophy, "Compete with Others"],
              [HeartPulse, "Build Better Habits"],
              [TrendingUp, "See Real Progress"],
            ].map(([Icon, label]) => (
              <div key={label as string} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10372D] text-[#B8F34A] shadow-sm">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                {label as string}
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs font-semibold text-[#8FAAA0]">Join a growing community — 10K+ people already moving.</p>
        </div>

        <ProductStage />
      </div>
    </section>
  );
}

function ActionGrid() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-3 md:grid-cols-3">
          {primaryActions.map(({ href, title, body, icon: Icon }, index) => (
            <Link
              key={title}
              href={href}
              className="landing-action group rounded-lg border border-[#1A4D40] bg-[#0B2C24]/86 p-5 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-[#B8F34A]/40 hover:bg-[#16453A]"
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturePresentation() {
  const features = [
    ["Workout library", "Follow guided movement clips, build a routine, and keep your next session ready.", "/images/Workoutintro.mp4"],
    ["Muscle map", "See what you have trained and choose the next area to move with purpose.", "/images/Musclemapintro.mp4"],
    ["Progress", "Watch your consistency grow with simple feedback that keeps momentum visible.", "/images/Progresspage.mp4"],
    ["Calorie tracker", "Log meals quickly, understand your intake, and make better choices every day.", "/images/calorietracker.mp4"],
    ["Leaderboard", "Turn consistency into friendly competition and celebrate every milestone.", "/images/leaderboardpagevid.mp4"],
  ];
  return (
    <section id="features" className="px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[900px] space-y-16 lg:space-y-24">
        <h2 className="text-center text-3xl font-semibold text-foreground sm:text-4xl">Features</h2>
        {features.map(([title, description, src], index) => (
          <article key={title} className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${index % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="mx-auto w-full max-w-[270px] overflow-hidden rounded-[30px] border border-[#1A4D40] bg-[#041A15] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
              <div className="aspect-[9/16] overflow-hidden rounded-[23px] bg-[#0B2C24]"><video src={src} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" /></div>
            </div>
            <div className={index % 2 ? "text-center md:text-right" : "text-center md:text-left"}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">FitNMove</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground">{title}</h2>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-muted-foreground md:mx-0 md:inline-block">{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FlowSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Train. Move. Compete.</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            One rhythm for stronger days.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
            FitNMove brings workouts, movement, nutrition, hydration, and rankings into a clear flow you can act on quickly.
          </p>
        </div>

        <div className="relative rounded-lg border border-[#1A4D40] bg-[#0B2C24]/88 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.25)] backdrop-blur sm:p-5">
          <div className="absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-[#35D39A]/10 via-[#B8F34A]/50 to-[#35D39A]/25" />
          <div className="relative grid gap-3 sm:grid-cols-4">
            {[
              [Dumbbell, "Train"],
              [Waves, "Move"],
              [TrendingUp, "Track"],
              [Trophy, "Compete"],
            ].map(([Icon, label], index) => (
              <div
                key={label as string}
                className="landing-step rounded-lg border border-[#1A4D40] bg-[#10372D] p-4 text-center"
                style={{ animationDelay: `${180 + index * 130}ms` }}
              >
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{label as string}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBand() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3 rounded-lg border border-border bg-[#10231d] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-[#65d7bd]">
            <Lock className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <p className="text-sm leading-6 text-white/80">
            Fitness and wellness guidance only. Your data stays personal, and medical claims stay careful.
          </p>
        </div>
        <Link href="/privacy" className="inline-flex items-center gap-2 text-sm font-semibold text-[#9ee7d5]">
          Privacy
          <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
        </Link>
      </div>
    </section>
  );
}

function WorkoutExplainer() {
  const clips = [
    ["Start a workout", "/Workout/workoutclips/Fullbody/jumpingjacks.mp4"],
    ["Build your streak", "/Workout/workoutclips/Fullbody/burpees.mp4"],
    ["Track your progress", "/Workout/workoutclips/Fullbody/highknees.mp4"],
  ];
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-[1120px]">
        <p className="text-xs font-semibold uppercase text-primary">See it in action</p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl">Train. Track. Repeat.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {clips.map(([title, src]) => (
            <article key={title} className="overflow-hidden rounded-2xl border border-[#1A4D40] bg-[#0B2C24]">
              <div className="relative aspect-[9/14] bg-[#10372D]">
                <video src={src} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover opacity-90" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041A15] to-transparent p-4 pt-12">
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearnPreview({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Learn</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground">Plain answers for real days.</h2>
          </div>
          <Link href="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Explore lessons
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {posts.length > 0
            ? posts.slice(0, 3).map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="landing-action overflow-hidden rounded-lg border border-[#1A4D40] bg-[#0B2C24]/86 transition duration-200 hover:-translate-y-1 hover:border-[#B8F34A]/40 hover:bg-[#16453A]"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  {post.thumbnailUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image src={post.thumbnailUrl} alt={post.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.summary}</p>
                  </div>
                </Link>
              ))
            : learnTiles.map((tile, index) => (
                <div
                  key={tile.title}
                  className="landing-action rounded-lg border border-[#1A4D40] bg-[#0B2C24]/86 p-5"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <h3 className="text-base font-semibold leading-snug text-foreground">{tile.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{tile.summary}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="community" className="px-4 pb-10 pt-8 sm:px-6">
      <div className="mx-auto flex max-w-[1120px] flex-col justify-between gap-5 border-t border-border pt-7 sm:flex-row sm:items-center">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
            <HeartPulse className="h-4.5 w-4.5" strokeWidth={1.8} />
          </span>
          <div>
            <p className="font-semibold text-foreground">FitNMove</p>
            <p className="text-sm text-muted-foreground">Train. Move. Compete.</p>
          </div>
        </Link>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
          <Link href="/hub">Hub</Link>
          <Link href="/support">Support</Link>
          <Link href="/privacy">Privacy</Link>
          <a href="https://www.instagram.com/fitnmove.np/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.facebook.com/fitnmove.np" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://www.tiktok.com/@fitnmove.np" target="_blank" rel="noreferrer">TikTok</a>
          <a href="https://www.youtube.com/@FitNMove_np" target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </div>
      <div className="mx-auto mt-5 flex max-w-[1120px] flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Train smarter, move daily, and build momentum with FitNMove.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <a href="tel:+9779803526374" className="hover:text-foreground">+977 9803526374</a>
          <a href="https://wa.me/9779803526374" target="_blank" rel="noreferrer" className="hover:text-foreground">WhatsApp</a>
          <a href="mailto:fitnmovenp@gmail.com" className="hover:text-foreground">fitnmovenp@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}

export function LandingContent({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      <Hero />
      <FlowSection />
      <FeaturePresentation />
      <TrustBand />
      <Footer />
    </>
  );
}
