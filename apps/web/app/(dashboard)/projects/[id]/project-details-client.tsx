
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  createMilestone,
  deleteMilestone,
  getMilestones,
  getProject,
  Milestone,
  MilestoneStatus,
  Project,
  updateMilestone,
} from "@/lib/api/projects";

interface ProjectDetailsClientProps {
  projectId: number;
}

interface MilestoneFormData {
  title: string;
  description: string;
  status: MilestoneStatus;
  dueDate: string;
}

const initialFormData: MilestoneFormData = {
  title: "",
  description: "",
  status: "PENDING",
  dueDate: "",
};

const milestoneStatusOptions: {
  value: MilestoneStatus;
  label: string;
}[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

function toLocalDate(date: string | null) {
  if (!date) return "";

  const parsed = new Date(date);

  return [
    parsed.getFullYear(),
    String(parsed.getMonth() + 1).padStart(2, "0"),
    String(parsed.getDate()).padStart(2, "0"),
  ].join("-");
}

function toISOString(date: string) {
  return date
    ? new Date(`${date}T00:00:00`).toISOString()
    : null;
}

function getStatusStyle(status: MilestoneStatus) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-950 text-green-300";
    case "IN_PROGRESS":
      return "bg-blue-950 text-blue-300";
    default:
      return "bg-yellow-950 text-yellow-300";
  }
}

