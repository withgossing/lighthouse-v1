"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Info, AlertTriangle, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    type: "TICKET_CREATED" | "TICKET_ASSIGNED" | "TICKET_STATUS_CHANGED" | "NEW_COMMENT";
    title: string;
    message: string | null;
    isRead: boolean;
    createdAt: string;
    ticketId: string | null;
}

export function NotificationDropdown() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            if (res.ok && data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Option: Implement periodic polling here (e.g., every 30-60 seconds)
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        // Optimistic UI Update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
        } catch (error) {
            toast.error("Failed to mark notification as read");
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" }
            });
            toast.success("모든 알림을 읽음 처리했습니다.");
        } catch (error) {
            toast.error("Failed to update notifications");
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        if (notification.ticketId) {
            router.push(`/tickets/${notification.ticketId}`);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "TICKET_ASSIGNED": return <AlertTriangle className="w-4 h-4 text-orange-500" />;
            case "TICKET_STATUS_CHANGED": return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "NEW_COMMENT": return <MessageSquare className="w-4 h-4 text-blue-500" />;
            default: return <Info className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative focus-visible:ring-0 focus-visible:ring-offset-0">
                    <span className="sr-only">알림 보기</span>
                    <Bell className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 shadow-lg border">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <DropdownMenuLabel className="p-0 font-semibold text-sm">알림</DropdownMenuLabel>
                        {unreadCount > 0 && (
                            <span className="flex items-center justify-center bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-primary hover:text-primary hover:bg-transparent"
                            onClick={markAllAsRead}
                        >
                            모두 읽음표시
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-80">
                    {isLoading && (
                        <div className="flex items-center justify-center p-8 text-sm text-slate-500">
                            로딩 중...
                        </div>
                    )}

                    {!isLoading && notifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                            <Bell className="w-8 h-8 mb-2 text-slate-300 dark:text-slate-600" />
                            <p className="text-sm">현재 새로운 알림이 없습니다.</p>
                        </div>
                    )}

                    {!isLoading && notifications.length > 0 && (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "flex gap-3 p-4 cursor-pointer transition-colors border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800",
                                        !notification.isRead ? "bg-primary/5 dark:bg-primary/10" : ""
                                    )}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="mt-0.5 flex-shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn("text-sm font-semibold truncate", !notification.isRead ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300")}>
                                                {notification.title}
                                            </p>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        {notification.message && (
                                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                                {notification.message}
                                            </p>
                                        )}
                                    </div>
                                    {!notification.isRead && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 shrink-0 text-slate-400 hover:text-primary mt-1"
                                            onClick={(e) => markAsRead(notification.id, e)}
                                            title="읽음 처리"
                                        >
                                            <Check className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
