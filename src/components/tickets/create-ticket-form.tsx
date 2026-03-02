"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success("Ticket submitted successfully!");
                router.push(`/tickets/${result.data.id}`);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to submit ticket.");
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
                <CardTitle>Submit a New Request</CardTitle>
                <CardDescription>
                    Detailed descriptions help our IT Admins resolve your issue faster.
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
                                    <FormLabel>Short Summary (Title)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Cannot access the company VPN" {...field} />
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
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an issue category" />
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
                                        <FormLabel>Priority / Urgency</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="LOW">Low (Not urgent)</SelectItem>
                                                <SelectItem value="MEDIUM">Medium (Normal)</SelectItem>
                                                <SelectItem value="HIGH">High (Urgent/Blocking work)</SelectItem>
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
                                    <FormLabel>Detailed Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Please explicitly describe the issue, error messages, and what you were trying to do..."
                                            className="min-h-[150px] resize-y"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        You can drag and drop screenshots here or attach them later on the ticket page. (Attachments MVP Phase 2)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4 border-t pt-4">
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Ticket"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
