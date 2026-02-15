import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket)
        private ticketRepository: Repository<Ticket>,
    ) { }

    create(ticketData: Partial<Ticket>) {
        const ticket = this.ticketRepository.create(ticketData);
        return this.ticketRepository.save(ticket);
    }

    findAll() {
        return this.ticketRepository.find();
    }

    findOne(id: string) {
        return this.ticketRepository.findOne({ where: { id } });
    }

    update(id: string, updateData: Partial<Ticket>) {
        return this.ticketRepository.update(id, updateData);
    }

    remove(id: string) {
        return this.ticketRepository.delete(id);
    }
}
