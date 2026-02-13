"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Users, Settings, LayoutDashboard } from "lucide-react";
import type { Role } from "@/types";
import { canPerform } from "@/lib/rbac/permissions";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiredAction?: Parameters<typeof canPerform>[1];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Pages",
    href: "/pages",
    icon: <FileText size={18} />,
    requiredAction: "page:view_published",
  },
  {
    label: "Users",
    href: "/users",
    icon: <Users size={18} />,
    requiredAction: "user:list",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings size={18} />,
    requiredAction: "settings:view",
  },
];

// sidebar nav - filtered by user role
export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.requiredAction || canPerform(role, item.requiredAction)
  );

  return (
    <aside className="flex h-full w-56 flex-col border-r border-beige-dark bg-surface">
      {/* logo */}
      <div className="flex items-center gap-2 border-b border-beige-dark px-4 py-4">
        <LayoutDashboard size={20} className="text-brand" />
        <span className="text-sm font-bold text-brand">Eshkon</span>
      </div>

      {/* nav links */}
      <nav className="flex-1 p-2">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand text-white"
                  : "text-gray-600 hover:bg-beige"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* role badge */}
      <div className="border-t border-beige-dark p-3">
        <span className="inline-block bg-mint px-2 py-1 text-xs font-medium text-gray-700">
          {role.replace("_", " ")}
        </span>
      </div>
    </aside>
  );
}
