
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoutButton from "@/app/components/layout/logout-button";
import { getMe, type AuthUser } from "@/lib/api/auth";
import {
  getDashboardOverview,
  type DashboardOverview,
} from "@/lib/api/dashboard";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [currentUser, dashboardData] = await Promise.all([
          getMe(),
          getDashboardOverview(),
        ]);

        setUser(currentUser);
        setOverview(dashboardData);
      } catch (err) {
        if (err instanceof Error && err.message === "Unauthorized") {
          router.replace("/login");
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading dashboard...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      title: "Learning Goals",
      total: overview?.goals.total ?? 0,
      completed: overview?.goals.completed ?? 0,
      pending: overview?.goals.pending ?? 0,
      href: "/goals",
    },
    {
      title: "Daily Tasks",
      total: overview?.tasks.total ?? 0,
      completed: overview?.tasks.completed ?? 0,
      pending: overview?.tasks.pending ?? 0,
      href: "/tasks",
    },
    {
      title: "Projects",
      total: overview?.projects.total ?? 0,
      completed: overview?.projects.completed ?? 0,
      pending:
        (overview?.projects.total ?? 0) -
        (overview?.projects.completed ?? 0),
      href: "/projects",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user.name}!
            </h1>

            <p className="mt-3 text-slate-400">{user.email}</p>

            <p className="mt-2 text-slate-400">
              Your personal learning and project tracker.
            </p>
          </div>

          <LogoutButton />
        </div>

        {error && (
          <div className="mt-8 rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mt-10">
          <h2 className="mb-5 text-xl font-semibold">
            Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
              >
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <p className="mt-3 text-4xl font-bold">
                  {card.total}
                </p>

                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-green-400">
                    Completed: {card.completed}
                  </span>

                  <span className="text-amber-400">
                    Pending: {card.pending}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Overall Project Progress
            </h2>

            <span className="text-2xl font-bold text-blue-400">
              {overview?.projects.averageProgress ?? 0}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${overview?.projects.averageProgress ?? 0}%`,
              }}
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Recent Tasks
              </h2>

              <Link
                href="/tasks"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View all
              </Link>
            </div>

            {overview?.recentTasks.length ? (
              <div className="space-y-4">
                {overview.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>

                      {task.dueDate && (
                        <p className="mt-1 text-xs text-slate-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <span
                      className={`text-xs ${
                        task.completed
                          ? "text-green-400"
                          : "text-amber-400"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No tasks yet.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Recent Projects
              </h2>

              <Link
                href="/projects"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View all
              </Link>
            </div>

            {overview?.recentProjects.length ? (
              <div className="space-y-4">
                {overview.recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border-b border-slate-800 pb-3 last:border-0"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">
                        {project.title}
                      </p>

                      <span className="text-xs text-slate-400">
                        {project.status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>

                      <span className="text-xs text-slate-400">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No projects yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
