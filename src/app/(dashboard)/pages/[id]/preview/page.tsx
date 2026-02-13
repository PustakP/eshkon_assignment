import { createServerSupabase } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { canPerform } from "@/lib/rbac/permissions";
import type { Page, Profile, Block } from "@/types";
import { ReadOnlyBlockRenderer } from "@/components/builder/read-only-block-renderer";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

// preview page - read-only render of blocks (editor+)
export default async function PreviewPagePage({ params }: Props) {
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

  if (!canPerform(typedProfile.role, "page:preview")) {
    redirect("/pages");
  }

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();

  if (!page) notFound();
  const typedPage = page as Page;
  const blocks = (typedPage.content ?? []) as Block[];

  return (
    <div className="mx-auto max-w-3xl">
      {/* preview header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/pages"
          className="flex items-center gap-1 text-sm text-muted hover:text-brand"
        >
          <ArrowLeft size={14} />
          Back to pages
        </Link>
        <div className="flex items-center gap-2">
          <span className="bg-brand-light px-2 py-0.5 text-xs font-medium text-brand-dark">
            PREVIEW
          </span>
          {canPerform(typedProfile.role, "page:edit") && (
            <Link
              href={`/pages/${typedPage.id}/edit`}
              className="flex items-center gap-1 border border-brand px-3 py-1 text-sm text-brand hover:bg-brand hover:text-white"
            >
              <Pencil size={12} />
              Edit
            </Link>
          )}
        </div>
      </div>

      {/* page content */}
      <article className="bg-surface p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">{typedPage.title}</h1>
        {blocks.length === 0 ? (
          <p className="text-muted">This page has no content yet.</p>
        ) : (
          blocks.map((block) => (
            <ReadOnlyBlockRenderer key={block.id} block={block} />
          ))
        )}
      </article>
    </div>
  );
}
