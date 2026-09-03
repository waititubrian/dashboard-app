"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
  { href: "/users", label: "Users" },
  { href: "/revenue", label: "Revenue" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center gap-1 px-8 py-4">
        <span className="mr-6 text-sm font-semibold tracking-tight">
          Bizna Ops
        </span>

        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
