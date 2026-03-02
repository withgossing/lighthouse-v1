import { CreateTicketForm } from "@/components/tickets/create-ticket-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewTicketPage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create a New Ticket</h1>
                    <p className="text-sm text-slate-500">Need help from the IT Department? Fill out the form below.</p>
                </div>
            </div>

            <CreateTicketForm />
        </div>
    );
}
