"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  Task,
  CreateTaskPayload,
  GetTasksParams,
} from "@/lib/api/tasks";
import DateTimePicker from "@/components/ui/date-time-picker";

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const TASKS_PER_PAGE = 5;

  const [formData, setFormData] = useState<CreateTaskPayload>({
    title: "",
    description: "",
    dueDate: "",
  });

  const fetchTasks = useCallback(async () => {
    try {
      const params: GetTasksParams = {
        page: currentPage,
        limit: TASKS_PER_PAGE,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter === "completed") {
        params.completed = true;
      } else if (statusFilter === "pending") {
        params.completed = false;
      }

      const response = await getTasks(params);

      setTasks(response.data);
      setTotalTasks(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router, currentPage, search, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
    });
  }

  function toLocalDateTime(date: string | null) {
    if (!date) return "";

    const localDate = new Date(date);
    const offset = localDate.getTimezoneOffset();

    return new Date(localDate.getTime() - offset * 60 * 1000)
      .toISOString()
      .slice(0, 16);
  }

  function handleEdit(task: Task) {
    setEditingTaskId(task.id);

    setFormData({
      title: task.title,
      description: task.description ?? "",
      dueDate: toLocalDateTime(task.dueDate),
    });

    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: CreateTaskPayload = {
        title: formData.title.trim(),
        description: formData.description?.trim() ?? "",
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : undefined,
      };

      if (editingTaskId !== null) {
        await updateTask(editingTaskId, payload);
        setSuccess("Task updated successfully!");
        resetForm();
        await fetchTasks();
      } else {
        await createTask(payload);
        setSuccess("Task created successfully!");
        resetForm();

        if (currentPage !== 1) {
          setCurrentPage(1);
        } else {
          await fetchTasks();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task: Task) {
    setError("");
    setSuccess("");

    try {
      await updateTask(task.id, {
        completed: !task.completed,
      });

      setSuccess("Task status updated successfully!");

      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  }

  function handleDelete(id: number) {
    setDeletingTaskId(id);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (deletingTaskId === null) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      await deleteTask(deletingTaskId);

      setShowDeleteModal(false);
      setDeletingTaskId(null);
      setSuccess("Task deleted successfully!");

      const remainingTasks = totalTasks - 1;
      const newTotalPages = Math.ceil(remainingTasks / TASKS_PER_PAGE);

      if (newTotalPages > 0 && currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      } else {
        await fetchTasks();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setDeleting(false);
    }
  }

  function formatDueDate(date: string | null) {
    if (!date) return "No due date";

    return new Date(date).toLocaleString();
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">Loading tasks...</div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold">Daily Tasks</h1>

        <p className="mb-8 text-gray-400">
          Organize your daily work and track your task progress.
        </p>

        {/* Task Form */}
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-5 text-xl font-semibold">
            {editingTaskId !== null ? "Edit Task" : "Create New Task"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium">
                Task Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Complete NestJS module"
                required
                maxLength={200}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your task..."
                rows={3}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/*  <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block text-sm font-medium"
              >
                Due Date & Time
              </label>

              <input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div> */}
            <DateTimePicker
              id="dueDate"
              label="Due Date & Time"
              value={formData.dueDate ?? ""}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  dueDate: value,
                }))
              }
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingTaskId !== null
                    ? "Save Changes"
                    : "Create Task"}
              </button>

              {editingTaskId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-gray-700 px-4 py-3 text-sm text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-400">{success}</p>}
        </section>

        {/* Search and Filter */}
        <section className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="taskSearch"
                className="mb-2 block text-sm font-medium"
              >
                Search Tasks
              </label>
              <input
                id="taskSearch"
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by title or description..."
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="taskStatus"
                className="mb-2 block text-sm font-medium"
              >
                Filter by Status
              </label>
              <select
                id="taskStatus"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </section>

        {/* Tasks List */}
        <section>
          <h2 className="mb-5 text-xl font-semibold">
            Your Tasks ({totalTasks})
          </h2>

          {tasks.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
              <p className="text-gray-400">
                No tasks found. Create your first task!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold">{task.title}</h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        task.completed
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    {task.description || "No description provided"}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    Due: {formatDueDate(task.dueDate)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(task)}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      {task.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEdit(task)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    Task ID: {task.id}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                Showing {tasks.length} of {totalTasks} tasks
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="rounded-lg bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="rounded-lg bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl"
          >
            <h2
              id="delete-modal-title"
              className="mb-2 text-xl font-bold text-white"
            >
              Delete Task?
            </h2>

            <p className="mb-6 text-sm leading-6 text-gray-400">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingTaskId(null);
                }}
                className="rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
