import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

type Params = {
    params: Promise<{ id: string }>;
};

/**
 * GET /api/tickets/[id]
 * Retrieves full details of a single ticket (comments, history, attachments).
 */
export async function GET(req: NextRequest, { params }: Params) {
    try {
        const user = await requireAuth();
        const resolvedParams = await params;
        const ticketId = resolvedParams.id;

        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: {
                submitter: { select: { id: true, name: true, department: true } },
                assignee: { select: { id: true, name: true } },
                category: { select: { id: true, name: true, parent: { select: { name: true } } } },
                location: true,
                comments: {
                    include: { author: { select: { id: true, name: true, role: true } }, attachments: true },
                    orderBy: { createdAt: "asc" }
                },
                attachments: true,
                historyLogs: {
                    include: { changedBy: { select: { id: true, name: true } } },
                    orderBy: { createdAt: "desc" } // Show newest history first
                }
            }
        });

        if (!ticket) return errorResponse("Ticket not found", 404);

        // Security boundary: Normal users can only view their own tickets.
        if (user.role === "USER" && ticket.submitterId !== user.id) {
            return errorResponse("Forbidden", 403);
        }

        return successResponse(ticket);

    } catch (error: any) {
        console.error("GET /api/tickets/[id] error:", error);
        if (error.message === "UNAUTHORIZED") return errorResponse("Unauthorized", 401);
        return errorResponse("Failed to fetch ticket details", 500);
    }
}

/**
 * PATCH /api/tickets/[id]
 * Updates a ticket. (e.g. assign, transfer, change status).
 * Also logs the update to TicketHistory.
 */
export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const user = await requireAuth();
        const resolvedParams = await params;
        const ticketId = resolvedParams.id;
        const body = await req.json();

        const { status, priority, categoryId, assigneeId, note } = body;

        // Fetch existing ticket to compare old vs new values for history logging
        const existingTicket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { category: true }
        });

        if (!existingTicket) return errorResponse("Ticket not found", 404);

        // Security: Only admins can assign or transfer. (Users can perhaps only close or cancel).
        if (user.role !== "ADMIN" && (assigneeId || categoryId || priority)) {
            return errorResponse("Forbidden: Adimns only", 403);
        }
        if (user.role === "USER" && existingTicket.submitterId !== user.id) {
            return errorResponse("Forbidden", 403);
        }

        const updates: any = {};
        const historyEntries: any[] = [];
        let firstRespondedAt = existingTicket.firstRespondedAt;
        let resolvedAt = existingTicket.resolvedAt;

        // Assigning / Transferring
        if (assigneeId !== undefined && assigneeId !== existingTicket.assigneeId) {
            updates.assigneeId = assigneeId;
            const action = (existingTicket.assigneeId === null) ? "ASSIGNEE_CHANGED" : "TRANSFERRED";
            historyEntries.push({
                action,
                oldValue: existingTicket.assigneeId || "Unassigned",
                newValue: assigneeId || "Unassigned",
                note: note || "Assignee changed",
                changedById: user.id
            });

            // If it's the very first assignment/action by an admin, start the SLA response timer
            if (user.role === "ADMIN" && !firstRespondedAt) {
                firstRespondedAt = new Date();
            }
        }

        // Status Change
        if (status !== undefined && status !== existingTicket.status) {
            updates.status = status;
            historyEntries.push({
                action: "STATUS_CHANGED",
                oldValue: existingTicket.status,
                newValue: status,
                changedById: user.id
            });
            // SLA logic
            if (user.role === "ADMIN" && !firstRespondedAt && status !== "OPEN") {
                firstRespondedAt = new Date();
            }
            if (status === "RESOLVED") {
                resolvedAt = new Date();
            } else if (existingTicket.status === "RESOLVED" && status !== "RESOLVED") {
                // Ticket re-opened
                resolvedAt = null;
            }
        }

        // Category Change
        if (categoryId !== undefined && categoryId !== existingTicket.categoryId) {
            updates.categoryId = categoryId;
            historyEntries.push({
                action: "CATEGORY_CHANGED",
                oldValue: existingTicket.categoryId, // Ideally we store the name in old/new value, but IDs work for MVP
                newValue: categoryId,
                note: note, // "Transfer cause" requested in spec
                changedById: user.id
            });
        }

        if (priority !== undefined && priority !== existingTicket.priority) {
            updates.priority = priority;
            historyEntries.push({
                action: "PRIORITY_CHANGED",
                oldValue: existingTicket.priority,
                newValue: priority,
                changedById: user.id
            });
        }

        // Apply SLA timers
        if (firstRespondedAt !== existingTicket.firstRespondedAt) updates.firstRespondedAt = firstRespondedAt;
        if (resolvedAt !== existingTicket.resolvedAt) updates.resolvedAt = resolvedAt;

        if (Object.keys(updates).length === 0) {
            return successResponse(existingTicket, undefined, 200); // Nothing changed
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                ...updates,
                historyLogs: {
                    create: historyEntries
                }
            },
            include: {
                assignee: { select: { name: true } },
                submitter: { select: { name: true } },
                category: { select: { name: true } },
                historyLogs: {
                    orderBy: { createdAt: "desc" },
                    take: 5
                }
            }
        });

        return successResponse(updatedTicket);

    } catch (error: any) {
        console.error("PATCH /api/tickets/[id] error:", error);
        if (error.message === "UNAUTHORIZED") return errorResponse("Unauthorized", 401);
        return errorResponse("Failed to update ticket", 500);
    }
}

export const dynamic = "force-dynamic";
