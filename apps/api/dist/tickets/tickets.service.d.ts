import { PrismaService } from '../prisma.service';
import { AuthUser } from '../auth/user.decorator';
export declare class TicketsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTickets(user: AuthUser, page: number, limit: number, status?: string, priority?: string, categoryId?: string): Promise<{
        tickets: ({
            category: {
                id: string;
                name: string;
            };
            submitter: {
                id: string;
                name: string;
                department: import(".prisma/client").$Enums.Department;
            };
            assignee: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            status: import(".prisma/client").$Enums.TicketStatus;
            priority: import(".prisma/client").$Enums.TicketPriority;
            firstRespondedAt: Date | null;
            resolvedAt: Date | null;
            submitterId: string;
            assigneeId: string | null;
            locationId: string | null;
            categoryId: string;
        })[];
        pagination: {
            totalCount: number;
            page: number;
            limit: number;
        };
    }>;
    createTicket(user: AuthUser, title: string, description: string, categoryId: string, priority?: string, attachmentIds?: string[]): Promise<{
        category: {
            name: string;
        };
        submitter: {
            name: string;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        priority: import(".prisma/client").$Enums.TicketPriority;
        firstRespondedAt: Date | null;
        resolvedAt: Date | null;
        submitterId: string;
        assigneeId: string | null;
        locationId: string | null;
        categoryId: string;
    }>;
    getTicketById(user: AuthUser, ticketId: string): Promise<{
        location: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            buildingName: string;
            floor: string;
        } | null;
        category: {
            id: string;
            name: string;
            parent: {
                name: string;
            } | null;
        };
        submitter: {
            id: string;
            name: string;
            department: import(".prisma/client").$Enums.Department;
        };
        assignee: {
            id: string;
            name: string;
        } | null;
        historyLogs: ({
            changedBy: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            action: import(".prisma/client").$Enums.HistoryAction;
            oldValue: string | null;
            newValue: string | null;
            note: string | null;
            changedById: string;
            ticketId: string;
        })[];
        comments: ({
            attachments: {
                id: string;
                createdAt: Date;
                uploadedById: string;
                fileName: string;
                fileUrl: string;
                fileSize: number;
                mimeType: string;
                ticketId: string | null;
                commentId: string | null;
            }[];
            author: {
                id: string;
                name: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ticketId: string;
            content: string;
            authorId: string;
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            uploadedById: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            ticketId: string | null;
            commentId: string | null;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        priority: import(".prisma/client").$Enums.TicketPriority;
        firstRespondedAt: Date | null;
        resolvedAt: Date | null;
        submitterId: string;
        assigneeId: string | null;
        locationId: string | null;
        categoryId: string;
    }>;
    updateTicket(user: AuthUser, ticketId: string, status?: string, priority?: string, categoryId?: string, assigneeId?: string, note?: string): Promise<({
        category: {
            id: string;
            name: string;
            description: string | null;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        priority: import(".prisma/client").$Enums.TicketPriority;
        firstRespondedAt: Date | null;
        resolvedAt: Date | null;
        submitterId: string;
        assigneeId: string | null;
        locationId: string | null;
        categoryId: string;
    }) | ({
        category: {
            name: string;
        };
        submitter: {
            name: string;
        };
        assignee: {
            name: string;
        } | null;
        historyLogs: {
            id: string;
            createdAt: Date;
            action: import(".prisma/client").$Enums.HistoryAction;
            oldValue: string | null;
            newValue: string | null;
            note: string | null;
            changedById: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        priority: import(".prisma/client").$Enums.TicketPriority;
        firstRespondedAt: Date | null;
        resolvedAt: Date | null;
        submitterId: string;
        assigneeId: string | null;
        locationId: string | null;
        categoryId: string;
    })>;
    addComment(user: AuthUser, ticketId: string, content: string, attachmentIds?: string[]): Promise<{
        author: {
            id: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ticketId: string;
        content: string;
        authorId: string;
    }>;
}
