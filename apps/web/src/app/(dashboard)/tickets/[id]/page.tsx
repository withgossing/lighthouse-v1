import { getTicketById } from "@/lib/data/tickets";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format } from "date-fns";
import { Clock, User, FileIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TicketComments } from "@/components/tickets/ticket-comments";
import { TicketAdminPanel } from "@/components/tickets/ticket-admin-panel";
import { prisma } from "@/lib/prisma";
import { AttachedFile } from "@/components/ui/drag-drop-uploader";

export default async function TicketDetailsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params;
    const data = await getTicketById(resolvedParams.id);

    if (!data) {
        notFound();
    }

    const { ticket, currentUser } = data;

    let itAdmins: { id: string; name: string }[] = [];
    if (currentUser.role === "ADMIN") {
        itAdmins = await prisma.user.findMany({
            where: { role: "ADMIN" },
            select: { id: true, name: true }
        });
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
            case "IN_PROGRESS": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
            case "RESOLVED": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
            case "CLOSED": return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH": return "text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400";
            case "MEDIUM": return "text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-400";
            case "LOW": return "text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400";
            default: return "";
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="shrink-0">
                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-slate-500">#{ticket.id}</span>
                            <Badge className={`${getStatusColor(ticket.status)} border-0 font-normal`}>
                                {ticket.status}
                            </Badge>
                            <Badge className={`${getPriorityColor(ticket.priority)} border-0 font-normal`}>
                                {ticket.priority} Priority
                            </Badge>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {ticket.title}
                        </h1>
                    </div>
                </div>

                {/* Admin actions trigger or extra actions can go here later */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">상세 설명</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {ticket.description}
                            </div>

                            {/* Render Attachments if any */}
                            {ticket.attachments && ticket.attachments.length > 0 && (
                                <div className="mt-8 border-t pt-4">
                                    <h3 className="text-sm font-semibold mb-3">첨부 파일</h3>
                                    <div className="flex flex-col gap-2">
                                        {ticket.attachments.map((file: any) => (
                                            <a
                                                key={file.id}
                                                href={file.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 rounded-md border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors max-w-sm"
                                            >
                                                <FileIcon className="w-5 h-5 text-primary shrink-0" />
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-sm font-medium truncate" title={file.fileName}>{file.fileName}</span>
                                                    <span className="text-xs text-slate-500">{(file.fileSize / 1024).toFixed(1)} KB</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Comments Section placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">대화 기록</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TicketComments
                                ticketId={ticket.id}
                                initialComments={ticket.comments as any}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Sidebar Details) */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">티켓 상세정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div className="space-y-1 text-sm">
                                <div className="text-slate-500">분류</div>
                                <div className="font-medium">{ticket.category?.name || "없음"}</div>
                            </div>
                            <Separator />

                            <div className="space-y-1 text-sm">
                                <div className="text-slate-500">등록자</div>
                                <div className="flex items-center gap-2 font-medium mt-1">
                                    <User className="w-4 h-4 text-slate-400" />
                                    {ticket.submitter.name}
                                </div>
                            </div>
                            <Separator />

                            <div className="space-y-1 text-sm">
                                <div className="text-slate-500">담당자</div>
                                {ticket.assignee ? (
                                    <div className="flex items-center gap-2 font-medium mt-1 text-primary">
                                        <User className="w-4 h-4" />
                                        {ticket.assignee.name}
                                    </div>
                                ) : (
                                    <div className="font-medium text-slate-400 italic mt-1">미배정</div>
                                )}
                            </div>
                            <Separator />

                            <div className="space-y-1 text-sm">
                                <div className="text-slate-500">일시</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span>등록일: {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                                </div>
                                <div className="text-xs text-slate-400 pl-6">
                                    {format(new Date(ticket.createdAt), 'PPpp')}
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Admin Panel Placeholder */}
                    {currentUser.role === "ADMIN" && (
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-primary">관리자 제어 패널</CardTitle>
                                <CardDescription>티켓 상태 및 담당자 변경</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TicketAdminPanel
                                    ticketId={ticket.id}
                                    currentStatus={ticket.status}
                                    currentAssigneeId={ticket.assigneeId}
                                    itAdmins={itAdmins}
                                />
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
}
