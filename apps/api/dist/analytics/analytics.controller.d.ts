import { AnalyticsService } from './analytics.service';
import { type AuthUser } from '../auth/user.decorator';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getStats(user: AuthUser): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
}
