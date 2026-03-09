import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthUser } from '../auth/user.decorator';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboardStats(user: AuthUser) {
        const baseWhere = user.role === "ADMIN" ? {} : { submitterId: user.id };

        const totalTickets = await this.prisma.ticket.count({ where: baseWhere });
        const unassignedTickets = await this.prisma.ticket.count({
            where: { ...baseWhere, assigneeId: null }
        });
        const resolvedTickets = await this.prisma.ticket.count({
            where: { ...baseWhere, status: "RESOLVED" }
        });

        const statusGroups = await this.prisma.ticket.groupBy({
            by: ['status'],
            where: baseWhere,
            _count: { status: true }
        });

        const priorityGroups = await this.prisma.ticket.groupBy({
            by: ['priority'],
            where: baseWhere,
            _count: { priority: true }
        });

        return {
            overview: {
                totalTickets,
                unassignedTickets,
                resolvedTickets,
                completionRate: totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0
            },
            byStatus: statusGroups.map(g => ({ name: g.status, value: g._count.status })),
            byPriority: priorityGroups.map(g => ({ name: g.priority, value: g._count.priority }))
        };
    }
}
