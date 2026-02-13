import Link from "next/link";

// global 404 page
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-beige">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand">404</h1>
        <p className="mt-2 text-muted">Page not found</p>
        <Link
          href="/"
          className="mt-4 inline-block bg-brand px-6 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
