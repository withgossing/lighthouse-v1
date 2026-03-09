import { PrismaService } from '../prisma.service';
import { AuthUser } from '../auth/user.decorator';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(user: AuthUser): Promise<{
        overview: {
            totalTickets: number;
            unassignedTickets: number;
            resolvedTickets: number;
            completionRate: number;
        };
        byStatus: {
            name: import(".prisma/client").$Enums.TicketStatus;
            value: number;
        }[];
        byPriority: {
            name: import(".prisma/client").$Enums.TicketPriority;
            value: number;
        }[];
    }>;
}
