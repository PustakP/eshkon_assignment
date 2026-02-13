import { createServerSupabase } from "@/lib/supabase/server";
import { canPerform } from "@/lib/rbac/permissions";
import type { Page, Profile } from "@/types";
import Link from "next/link";
import { Plus, Eye, Pencil, Globe } from "lucide-react";
import { redirect } from "next/navigation";
import { DeletePageButton } from "@/components/ui/delete-page-button";

// pages list - shows all pages user can see
export default async function PagesPage() {
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

  // fetch pages based on role
  let query = supabase.from("pages").select("*").order("updated_at", { ascending: false });

  // viewers only see published
  if (typedProfile.role === "viewer") {
    query = query.eq("status", "published");
  }

  const { data: pages } = await query;
  const typedPages = (pages ?? []) as Page[];

  const canCreate = canPerform(typedProfile.role, "page:create");
  const canEdit = canPerform(typedProfile.role, "page:edit");
  const canDelete = canPerform(typedProfile.role, "page:delete");

  return (
    <div>
      {/* header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pages</h1>
        {canCreate && (
          <Link
            href="/pages/new"
            className="flex items-center gap-1 bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            <Plus size={16} />
            New Page
          </Link>
        )}
      </div>

      {/* pages grid */}
      {typedPages.length === 0 ? (
        <div className="bg-surface p-8 text-center text-muted">
          No pages yet.{canCreate && " Create your first page!"}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {typedPages.map((page) => (
            <div
              key={page.id}
              className="flex flex-col justify-between border border-beige-dark bg-surface p-4"
            >
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{page.title}</h2>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium ${
                      page.status === "published"
                        ? "bg-mint text-gray-700"
                        : "bg-beige text-muted"
                    }`}
                  >
                    {page.status}
                  </span>
                </div>
                <p className="text-xs text-muted">/{page.slug}</p>
                <p className="mt-1 text-xs text-muted">
                  Updated {new Date(page.updated_at).toLocaleDateString()}
                </p>
              </div>

              {/* actions */}
              <div className="mt-4 flex gap-2">
                {canEdit && (
                  <Link
                    href={`/pages/${page.id}/edit`}
                    className="flex items-center gap-1 border border-brand px-3 py-1 text-xs text-brand hover:bg-brand hover:text-white"
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>
                )}
                <Link
                  href={`/pages/${page.id}/preview`}
                  className="flex items-center gap-1 border border-gray-300 px-3 py-1 text-xs text-muted hover:bg-beige"
                >
                  <Eye size={12} />
                  Preview
                </Link>
                {page.status === "published" && (
                  <Link
                    href={`/${page.slug}`}
                    className="flex items-center gap-1 border border-mint-dark px-3 py-1 text-xs text-gray-600 hover:bg-mint"
                    target="_blank"
                  >
                    <Globe size={12} />
                    Live
                  </Link>
                )}
                {canDelete && (
                  <DeletePageButton pageId={page.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
