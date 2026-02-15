import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Message } from './message.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column({ default: 'user' }) // 'user' | 'agent' | 'admin'
    role: string;

    @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets: Ticket[];

    @OneToMany(() => Ticket, (ticket) => ticket.agent)
    assignedTickets: Ticket[];

    @OneToMany(() => Message, (message) => message.sender)
    messages: Message[];
}
