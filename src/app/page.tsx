import Link from "next/link";

// landing page - redirect to login or dashboard
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-beige">
      <div className="w-full max-w-md space-y-6 bg-surface p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-brand">Eshkon Page Builder</h1>
        <p className="text-muted">
          RBAC-powered page builder with draft, preview, and publish workflows.
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="bg-brand px-6 py-2 font-medium text-white hover:bg-brand-dark"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="border border-brand px-6 py-2 font-medium text-brand hover:bg-brand hover:text-white"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