export default function ProjectDetailsClient({
  projectId,
}: ProjectDetailsClientProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [formData, setFormData] =
    useState<MilestoneFormData>(initialFormData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editingMilestoneId, setEditingMilestoneId] =
    useState<number | null>(null);

  const [deletingMilestoneId, setDeletingMilestoneId] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProjectData = useCallback(async () => {
    try {
      setError("");

      const [projectData, milestoneData] = await Promise.all([
        getProject(projectId),
        getMilestones(projectId),
      ]);

      setProject(projectData);
      setMilestones(milestoneData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load project",
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!Number.isInteger(projectId) || projectId <= 0) {
      setError("Invalid project ID");
      setLoading(false);
      return;
    }

    void fetchProjectData();
  }, [projectId, fetchProjectData]);

  function resetForm() {
    setFormData(initialFormData);
    setEditingMilestoneId(null);
  }

  function handleEdit(milestone: Milestone) {
    setEditingMilestoneId(milestone.id);

    setFormData({
      title: milestone.title,
      description: milestone.description ?? "",
      status: milestone.status,
      dueDate: toLocalDate(milestone.dueDate),
    });

    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = formData.title.trim();

    if (!title) {
      setError("Milestone title is required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title,
        description: formData.description.trim(),
        status: formData.status,
        dueDate: toISOString(formData.dueDate),
      };

      if (editingMilestoneId !== null) {
        await updateMilestone(projectId, editingMilestoneId, payload);
        setSuccess("Milestone updated successfully");
      } else {
        await createMilestone(projectId, {
          title: payload.title,
          description: payload.description,
          status: payload.status,
          ...(formData.dueDate
            ? { dueDate: toISOString(formData.dueDate)! }
            : {}),
        });

        setSuccess("Milestone created successfully");
      }

      resetForm();
      await fetchProjectData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deletingMilestoneId === null) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      await deleteMilestone(projectId, deletingMilestoneId);

      setDeletingMilestoneId(null);
      setSuccess("Milestone deleted successfully");

      if (editingMilestoneId === deletingMilestoneId) {
        resetForm();
      }

      await fetchProjectData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete milestone",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleStatusChange(
    milestone: Milestone,
    status: MilestoneStatus,
  ) {
    setError("");
    setSuccess("");

    try {
      await updateMilestone(projectId, milestone.id, { status });
      setSuccess("Milestone status updated");
      await fetchProjectData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update status",
      );
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 text-center text-gray-400">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-red-300">{error || "Project not found"}</p>

        <Link
          href="/projects"
          className="mt-4 inline-block text-blue-400 hover:text-blue-300"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const completedCount = milestones.filter(
    (milestone) => milestone.status === "COMPLETED",
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/projects"
        className="mb-6 inline-block text-sm text-blue-400 hover:text-blue-300"
      >
        ← Back to Projects
      </Link>

      <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="wrap-break-word text-3xl font-bold">
              {project.title}
            </h1>

            {project.description && (
              <p className="mt-3 whitespace-pre-wrap text-gray-400">
                {project.description}
              </p>
            )}
          </div>

          <span className="rounded-full bg-blue-950 px-3 py-1 text-xs text-blue-300">
            {project.status.replaceAll("_", " ")}
          </span>
        </div>

        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-400">Project Progress</span>
          <span className="font-medium text-blue-400">
            {project.progress}%
          </span>
        </div>

        <div
          className="h-3 overflow-hidden rounded-full bg-gray-700"
          role="progressbar"
          aria-label="Project progress"
          aria-valuenow={project.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-400">
          <span>
            Start: {toLocalDate(project.startDate) || "Not set"}
          </span>
          <span>
            End: {toLocalDate(project.endDate) || "Not set"}
          </span>
        </div>
      </section>

      {error && (
        <div className="mb-5 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-800 bg-green-950/40 p-3 text-sm text-green-300">
          {success}
        </div>
      )}

      <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editingMilestoneId !== null
              ? "Edit Milestone"
              : "Create Milestone"}
          </h2>

          {editingMilestoneId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-400 hover:text-white"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="milestone-title"
              className="mb-2 block text-sm text-gray-300"
            >
              Milestone Title *
            </label>

            <input
              id="milestone-title"
              type="text"
              required
              maxLength={200}
              value={formData.title}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              placeholder="e.g. Complete authentication module"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="milestone-description"
              className="mb-2 block text-sm text-gray-300"
            >
              Description
            </label>

            <textarea
              id="milestone-description"
              rows={3}
              maxLength={1000}
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Describe this milestone..."
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="milestone-status"
                className="mb-2 block text-sm text-gray-300"
              >
                Status
              </label>

              <select
                id="milestone-status"
                value={formData.status}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: event.target.value as MilestoneStatus,
                  }))
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                {milestoneStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="milestone-due-date"
                className="mb-2 block text-sm text-gray-300"
              >
                Due Date
              </label>

              <input
                id="milestone-due-date"
                type="date"
                value={formData.dueDate}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    dueDate: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingMilestoneId !== null
                ? "Update Milestone"
                : "Create Milestone"}
          </button>
        </form>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Milestones</h2>

          <span className="text-sm text-gray-400">
            {completedCount} / {milestones.length} completed
          </span>
        </div>

        {milestones.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 p-10 text-center">
            <p className="text-gray-400">No milestones yet.</p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first milestone using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <article
                key={milestone.id}
                className="rounded-xl border border-gray-800 bg-gray-900 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="wrap-break-word text-lg font-semibold">
                      {milestone.title}
                    </h3>

                    {milestone.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-400">
                        {milestone.description}
                      </p>
                    )}

                    <p className="mt-3 text-xs text-gray-500">
                      Due: {toLocalDate(milestone.dueDate) || "Not set"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${getStatusStyle(milestone.status)}`}
                  >
                    {milestone.status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-800 pt-4">
                  <label
                    htmlFor={`status-${milestone.id}`}
                    className="text-sm text-gray-400"
                  >
                    Status:
                  </label>

                  <select
                    id={`status-${milestone.id}`}
                    value={milestone.status}
                    onChange={(event) =>
                      void handleStatusChange(
                        milestone,
                        event.target.value as MilestoneStatus,
                      )
                    }
                    className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  >
                    {milestoneStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleEdit(milestone)}
                    className="rounded-lg bg-blue-600/20 px-4 py-2 text-sm text-blue-300 hover:bg-blue-600/30"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeletingMilestoneId(milestone.id);
                      setError("");
                    }}
                    className="rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-300 hover:bg-red-600/30"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {deletingMilestoneId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-milestone-title"
            className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6"
          >
            <h2
              id="delete-milestone-title"
              className="text-lg font-semibold"
            >
              Delete Milestone?
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Are you sure you want to delete this milestone? Project progress
              will be recalculated.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeletingMilestoneId(null)}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
