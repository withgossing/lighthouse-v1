"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, TicketIcon, Users, Settings, LogOut, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    role: "ADMIN" | "USER";
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const navigation = [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "My Tickets", href: "/tickets?filter=me", icon: TicketIcon },
        // Only show admin tools if user is ADMIN
        ...(role === "ADMIN" ? [
            { name: "All Tickets", href: "/admin/tickets", icon: TicketIcon },
            { name: "User Management", href: "/admin/users", icon: Users },
            { name: "Settings", href: "/admin/settings", icon: Settings },
        ] : []),
    ];

    return (
        <div className="flex flex-col flex-grow border-r bg-white dark:bg-slate-900 pt-5 pb-4 overflow-y-auto w-full h-full shadow-sm">
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <ShieldAlert className="w-8 h-8 text-primary" />
                <span className="ml-2 text-xl font-bold tracking-tight">Lighthouse</span>
            </div>

            <div className="mt-5 flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1 bg-white dark:bg-slate-900" aria-label="Sidebar">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    isActive
                                        ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        isActive ? "text-slate-500 dark:text-slate-300" : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300",
                                        "mr-3 flex-shrink-0 h-5 w-5"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Logout button typically handled by Header, but can have a hook here */}
            <div className="px-4 pb-2 border-t pt-4">
                <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                    Role: <span className="ml-2 badge bg-primary/10 text-primary px-2 py-1 rounded-sm text-xs font-bold">{role}</span>
                </div>
            </div>
        </div>
    );
}
