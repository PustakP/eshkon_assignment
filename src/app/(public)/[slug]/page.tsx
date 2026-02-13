import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Page, Block } from "@/types";
import { ReadOnlyBlockRenderer } from "@/components/builder/read-only-block-renderer";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

// public page - renders published page by slug (no auth required)
export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!page) notFound();
  const typedPage = page as Page;
  const blocks = (typedPage.content ?? []) as Block[];

  return (
    <div className="min-h-screen bg-beige">
      {/* minimal header */}
      <header className="border-b border-beige-dark bg-surface px-6 py-3">
        <Link href="/" className="text-sm font-bold text-brand">
          Eshkon
        </Link>
      </header>

      {/* page content */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        <article className="bg-surface p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold">{typedPage.title}</h1>
          {typedPage.published_at && (
            <p className="mb-6 text-xs text-muted">
              Published {new Date(typedPage.published_at).toLocaleDateString()}
            </p>
          )}

          {blocks.length === 0 ? (
            <p className="text-muted">This page has no content.</p>
          ) : (
            blocks.map((block) => (
              <ReadOnlyBlockRenderer key={block.id} block={block} />
            ))
          )}
        </article>
      </main>
    </div>
  );
}
