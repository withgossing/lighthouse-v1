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
import { NotificationDropdown } from "@/components/ui/notification-dropdown";

interface HeaderProps {
    role: "ADMIN" | "USER";
}

import { signOut } from "next-auth/react";

export default function Header({ role }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
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
                <span className="sr-only">사이드바 열기</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex-1 px-4 flex justify-between">
                <div className="flex-1 flex items-center">
                    {/* Can put page title or search bar here */}
                </div>

                <div className="ml-4 flex items-center md:ml-6 gap-2">
                    <NotificationDropdown />

                    {/* Profile dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2 max-w-[150px]">
                                <UserCircle className="h-6 w-6 text-slate-400" />
                                <span className="text-sm font-medium truncate hidden sm:block">
                                    {role === "ADMIN" ? "IT 관리자" : "일반 직원"}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>프로필</DropdownMenuItem>
                            <DropdownMenuItem>설정</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                                로그아웃
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
