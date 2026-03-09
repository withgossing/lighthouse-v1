"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { DragDropUploader, AttachedFile } from "@/components/ui/drag-drop-uploader";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Form Validation Schema using Zod
const formSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100),
    description: z.string().min(10, { message: "Please provide more details." }),
    categoryId: z.string().min(1, { message: "Please select a category." }),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    attachmentIds: z.array(z.string()).optional(),
});

export function CreateTicketForm() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "MEDIUM",
        },
    });

    // Fetch hierarchical categories on mount
    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await fetch("/api/categories?tree=true");
                const json = await res.json();
                if (json.success && json.data) {
                    setCategories(json.data);
                }
            } catch (error) {
                console.error("Failed to load categories:", error);
                toast.error("Failed to load ticket categories.");
            }
        }
        loadCategories();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (response.status === 401) {
                toast.error("세션이 만료되었습니다. 다시 로그인해 주세요.");
                document.cookie = "lighthouse_mock_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                router.push("/login");
                router.refresh();
                return;
            }

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success("티켓이 성공적으로 등록되었습니다!");
                router.push(`/tickets/${result.data.id}`);
                router.refresh();
            } else {
                toast.error(result.error || "티켓 등록에 실패했습니다.");
            }
        } catch (error) {
            toast.error("Network error while submitting the ticket.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="max-w-3xl mx-auto shadow-sm">
            <CardHeader>
                <CardTitle>새로운 요청 등록</CardTitle>
                <CardDescription>
                    상세한 설명은 담당자가 문제를 빠르게 해결하는 데 도움이 됩니다.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>제목 (요약)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="예: 사내 VPN 접속 불가" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>문제 분류</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="문제 분류를 선택해 주세요" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((parentCat) => (
                                                    <div key={parentCat.id}>
                                                        {parentCat.children && parentCat.children.length > 0 ? (
                                                            // Render parent as disabled label-like item, and children below
                                                            <div className="px-2 py-1.5 text-sm font-semibold text-slate-500">
                                                                {parentCat.name}
                                                            </div>
                                                        ) : (
                                                            <SelectItem value={parentCat.id} className="font-semibold">
                                                                {parentCat.name}
                                                            </SelectItem>
                                                        )}

                                                        {parentCat.children && parentCat.children.map((childCat: any) => (
                                                            <SelectItem key={childCat.id} value={childCat.id} className="pl-6">
                                                                {childCat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </div>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>우선순위 / 긴급도</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="우선순위를 선택해 주세요" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="LOW">낮음 (긴급하지 않음)</SelectItem>
                                                <SelectItem value="MEDIUM">보통 (일반적인 업무)</SelectItem>
                                                <SelectItem value="HIGH">높음 (업무 중단됨 / 긴급)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>상세 설명</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="발생한 문제, 오류 메시지, 시도해본 과정 등을 구체적으로 적어 주세요..."
                                            className="min-h-[150px] resize-y"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        스크린샷이나 참고 문서를 아래 영역에 끌어다 놓으세요. (최대 3개, 5MB 제한)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-2 pb-4">
                            <h3 className="text-sm font-medium mb-2">첨부 파일 (선택)</h3>
                            <DragDropUploader
                                onUploadComplete={(files: AttachedFile[]) => {
                                    form.setValue("attachmentIds", files.map(f => f.id));
                                }}
                            />
                        </div>

                        <div className="flex justify-end gap-4 border-t pt-4">
                            <Button variant="outline" type="button" onClick={() => router.back()}>취소</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "등록 중..." : "티켓 등록"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
