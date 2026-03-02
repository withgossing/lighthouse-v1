import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function getDashboardMetrics() {
    const session = await getSession();
    if (!session) return null;

    const isAdmin = session.role === "ADMIN";
    const whereClause: Prisma.TicketWhereInput = isAdmin ? {} : { submitterId: session.userId };

    // Run queries in parallel for performance
    const [total, open, unassigned, resolvedToday] = await Promise.all([
        prisma.ticket.count({ where: whereClause }),
        prisma.ticket.count({ where: { ...whereClause, status: "OPEN" } }),
        isAdmin
            ? prisma.ticket.count({ where: { assigneeId: null } })
            : Promise.resolve(0), // Users don't care about unassigned pool usually
        prisma.ticket.count({
            where: {
                ...whereClause,
                status: "RESOLVED",
                resolvedAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)) // Start of today
                }
            }
        })
    ]);

    return { total, open, unassigned, resolvedToday, isAdmin };
}

export type TicketWithRelations = Prisma.TicketGetPayload<{
    include: {
        category: { select: { name: true } };
        submitter: { select: { name: true } };
        assignee: { select: { name: true } };
    }
}>;

export async function getDashboardTickets(searchParams: { [key: string]: string | string[] | undefined }) {
    const session = await getSession();
    if (!session) return { tickets: [], totalCount: 0, page: 1, totalPages: 0 };

    const isAdmin = session.role === "ADMIN";

    // Pagination
    const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Filters
    const status = typeof searchParams.status === "string" ? searchParams.status : undefined;
    const priority = typeof searchParams.priority === "string" ? searchParams.priority : undefined;
    // Admin can choose to see "my tickets" (assigned to them) vs all
    const filter = typeof searchParams.filter === "string" ? searchParams.filter : undefined;

    const whereClause: Prisma.TicketWhereInput = {};

    if (!isAdmin || filter === "me") {
        if (!isAdmin) {
            whereClause.submitterId = session.userId;
        } else {
            // Admin looking at their assigned tickets
            whereClause.assigneeId = session.userId;
        }
    }

    if (status) whereClause.status = status as any;
    if (priority) whereClause.priority = priority as any;

    const [tickets, totalCount] = await Promise.all([
        prisma.ticket.findMany({
            where: whereClause,
            include: {
                category: { select: { name: true } },
                submitter: { select: { name: true } },
                assignee: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.ticket.count({ where: whereClause })
    ]);

    return { tickets, totalCount, page, totalPages: Math.ceil(totalCount / limit) };
}
