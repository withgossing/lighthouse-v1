import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/tickets
 * Retrieves a paginated list of tickets.
 * - ADMIN: can see all tickets (can filter by status, priority, etc.)
 * - USER: can only see tickets they submitted
 */
export async function GET(req: NextRequest) {
    try {
        const user = await requireAuth();
        const { searchParams } = new URL(req.url);

        // Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        // Filtering
        const status = searchParams.get("status");
        const priority = searchParams.get("priority");
        const categoryId = searchParams.get("categoryId");

        const whereClause: any = {};

        // Apply role-based visibility
        if (user.role === "USER") {
            whereClause.submitterId = user.id;
        }

        // Apply filters if provided
        if (status) whereClause.status = status;
        if (priority) whereClause.priority = priority;
        if (categoryId) whereClause.categoryId = categoryId;

        const [tickets, totalCount] = await Promise.all([
            prisma.ticket.findMany({
                where: whereClause,
                include: {
                    submitter: { select: { id: true, name: true, department: true } },
                    assignee: { select: { id: true, name: true } },
                    category: { select: { id: true, name: true } }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.ticket.count({ where: whereClause })
        ]);

        return successResponse(tickets, { totalCount, page, limit });

    } catch (error: any) {
        console.error("GET /api/tickets error:", error);
        if (error.message === "UNAUTHORIZED") return errorResponse("Unauthorized", 401);
        return errorResponse("Failed to fetch tickets", 500);
    }
}

/**
 * POST /api/tickets
 * Creates a new ticket.
 * - Body: { title, description, categoryId, priority? }
 */
export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth();
        const body = await req.json();

        const { title, description, categoryId, priority } = body;

        if (!title || !description || !categoryId) {
            return errorResponse("Missing required fields: title, description, categoryId", 400);
        }

        // Verify category exists
        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!category) {
            return errorResponse("Invalid categoryId", 400);
        }

        // Create the ticket (all new tickets are OPEN and Unassigned by default)
        const newTicket = await prisma.ticket.create({
            data: {
                title,
                description,
                categoryId,
                priority: priority || "MEDIUM",
                submitterId: user.id,
                status: "OPEN",
                historyLogs: {
                    create: {
                        action: "CREATED",
                        changedById: user.id,
                        note: "Ticket created"
                    }
                }
            },
            include: {
                category: { select: { name: true } },
                submitter: { select: { name: true } }
            }
        });

        return successResponse(newTicket, undefined, 201);

    } catch (error: any) {
        console.error("POST /api/tickets error:", error);
        if (error.message === "UNAUTHORIZED") return errorResponse("Unauthorized", 401);
        return errorResponse("Failed to create ticket", 500);
    }
}

export const dynamic = "force-dynamic";
