
import Link from "next/link";

const features = [
  {
    title: "Learning Goals",
    description:
      "Create and manage your personal learning goals.",
    icon: "🎯",
  },
  {
    title: "Daily Progress",
    description:
      "Track your daily tasks and monitor your progress.",
    icon: "📅",
  },
  {
    title: "Project Tracking",
    description:
      "Organize projects and keep track of your milestones.",
    icon: "🚀",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          DevTrack<span className="text-blue-500">.</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
          Personal Learning & Project Tracker
        </span>

        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Turn Your Learning Journey Into{" "}
          <span className="text-blue-500">Real Progress.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Set learning goals, manage daily tasks, track projects,
          and build consistent habits with DevTrack.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold transition hover:bg-blue-500"
          >
            Start Tracking
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-slate-700 px-8 py-3 font-semibold transition hover:border-slate-500 hover:bg-slate-900"
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-blue-500/50"
          >
            <div className="mb-5 text-4xl">{feature.icon}</div>

            <h2 className="text-xl font-semibold">
              {feature.title}
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              {feature.description}
            </p>
          </article>
        ))}
      </section>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 DevTrack. Built for continuous learning.
      </footer>
    </main>
  );
}
