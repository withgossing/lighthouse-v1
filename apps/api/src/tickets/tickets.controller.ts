import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, type AuthUser } from '../auth/user.decorator';

@Controller('api/tickets')
@UseGuards(AuthGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Get()
    async getTickets(
        @CurrentUser() user: AuthUser,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: string,
        @Query('priority') priority?: string,
        @Query('categoryId') categoryId?: string,
    ) {
        const p = parseInt(page || '1', 10);
        const l = parseInt(limit || '20', 10);

        const { tickets, pagination } = await this.ticketsService.getTickets(user, p, l, status, priority, categoryId);
        return { success: true, data: tickets, pagination };
    }

    @Post()
    async createTicket(
        @CurrentUser() user: AuthUser,
        @Body() body: any
    ) {
        const data = await this.ticketsService.createTicket(user, body.title, body.description, body.categoryId, body.priority, body.attachmentIds);
        return { success: true, data };
    }

    @Get(':id')
    async getTicketById(
        @CurrentUser() user: AuthUser,
        @Param('id') ticketId: string
    ) {
        const data = await this.ticketsService.getTicketById(user, ticketId);
        return { success: true, data };
    }

    @Patch(':id')
    async updateTicket(
        @CurrentUser() user: AuthUser,
        @Param('id') ticketId: string,
        @Body() body: any
    ) {
        const data = await this.ticketsService.updateTicket(user, ticketId, body.status, body.priority, body.categoryId, body.assigneeId, body.note);
        return { success: true, data };
    }

    @Post(':id/comments')
    async addComment(
        @CurrentUser() user: AuthUser,
        @Param('id') ticketId: string,
        @Body() body: any
    ) {
        const data = await this.ticketsService.addComment(user, ticketId, body.content, body.attachmentIds);
        return { success: true, data };
    }
}
