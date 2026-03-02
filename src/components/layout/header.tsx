"use client";

import { Bell, Menu, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface HeaderProps {
    role: "ADMIN" | "USER";
}

export default function Header({ role }: HeaderProps) {
    const router = useRouter();

    const handleLogout = () => {
        // Very simple mock logout (clears cookie by expiring it)
        document.cookie = "lighthouse_mock_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-slate-900 border-b border-border shadow-sm">
            {/* Mobile menu button */}
            <button
                type="button"
                className="px-4 border-r border-border text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden hover:bg-slate-50"
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex-1 px-4 flex justify-between">
                <div className="flex-1 flex items-center">
                    {/* Can put page title or search bar here */}
                </div>

                <div className="ml-4 flex items-center md:ml-6 gap-2">

                    <Button variant="ghost" size="icon" className="relative">
                        <span className="sr-only">View notifications</span>
                        <Bell className="h-5 w-5 text-slate-500" aria-hidden="true" />
                        <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                    </Button>

                    {/* Profile dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2 max-w-[150px]">
                                <UserCircle className="h-6 w-6 text-slate-400" />
                                <span className="text-sm font-medium truncate hidden sm:block">
                                    {role === "ADMIN" ? "Admin User" : "Employee"}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
