"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface TicketAdminPanelProps {
    ticketId: string;
    currentStatus: string;
    currentAssigneeId: string | null;
    itAdmins: { id: string; name: string }[];
}

export function TicketAdminPanel({ ticketId, currentStatus, currentAssigneeId, itAdmins }: TicketAdminPanelProps) {
    const router = useRouter();

    const [status, setStatus] = useState(currentStatus);
    const [assigneeId, setAssigneeId] = useState<string>(currentAssigneeId || "UNASSIGNED");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        setIsUpdating(true);

        // Construct payload strictly updating either/both
        const payload: any = {};
        if (status !== currentStatus) payload.status = status;

        const parsedAssignee = assigneeId === "UNASSIGNED" ? null : assigneeId;
        if (parsedAssignee !== currentAssigneeId) payload.assigneeId = parsedAssignee;

        if (Object.keys(payload).length === 0) {
            toast("변경된 내용이 없습니다.");
            setIsUpdating(false);
            return;
        }

        try {
            const res = await fetch(`/api/tickets/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("티켓이 성공적으로 업데이트되었습니다.");
                router.refresh(); // Automatically re-fetches the Server Component and populates the history log!
            } else {
                toast.error(data.error || "티켓 업데이트에 실패했습니다.");
            }
        } catch (e) {
            toast.error("Network error while updating.");
        } finally {
            setIsUpdating(false);
        }
    };

    const hasChanges = status !== currentStatus || (assigneeId === "UNASSIGNED" ? null : assigneeId) !== currentAssigneeId;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">상태 변경</label>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="상태 (Status)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="OPEN">대기 중 (Open)</SelectItem>
                        <SelectItem value="IN_PROGRESS">진행 중 (In Progress)</SelectItem>
                        <SelectItem value="RESOLVED">해결됨 (Resolved)</SelectItem>
                        <SelectItem value="CLOSED">종료됨 (Closed)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">담당자 배정</label>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                    <SelectTrigger>
                        <SelectValue placeholder="IT 담당자 배정" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="UNASSIGNED">
                            <span className="flex items-center text-slate-500 italic">
                                <AlertCircle className="w-3 h-3 mr-2" />
                                미배정
                            </span>
                        </SelectItem>
                        {itAdmins.map((admin) => (
                            <SelectItem key={admin.id} value={admin.id}>
                                {admin.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button
                className="w-full mt-2"
                onClick={handleUpdate}
                disabled={isUpdating || !hasChanges}
            >
                {isUpdating ? "저장 중..." : "변경사항 적용"}
            </Button>
        </div>
    );
}
