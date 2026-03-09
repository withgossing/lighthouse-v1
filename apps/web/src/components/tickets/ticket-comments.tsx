"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShieldAlert, FileIcon } from "lucide-react";
import { DragDropUploader, AttachedFile } from "@/components/ui/drag-drop-uploader";

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    author: {
        id: string;
        name: string;
        role: string;
    };
    attachments?: AttachedFile[];
}

export function TicketComments({ ticketId, initialComments }: { ticketId: string; initialComments: Comment[] }) {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [attachments, setAttachments] = useState<AttachedFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/tickets/${ticketId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    attachmentIds: attachments.map(a => a.id)
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setContent("");
                setAttachments([]);
                toast.success("댓글이 등록되었습니다.");
                router.refresh(); // Refresh Server Component to re-fetch identical data
            } else {
                toast.error(data.error || "Failed to post comment.");
            }
        } catch (e) {
            toast.error("Network error while communicating with server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (name: string) => {
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className="flex flex-col h-[500px]">
            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6">
                    {initialComments.length === 0 ? (
                        <div className="text-center text-slate-500 py-8 text-sm italic">
                            아직 댓글이 없습니다. 대화를 시작해 보세요!
                        </div>
                    ) : (
                        initialComments.map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                                <Avatar className="mt-1">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {getInitials(comment.author.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">
                                                {comment.author.name}
                                            </span>
                                            {comment.author.role === "ADMIN" && (
                                                <span className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-sm font-bold tracking-wider">
                                                    <ShieldAlert className="w-3 h-3" /> IT 부서
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 border p-3 rounded-md whitespace-pre-wrap">
                                        {comment.content}
                                    </div>
                                    {/* Render inline Comment attachments */}
                                    {comment.attachments && comment.attachments.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {comment.attachments.map(file => (
                                                <a
                                                    key={file.id}
                                                    href={file.url || (file as any).fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 p-2 rounded-md border bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-xs text-slate-600 dark:text-slate-300"
                                                >
                                                    <FileIcon className="w-3.5 h-3.5 text-primary" />
                                                    <span className="max-w-[120px] truncate" title={file.fileName}>{file.fileName}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            <div className="mt-4 border-t pt-4">
                <Textarea
                    placeholder="메시지나 답변을 입력해 주세요..."
                    className="min-h-[80px] resize-none mb-2"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="mb-4">
                    <DragDropUploader
                        onUploadComplete={setAttachments}
                        maxFiles={5}
                    />
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={isSubmitting || (!content.trim() && attachments.length === 0)}>
                        {isSubmitting ? "등록 중..." : "댓글 등록"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
