import Link from "next/link";
import LogoutButton from "@/app/components/layout/logout-button";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome to DevTrack</h1>

            <p className="mt-3 text-slate-400">
              Your personal learning and project tracker.
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/goals"
            className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
          >
            <h2 className="text-xl font-semibold">Learning Goals</h2>
            <p className="mt-2 text-sm text-slate-400">
              Manage your learning goals.
            </p>
          </Link>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Daily Progress</h2>
            <p className="mt-2 text-sm text-slate-400">
              Track your daily learning progress.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Projects</h2>
            <p className="mt-2 text-sm text-slate-400">
              Track your project progress.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
