// auth layout - centered card on beige bg
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-beige p-4">
      <div className="w-full max-w-md bg-surface p-8 shadow-lg">
        {children}
      </div>
    </div>
  );
}
