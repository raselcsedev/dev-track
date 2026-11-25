"use client";
import { useEffect, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  Goal,
  CreateGoalPayload,
  GoalsMeta,
  GetGoalsParams,
} from "@/lib/api/goals";

export default function GoalsPage() {
  const router = useRouter();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [completedFilter, setCompletedFilter] = useState<
    "all" | "completed" | "in-progress"
  >("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<GoalsMeta | null>(null);
  const [formData, setFormData] = useState<CreateGoalPayload>({
    title: "",
    description: "",
  });

  const fetchGoals = useCallback(async () => {
    setLoading(false);

    try {
      const params: GetGoalsParams = {
        page,
        limit: 5,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (completedFilter !== "all") {
        params.completed = completedFilter === "completed";
      }

      const response = await getGoals(params);

      setGoals(response.data);
      setMeta(response.meta);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load goals");
      }

      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [page, search, completedFilter, router]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleEdit(goal: Goal) {
    setEditingGoalId(goal.id);

    setFormData({
      title: goal.title,
      description: goal.description ?? "",
    });

    setError("");
    setSuccess("");
  }

  function handleDelete(id: number) {
    setDeletingGoalId(id);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (deletingGoalId === null) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      await deleteGoal(deletingGoalId);

      setShowDeleteModal(false);
      setDeletingGoalId(null);

      setSuccess("Goal deleted successfully!");

      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete goal");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      if (editingGoalId !== null) {
        await updateGoal(editingGoalId, formData);
        setSuccess("Goal updated successfully!");
      } else {
        await createGoal(formData);
        setSuccess("Goal created successfully!");
      }

      setFormData({
        title: "",
        description: "",
      });

      setEditingGoalId(null);

      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  if (loading && goals.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">Loading goals...</div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold">Learning Goals</h1>

        <p className="mb-8 text-gray-400">
          Manage your learning goals and track your progress.
        </p>

        {/* Create Goal Form */}
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-5 text-xl font-semibold">
            {editingGoalId !== null ? "Edit Goal" : "Create New Goal"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium">
                Goal Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Learn NestJS"
                required
                maxLength={150}
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
                placeholder="Describe your learning goal..."
                rows={3}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? "Saving..."
                : editingGoalId !== null
                  ? "Save Changes"
                  : "Create Goal"}
            </button>
            {editingGoalId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingGoalId(null);
                  setFormData({
                    title: "",
                    description: "",
                  });
                  setError("");
                  setSuccess("");
                }}
                className="ml-3 rounded-lg bg-gray-700 px-4 py-3 text-sm text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </form>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          {success && <p className="mt-4 text-sm text-green-400">{success}</p>}
        </section>

        {/* Goals List */}
        <section>
          {/* Search & Filter */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Search Goals
              </label>

              <input
                id="search"
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by goal title..."
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Filter by Status
              </label>

              <select
                id="status"
                value={completedFilter}
                onChange={(e) => {
                  setCompletedFilter(
                    e.target.value as "all" | "completed" | "in-progress",
                  );
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="all">All Goals</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>
          <h2 className="mb-5 text-xl font-semibold">
            Your Goals ({goals.length})
          </h2>

          {goals.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
              <p className="text-gray-400">
                No goals found. Create your first learning goal soon!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold">{goal.title}</h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        goal.completed
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {goal.completed ? "Completed" : "In Progress"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    {goal.description || "No description provided"}
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await updateGoal(goal.id, {
                          completed: !goal.completed,
                        });

                        setGoals((prev) =>
                          prev.map((item) =>
                            item.id === goal.id
                              ? { ...item, completed: !item.completed }
                              : item,
                          ),
                        );

                        setSuccess("Goal status updated successfully!");
                        setError("");
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Failed to update goal status",
                        );
                      }
                    }}
                    className="mt-4 mr-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 cursor-pointer"
                  >
                    {goal.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(goal)}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(goal.id)}
                    className="ml-3 mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
                  >
                    Delete
                  </button>
                  <p className="mt-4 text-xs text-gray-500">
                    Goal ID: {goal.id}
                  </p>
                </div>
              ))}
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
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <span className="text-2xl">!</span>
            </div>

            <h2
              id="delete-modal-title"
              className="mb-2 text-xl font-bold text-white"
            >
              Delete Goal?
            </h2>

            <p className="mb-6 text-sm leading-6 text-gray-400">
              Are you sure you want to delete this goal? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingGoalId(null);
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
