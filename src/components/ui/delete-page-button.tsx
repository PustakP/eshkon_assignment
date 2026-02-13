"use client";

import { Trash2 } from "lucide-react";
import { deletePage } from "@/lib/actions/pages";
import { useRouter } from "next/navigation";
import { useState } from "react";

// delete page btn w/ confirmation
export function DeletePageButton({ pageId }: { pageId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    setLoading(true);
    try {
      await deletePage(pageId);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1 border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={12} />
      {loading ? "..." : "Delete"}
    </button>
  );
}
