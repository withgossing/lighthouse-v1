import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Users, AlertCircle, CheckCircle2, PlusCircle } from "lucide-react";
import { getDashboardMetrics, getDashboardTickets } from "@/lib/data/dashboard";
import { TicketDataTable } from "@/components/dashboard/ticket-data-table";
import { Button } from "@/components/ui/button";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
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
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">대시보드 개요</h1>
                <Link href="/tickets/new" className="mt-4 sm:mt-0">
                    <Button className="flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        새 티켓 작성
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">전체 티켓</CardTitle>
                        <Ticket className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.total}</div>
                        <p className="text-xs text-slate-500">시스템에 등록된 전체 티켓 수</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">처리 대기/진행 중</CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{metrics.open}</div>
                        <p className="text-xs text-slate-500">해결 대기 중인 티켓 수</p>
                    </CardContent>
                </Card>

                {metrics.isAdmin && (
                    <Card className="border-red-200 dark:border-red-900/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">미배정 티켓</CardTitle>
                            <Users className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{metrics.unassigned}</div>
                            <p className="text-xs text-red-500/80">IT 관리자 담당자 배정 필요</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">오늘 해결됨</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-500">{metrics.resolvedToday}</div>
                        <p className="text-xs text-slate-500">오늘 처리 완료된 티켓 수</p>
                    </CardContent>
                </Card>
            </div>

            {/* Advanced Analytics Charts (CSR) */}
            <AnalyticsCharts />

            {/* Real Datatable */}
            <Card className="mt-6 border shadow-sm">
                <CardHeader className="pb-2 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                    <CardTitle>최근 티켓 현황</CardTitle>
                    <CardDescription>
                        {metrics.isAdmin ? "시스템의 모든 권한을 가진 티켓 목록입니다." : "내가 등록한 티켓들의 처리 상태입니다."}
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
