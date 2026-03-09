import { PrismaService } from '../prisma.service';
import { AuthUser } from '../auth/user.decorator';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getNotifications(user: AuthUser): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        ticketId: string | null;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string | null;
        isRead: boolean;
        userId: string;
    }[]>;
    markAsRead(user: AuthUser, notificationId?: string): Promise<void>;
}
