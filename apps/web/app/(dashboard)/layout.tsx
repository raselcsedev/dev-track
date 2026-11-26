import Link from "next/link";
import LogoutButton from "@/app/components/layout/logout-button";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-500">
            DevTrack
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-gray-300 transition hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/goals"
              className="text-sm text-gray-300 transition hover:text-white"
            >
              Goals
            </Link>

            <Link
              href="/tasks"
              className="text-sm text-gray-300 transition hover:text-white"
            >
              Tasks
            </Link>

            <LogoutButton />
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
