import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

type Params = {
    params: Promise<{ id: string }>;
};

/**
 * POST /api/tickets/[id]/comments
 * Add a new comment to a ticket.
 * - Updates SLA if Admin replies for the first time.
 */
export async function POST(req: NextRequest, { params }: Params) {
    try {
        const user = await requireAuth();
        const resolvedParams = await params;
        const ticketId = resolvedParams.id;
        const body = await req.json();

        const { content } = body;

        if (!content || typeof content !== "string") {
            return errorResponse("Comment content is required", 400);
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            select: { id: true, submitterId: true, firstRespondedAt: true }
        });

        if (!ticket) return errorResponse("Ticket not found", 404);

        // Security: Only admins or the submitter can comment
        if (user.role === "USER" && ticket.submitterId !== user.id) {
            return errorResponse("Forbidden", 403);
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                ticketId,
                authorId: user.id
            },
            include: {
                author: { select: { id: true, name: true, role: true } }
            }
        });

        // SLA: If admin is commenting for the first time, record firstRespondedAt
        if (user.role === "ADMIN" && !ticket.firstRespondedAt) {
            await prisma.ticket.update({
                where: { id: ticketId },
                data: { firstRespondedAt: new Date() }
            });
        }

        return successResponse(newComment, undefined, 201);

    } catch (error: any) {
        console.error("POST /api/tickets/[id]/comments error:", error);
        if (error.message === "UNAUTHORIZED") return errorResponse("Unauthorized", 401);
        return errorResponse("Failed to post comment", 500);
    }
}

export const dynamic = "force-dynamic";
