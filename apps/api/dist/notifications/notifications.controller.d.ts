import { NotificationsService } from './notifications.service';
import { type AuthUser } from '../auth/user.decorator';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(user: AuthUser): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            title: string;
            ticketId: string | null;
            type: import(".prisma/client").$Enums.NotificationType;
            message: string | null;
            isRead: boolean;
            userId: string;
        }[];
    }>;
    markAsRead(user: AuthUser, body: any): Promise<{
        success: boolean;
    }>;
}
