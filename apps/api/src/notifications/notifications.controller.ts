import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, type AuthUser } from '../auth/user.decorator';

@Controller('api/notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async getNotifications(@CurrentUser() user: AuthUser) {
        const data = await this.notificationsService.getNotifications(user);
        return { success: true, data };
    }

    @Patch()
    async markAsRead(@CurrentUser() user: AuthUser, @Body() body: any) {
        await this.notificationsService.markAsRead(user, body.id);
        return { success: true };
    }
}
