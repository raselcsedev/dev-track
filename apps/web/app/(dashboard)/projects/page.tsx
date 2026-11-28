"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  Project,
  ProjectStatus,
  updateProject,
} from "@/lib/api/projects";
import Link from "next/link";
interface ProjectFormData {
  title: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
}

const initialFormData: ProjectFormData = {
  title: "",
  description: "",
  status: "PLANNED",
  startDate: "",
  endDate: "",
};

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On Hold" },
];

function toLocalDate(date: string | null) {
  if (!date) return "";

  const parsed = new Date(date);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toISOString(date: string) {
  return date ? new Date(`${date}T00:00:00`).toISOString() : null;
}

function getStatusLabel(status: ProjectStatus) {
  return (
    statusOptions.find((option) => option.value === status)?.label ?? status
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(
    null,
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      setError("");
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  function resetForm() {
    setFormData(initialFormData);
    setEditingProjectId(null);
  }

  function handleChange(field: keyof ProjectFormData, value: string | number) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleEdit(project: Project) {
    setEditingProjectId(project.id);

    setFormData({
      title: project.title,
      description: project.description ?? "",
      status: project.status,
      startDate: toLocalDate(project.startDate),
      endDate: toLocalDate(project.endDate),
    });

    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = formData.title.trim();

    if (!title) {
      setError("Project title is required");
      return;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      setError("End date cannot be earlier than start date");
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
        startDate: toISOString(formData.startDate),
        endDate: toISOString(formData.endDate),
      };

      if (editingProjectId !== null) {
        await updateProject(editingProjectId, payload);
        setSuccess("Project updated successfully");
      } else {
        await createProject({
          title: payload.title,
          description: payload.description,
          status: payload.status,
          ...(payload.startDate ? { startDate: payload.startDate } : {}),
          ...(payload.endDate ? { endDate: payload.endDate } : {}),
        });

        setSuccess("Project created successfully");
      }

      resetForm();
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deletingProjectId === null) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      await deleteProject(deletingProjectId);

      setProjects((prev) =>
        prev.filter((project) => project.id !== deletingProjectId),
      );

      if (editingProjectId === deletingProjectId) {
        resetForm();
      }

      setDeletingProjectId(null);
      setSuccess("Project deleted successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="mt-2 text-gray-400">
          Track your projects, status and progress.
        </p>
      </div>

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

      {/* Project Form */}
      <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editingProjectId !== null ? "Edit Project" : "Create New Project"}
          </h2>

          {editingProjectId !== null && (
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
            <label htmlFor="title" className="mb-2 block text-sm text-gray-300">
              Project Title *
            </label>
            <input
              id="title"
              type="text"
              required
              maxLength={200}
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. DevTrack Application"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              maxLength={1000}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your project..."
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm text-gray-300"
              >
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  handleChange("status", e.target.value as ProjectStatus)
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm text-gray-300"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm text-gray-300"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                min={formData.startDate || undefined}
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
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
              : editingProjectId !== null
                ? "Update Project"
                : "Create Project"}
          </button>
        </form>
      </section>

      {/* Project List */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <span className="text-sm text-gray-400">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </div>

        {loading && projects.length === 0 ? (
          <p className="py-8 text-center text-gray-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 p-10 text-center">
            <p className="text-gray-400">No projects yet.</p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first project using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-xl border border-gray-800 bg-gray-900 p-5"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold break-words">
                    {project.title}
                  </h3>

                  <span className="shrink-0 rounded-full bg-blue-950 px-3 py-1 text-xs text-blue-300">
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                {project.description && (
                  <p className="mb-4 whitespace-pre-wrap text-sm text-gray-400">
                    {project.description}
                  </p>
                )}

                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-medium text-blue-400">
                    {project.progress}%
                  </span>
                </div>

                <div
                  className="mb-5 h-2 overflow-hidden rounded-full bg-gray-700"
                  role="progressbar"
                  aria-label={`${project.title} progress`}
                  aria-valuenow={project.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="mb-5 space-y-1 text-xs text-gray-500">
                  <p>
                    Start:{" "}
                    {project.startDate
                      ? toLocalDate(project.startDate)
                      : "Not set"}
                  </p>
                  <p>
                    End:{" "}
                    {project.endDate ? toLocalDate(project.endDate) : "Not set"}
                  </p>
                </div>

                <div className="flex gap-3 border-t border-gray-800 pt-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-600"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="rounded-lg bg-blue-600/20 px-4 py-2 text-sm text-blue-300 transition hover:bg-blue-600/30"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeletingProjectId(project.id);
                      setError("");
                    }}
                    className="rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-600/30"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation */}
      {deletingProjectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6"
          >
            <h2 id="delete-project-title" className="text-lg font-semibold">
              Delete Project?
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeletingProjectId(null)}
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
