import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, type AuthUser } from '../auth/user.decorator';

@Controller('api/analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get()
    async getStats(@CurrentUser() user: AuthUser) {
        const data = await this.analyticsService.getDashboardStats(user);
        return { success: true, data };
    }
}
