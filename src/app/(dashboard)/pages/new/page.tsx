"use client";

import { useState } from "react";
import { createPage } from "@/lib/actions/pages";
import { useRouter } from "next/navigation";

// create new page form (editor+)
export default function NewPagePage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const page = await createPage(title.trim());
      router.push(`/pages/${page.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create page");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">New Page</h1>

      {error && (
        <div className="mb-4 border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Page Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-beige-dark bg-beige px-3 py-2 text-sm focus:border-brand focus:outline-none"
            placeholder="My Awesome Page"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-brand px-6 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Page"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-gray-300 px-6 py-2 text-sm text-muted hover:bg-beige"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
