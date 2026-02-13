"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { withPermission } from "@/lib/rbac/with-permission";
import type { Profile, Block } from "@/types";
import { revalidatePath } from "next/cache";

// helper - slugify title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// create a new page (editor+)
export const createPage = withPermission(
  "page:create",
  async (profile: Profile, title: string) => {
    const supabase = await createServerSupabase();
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;

    const { data, error } = await supabase
      .from("pages")
      .insert({
        title,
        slug,
        status: "draft",
        content: [],
        author_id: profile.id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath("/pages");
    return data;
  }
);

// update page content (editor+ for own, admin+ for any)
export const updatePageContent = withPermission(
  "page:edit",
  async (_profile: Profile, pageId: string, content: Block[]) => {
    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from("pages")
      .update({ content })
      .eq("id", pageId);

    if (error) throw new Error(error.message);

    revalidatePath("/pages");
    revalidatePath(`/pages/${pageId}/edit`);
    return { success: true };
  }
);

// update page title (editor+)
export const updatePageTitle = withPermission(
  "page:edit",
  async (_profile: Profile, pageId: string, title: string) => {
    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from("pages")
      .update({ title })
      .eq("id", pageId);

    if (error) throw new Error(error.message);

    revalidatePath("/pages");
    return { success: true };
  }
);

// publish page (admin+)
export const publishPage = withPermission(
  "page:publish",
  async (profile: Profile, pageId: string) => {
    const supabase = await createServerSupabase();

    // get current content for version snapshot
    const { data: page } = await supabase
      .from("pages")
      .select("content")
      .eq("id", pageId)
      .single();

    if (!page) throw new Error("page not found");

    // get latest version number
    const { data: versions } = await supabase
      .from("page_versions")
      .select("version")
      .eq("page_id", pageId)
      .order("version", { ascending: false })
      .limit(1);

    const nextVersion = (versions?.[0]?.version ?? 0) + 1;

    // create version snapshot
    await supabase.from("page_versions").insert({
      page_id: pageId,
      content: page.content,
      version: nextVersion,
      created_by: profile.id,
    });

    // update status
    const { error } = await supabase
      .from("pages")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", pageId);

    if (error) throw new Error(error.message);

    revalidatePath("/pages");
    return { success: true };
  }
);

// unpublish page (admin+)
export const unpublishPage = withPermission(
  "page:unpublish",
  async (_profile: Profile, pageId: string) => {
    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from("pages")
      .update({ status: "draft", published_at: null })
      .eq("id", pageId);

    if (error) throw new Error(error.message);

    revalidatePath("/pages");
    return { success: true };
  }
);

// delete page (admin+)
export const deletePage = withPermission(
  "page:delete",
  async (_profile: Profile, pageId: string) => {
    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("id", pageId);

    if (error) throw new Error(error.message);

    revalidatePath("/pages");
    return { success: true };
  }
);
