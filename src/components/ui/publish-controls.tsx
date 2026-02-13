"use client";

import { useState } from "react";
import { publishPage, unpublishPage } from "@/lib/actions/pages";
import { useRouter } from "next/navigation";
import { Globe, GlobeLock } from "lucide-react";
import type { PageStatus } from "@/types";

type Props = {
  pageId: string;
  status: PageStatus;
};

// publish/unpublish toggle (admin+)
export function PublishControls({ pageId, status }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    try {
      if (status === "draft") {
        await publishPage(pageId);
      } else {
        await unpublishPage(pageId);
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1 px-4 py-1.5 text-sm font-medium disabled:opacity-50 ${
        status === "draft"
          ? "bg-brand text-white hover:bg-brand-dark"
          : "border border-red-300 text-red-600 hover:bg-red-50"
      }`}
    >
      {status === "draft" ? <Globe size={14} /> : <GlobeLock size={14} />}
      {loading ? "..." : status === "draft" ? "Publish" : "Unpublish"}
    </button>
  );
}
