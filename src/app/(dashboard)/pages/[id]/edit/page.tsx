import { createServerSupabase } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { canPerform } from "@/lib/rbac/permissions";
import type { Page, Profile, Block } from "@/types";
import { BlockEditor } from "@/components/builder/block-editor";
import { PublishControls } from "@/components/ui/publish-controls";
import { PageTitleEditor } from "@/components/ui/page-title-editor";
import Link from "next/link";
import { Eye } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

// page editor - builder + publish controls (editor+)
export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");
  const typedProfile = profile as Profile;

  // server-side permission check
  if (!canPerform(typedProfile.role, "page:edit")) {
    redirect("/pages");
  }

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();

  if (!page) notFound();
  const typedPage = page as Page;

  const canPublish = canPerform(typedProfile.role, "page:publish");

  return (
    <div className="mx-auto max-w-4xl">
      {/* top bar */}
      <div className="mb-6 flex items-center justify-between">
        <PageTitleEditor pageId={typedPage.id} initialTitle={typedPage.title} />
        <div className="flex items-center gap-2">
          <Link
            href={`/pages/${typedPage.id}/preview`}
            className="flex items-center gap-1 border border-gray-300 px-3 py-1.5 text-sm text-muted hover:bg-beige"
          >
            <Eye size={14} />
            Preview
          </Link>
          {canPublish && (
            <PublishControls pageId={typedPage.id} status={typedPage.status} />
          )}
        </div>
      </div>

      {/* status badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-2 py-0.5 text-xs font-medium ${
            typedPage.status === "published"
              ? "bg-mint text-gray-700"
              : "bg-beige text-muted"
          }`}
        >
          {typedPage.status}
        </span>
        <span className="ml-2 text-xs text-muted">/{typedPage.slug}</span>
      </div>

      {/* block editor */}
      <BlockEditor
        pageId={typedPage.id}
        initialBlocks={(typedPage.content ?? []) as Block[]}
      />
    </div>
  );
}
