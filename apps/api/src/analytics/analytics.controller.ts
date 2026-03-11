import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, type AuthUser } from '../auth/user.decorator';

@Controller('api/analytics')
@UseGuards(AuthGuard)
@UseInterceptors(CacheInterceptor)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get()
    @CacheTTL(300000) // 5 minutes cache for analytics
    async getStats(@CurrentUser() user: AuthUser) {
        const data = await this.analyticsService.getDashboardStats(user);
        return { success: true, data };
    }
}
