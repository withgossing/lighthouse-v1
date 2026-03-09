import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthUser } from '../auth/user.decorator';

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) { }

    async getNotifications(user: AuthUser) {
        return this.prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 30
        });
    }

    async markAsRead(user: AuthUser, notificationId?: string) {
        if (notificationId) {
            await this.prisma.notification.update({
                where: { id: notificationId, userId: user.id },
                data: { isRead: true }
            });
        } else {
            await this.prisma.notification.updateMany({
                where: { userId: user.id, isRead: false },
                data: { isRead: true }
            });
        }
    }
}
