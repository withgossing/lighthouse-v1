import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TicketPriority } from '@lighthouse/db';
import { AuthUser } from '../auth/user.decorator';

@Injectable()
export class TicketsService {
    constructor(private readonly prisma: PrismaService) { }

    async getTickets(user: AuthUser, page: number, limit: number, status?: string, priority?: string, categoryId?: string) {
        const skip = (page - 1) * limit;
        const whereClause: any = {};

        if (user.role === 'USER') {
            whereClause.submitterId = user.id;
        }

        if (status) whereClause.status = status;
        if (priority) whereClause.priority = priority;
        if (categoryId) whereClause.categoryId = categoryId;

        const [tickets, totalCount] = await Promise.all([
            this.prisma.ticket.findMany({
                where: whereClause,
                include: {
                    submitter: { select: { id: true, name: true, department: true } },
                    assignee: { select: { id: true, name: true } },
                    category: { select: { id: true, name: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.ticket.count({ where: whereClause })
        ]);

        return { tickets, pagination: { totalCount, page, limit } };
    }

    async createTicket(user: AuthUser, title: string, description: string, categoryId: string, priority?: string, attachmentIds?: string[]) {
        if (!title || !description || !categoryId) {
            throw new BadRequestException("Missing required fields: title, description, categoryId");
        }

        const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
        if (!category) throw new BadRequestException("Invalid categoryId");

        // --- Auto-Routing Logic ---
        let autoAssigneeId: string | null = null;
        
        // Find Admins who have a matching AdminSkill for this category
        const skilledAdmins = await this.prisma.user.findMany({
            where: {
                role: 'ADMIN',
                adminSkills: {
                    some: { categoryId: categoryId }
                }
            },
            select: { id: true, name: true }
        });

        if (skilledAdmins.length > 0) {
            // Find the admin from this list who has the FEWEST 'IN_PROGRESS' tickets
            const workloadCounts = await this.prisma.ticket.groupBy({
                by: ['assigneeId'],
                where: {
                    status: 'IN_PROGRESS',
                    assigneeId: { in: skilledAdmins.map(a => a.id) }
                },
                _count: { id: true }
            });

            let minCount = Infinity;
            
            for (const admin of skilledAdmins) {
                const countObj = workloadCounts.find(w => w.assigneeId === admin.id);
                const count = countObj ? countObj._count.id : 0;
                
                if (count < minCount) {
                    minCount = count;
                    autoAssigneeId = admin.id;
                }
            }
        }
        // --- End Auto-Routing Logic ---

        const newTicket = await this.prisma.ticket.create({
            data: {
                title,
                description,
                categoryId,
                priority: (priority as TicketPriority) || "MEDIUM",
                submitterId: user.id,
                assigneeId: autoAssigneeId, // Assign automatically if found
                status: autoAssigneeId ? "IN_PROGRESS" : "OPEN", // Change status immediately if assigned
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

        // Add history log for auto-assignment
        if (autoAssigneeId) {
             await this.prisma.ticketHistory.create({
                 data: {
                     ticketId: newTicket.id,
                     action: "ASSIGNEE_CHANGED",
                     oldValue: "Unassigned",
                     newValue: autoAssigneeId,
                     note: "Auto-routed based on skill and workload",
                     changedById: user.id // Usually system, but using submitter for context
                 }
             });

             await this.prisma.notification.create({
                 data: {
                     userId: autoAssigneeId,
                     title: "티켓 자동 배정안내 (Auto-Routing)",
                     message: `티켓 #${newTicket.id}의 담당자로 자동 지정되었습니다.`,
                     ticketId: newTicket.id,
                     type: "TICKET_ASSIGNED"
                 }
             });
        }

        if (attachmentIds && Array.isArray(attachmentIds) && attachmentIds.length > 0) {
            await this.prisma.attachment.updateMany({
                where: { id: { in: attachmentIds }, uploadedById: user.id },
                data: { ticketId: newTicket.id }
            });
        }

        return newTicket;
    }

    async getTicketById(user: AuthUser, ticketId: string) {
        const ticket = await this.prisma.ticket.findUnique({
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
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!ticket) throw new NotFoundException("Ticket not found");

        if (user.role === "USER" && ticket.submitterId !== user.id) {
            throw new ForbiddenException("Forbidden");
        }

        return ticket;
    }

    async updateTicket(user: AuthUser, ticketId: string, status?: string, priority?: string, categoryId?: string, assigneeId?: string, note?: string) {
        const existingTicket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { category: true }
        });

        if (!existingTicket) throw new NotFoundException("Ticket not found");

        if (user.role !== "ADMIN" && (assigneeId || categoryId || priority)) {
            throw new ForbiddenException("Forbidden: Admins only");
        }
        if (user.role === "USER" && existingTicket.submitterId !== user.id) {
            throw new ForbiddenException("Forbidden");
        }

        const updates: any = {};
        const historyEntries: any[] = [];
        let firstRespondedAt = existingTicket.firstRespondedAt;
        let resolvedAt = existingTicket.resolvedAt;

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

            if (user.role === "ADMIN" && !firstRespondedAt) {
                firstRespondedAt = new Date();
            }
        }

        if (status !== undefined && status !== existingTicket.status) {
            updates.status = status;
            historyEntries.push({
                action: "STATUS_CHANGED",
                oldValue: existingTicket.status,
                newValue: status,
                changedById: user.id
            });
            if (user.role === "ADMIN" && !firstRespondedAt && status !== "OPEN") {
                firstRespondedAt = new Date();
            }
            if (status === "RESOLVED") {
                resolvedAt = new Date();
            } else if (existingTicket.status === "RESOLVED" && status !== "RESOLVED") {
                resolvedAt = null;
            }
        }

        if (categoryId !== undefined && categoryId !== existingTicket.categoryId) {
            updates.categoryId = categoryId;
            historyEntries.push({
                action: "CATEGORY_CHANGED",
                oldValue: existingTicket.categoryId,
                newValue: categoryId,
                note: note,
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

        if (firstRespondedAt !== existingTicket.firstRespondedAt) updates.firstRespondedAt = firstRespondedAt;
        if (resolvedAt !== existingTicket.resolvedAt) updates.resolvedAt = resolvedAt;

        if (Object.keys(updates).length === 0) {
            return existingTicket;
        }

        const updatedTicket = await this.prisma.ticket.update({
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

        // Notify logic
        const notifications: any[] = [];
        for (const history of historyEntries) {
            if (history.action === "ASSIGNEE_CHANGED" || history.action === "TRANSFERRED") {
                if (updates.assigneeId) {
                    notifications.push({
                        userId: updates.assigneeId,
                        title: "새로운 티켓 배정됨",
                        message: `티켓 #${ticketId}의 담당자로 지정되었습니다.`,
                        ticketId,
                        type: "TICKET_ASSIGNED"
                    });
                }
                notifications.push({
                    userId: existingTicket.submitterId,
                    title: "담당자 배정",
                    message: `티켓 #${ticketId} 담당자가 배정/변경되었습니다.`,
                    ticketId,
                    type: "TICKET_ASSIGNED"
                });
            }
            if (history.action === "STATUS_CHANGED") {
                notifications.push({
                    userId: existingTicket.submitterId,
                    title: "티켓 상태 변경",
                    message: `티켓 #${ticketId} 상태가 [${history.newValue}]로 변경되었습니다.`,
                    ticketId,
                    type: "TICKET_STATUS_CHANGED"
                });
            }
        }

        const filteredNotifications = notifications.filter(n => n.userId !== user.id);
        if (filteredNotifications.length > 0) {
            await this.prisma.notification.createMany({ data: filteredNotifications });
        }

        return updatedTicket;
    }

    async addComment(user: AuthUser, ticketId: string, content: string, attachmentIds?: string[]) {
        if (!content || typeof content !== "string") {
            if (!attachmentIds || !Array.isArray(attachmentIds) || attachmentIds.length === 0) {
                throw new BadRequestException("Comment content or attachment is required");
            }
        }

        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
            select: { id: true, submitterId: true, assigneeId: true, firstRespondedAt: true }
        });

        if (!ticket) throw new NotFoundException("Ticket not found");

        if (user.role === "USER" && ticket.submitterId !== user.id) {
            throw new ForbiddenException("Forbidden");
        }

        const newComment = await this.prisma.comment.create({
            data: {
                content: content || "",
                ticketId,
                authorId: user.id
            },
            include: {
                author: { select: { id: true, name: true, role: true } }
            }
        });

        const targetUserId = user.role === "USER" ? ticket.assigneeId : ticket.submitterId;

        if (targetUserId && targetUserId !== user.id) {
            await this.prisma.notification.create({
                data: {
                    userId: targetUserId,
                    title: "새로운 댓글 추가",
                    message: `티켓 #${ticketId}에 새 답변이 작성되었습니다.`,
                    ticketId,
                    type: "NEW_COMMENT"
                }
            });
        }

        if (user.role === "ADMIN" && !ticket.firstRespondedAt) {
            await this.prisma.ticket.update({
                where: { id: ticketId },
                data: { firstRespondedAt: new Date() }
            });
        }

        if (attachmentIds && Array.isArray(attachmentIds) && attachmentIds.length > 0) {
            await this.prisma.attachment.updateMany({
                where: { id: { in: attachmentIds }, uploadedById: user.id },
                data: { commentId: newComment.id, ticketId: ticketId }
            });
        }

        return newComment;
    }
}
