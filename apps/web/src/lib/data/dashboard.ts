import { getSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export type TicketWithRelations = Prisma.TicketGetPayload<{
    include: {
        category: { select: { name: true } };
        submitter: { select: { name: true } };
        assignee: { select: { name: true } };
    }
}>;

export async function getDashboardMetrics() {
    const session = await getSession();
    if (!session) return null;

    try {
        const baseUrl = process.env.INTERNAL_API_URL || 'http://localhost:18012';
        const res = await fetch(`${baseUrl}/api/analytics`, {
            headers: {
                'x-user-id': session.userId,
                'x-user-role': session.role
            },
            cache: 'no-store'
        });
        const json = await res.json();
        if (!json.success) return null;

        return {
            total: json.data.overview.totalTickets,
            open: json.data.overview.totalTickets - json.data.overview.resolvedTickets,
            unassigned: json.data.overview.unassignedTickets,
            resolvedToday: json.data.overview.resolvedTickets, // Approximated mapping
            isAdmin: session.role === "ADMIN"
        };
    } catch (e) {
        console.error("Failed to fetch metrics from backend", e);
        return null;
    }
}

export async function getDashboardTickets(searchParams: { [key: string]: string | string[] | undefined }) {
    const session = await getSession();
    if (!session) return { tickets: [], totalCount: 0, page: 1, totalPages: 0 };

    const page = typeof searchParams.page === "string" ? searchParams.page : "1";
    const status = typeof searchParams.status === "string" ? searchParams.status : "";
    const priority = typeof searchParams.priority === "string" ? searchParams.priority : "";

    try {
        const query = new URLSearchParams({ page });
        if (status) query.append('status', status);
        if (priority) query.append('priority', priority);

        const baseUrl = process.env.INTERNAL_API_URL || 'http://localhost:18012';
        const res = await fetch(`${baseUrl}/api/tickets?${query.toString()}`, {
            headers: {
                'x-user-id': session.userId,
                'x-user-role': session.role
            },
            cache: 'no-store'
        });
        const json = await res.json();

        return {
            tickets: json.data || [],
            totalCount: json.pagination?.totalCount || 0,
            page: json.pagination?.page || 1,
            totalPages: Math.ceil((json.pagination?.totalCount || 0) / (json.pagination?.limit || 10))
        };
    } catch (e) {
        console.error("Failed to fetch tickets from backend", e);
        return { tickets: [], totalCount: 0, page: 1, totalPages: 0 };
    }
}
