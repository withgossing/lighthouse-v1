"use client";

import { TicketWithRelations } from "@/lib/data/dashboard";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowRight, Clock } from "lucide-react";

interface TicketDataTableProps {
    tickets: TicketWithRelations[];
    totalCount: number;
    page: number;
    totalPages: number;
}

export function TicketDataTable({ tickets, totalCount, page, totalPages }: TicketDataTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "ALL") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        // Reset to page 1 on filter change
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
            case "IN_PROGRESS": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
            case "RESOLVED": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
            case "CLOSED": return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const currentStatus = searchParams.get("status") || "ALL";

    return (
        <div className="space-y-4">
            {/* Tool bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <Select value={currentStatus} onValueChange={(val) => handleFilterChange("status", val)}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-slate-500">
                    Showing {tickets.length} of {totalCount} tickets
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900">
                        <TableRow>
                            <TableHead className="w-[100px]">Ticket ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <TableHead className="hidden lg:table-cell">Assignee</TableHead>
                            <TableHead className="text-right">Created</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket) => (
                                <TableRow
                                    key={ticket.id}
                                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                                >
                                    <TableCell className="font-medium text-xs text-slate-500">
                                        {ticket.id.slice(0, 8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-slate-900 dark:text-slate-100">{ticket.title}</div>
                                        {/* Mobile-only status badge below title */}
                                        <div className="sm:hidden mt-1">
                                            <Badge className={`${getStatusColor(ticket.status)} border-0 font-normal`}>
                                                {ticket.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge className={`${getStatusColor(ticket.status)} border-0 font-normal`}>
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-sm text-slate-500">
                                        {ticket.category?.name || "Uncategorized"}
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell text-sm">
                                        {ticket.assignee ? (
                                            <span className="text-slate-700 dark:text-slate-300">{ticket.assignee.name}</span>
                                        ) : (
                                            <span className="text-slate-400 italic flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> Unassigned
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right text-sm text-slate-500 whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <ArrowRight className="w-4 h-4 text-slate-400" />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                    >
                        Previous
                    </Button>
                    <div className="text-sm text-slate-500 w-[100px] text-center">
                        Page {page} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
