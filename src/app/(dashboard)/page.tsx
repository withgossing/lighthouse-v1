import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Users, AlertCircle, CheckCircle2, PlusCircle } from "lucide-react";
import { getDashboardMetrics, getDashboardTickets } from "@/lib/data/dashboard";
import { TicketDataTable } from "@/components/dashboard/ticket-data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function DashboardHome({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const resolvedParams = await searchParams;

    // Parallel fetch: Metrics for cards, and Ticket list for the datatable
    const [metrics, tableData] = await Promise.all([
        getDashboardMetrics(),
        getDashboardTickets(resolvedParams)
    ]);

    if (!metrics) {
        return <div>Failed to load dashboard. Session error.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
                {/* Placeholder for "New Ticket" button later */}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                        <Ticket className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.total}</div>
                        <p className="text-xs text-slate-500">tickets in the system</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open / In Progress</CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{metrics.open}</div>
                        <p className="text-xs text-slate-500">awaiting resolution</p>
                    </CardContent>
                </Card>

                {metrics.isAdmin && (
                    <Card className="border-red-200 dark:border-red-900/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Unassigned</CardTitle>
                            <Users className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{metrics.unassigned}</div>
                            <p className="text-xs text-red-500/80">needs IT admin attention</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-500">{metrics.resolvedToday}</div>
                        <p className="text-xs text-slate-500">tickets completed today</p>
                    </CardContent>
                </Card>
            </div>

            {/* Real Datatable */}
            <Card className="mt-6 border shadow-sm">
                <CardHeader className="pb-2 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                    <CardTitle>Recent Tickets Overview</CardTitle>
                    <CardDescription>
                        {metrics.isAdmin ? "Managing all tickets" : "Managing your submitted tickets"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 p-0 sm:p-6">
                    <TicketDataTable
                        tickets={tableData.tickets}
                        totalCount={tableData.totalCount}
                        page={tableData.page}
                        totalPages={tableData.totalPages}
                    />
                </CardContent>
            </Card>

        </div>
    );
}
