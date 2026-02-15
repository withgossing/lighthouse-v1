import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({ default: 'open' }) // 'open' | 'in_progress' | 'resolved' | 'closed'
    status: string;

    @Column()
    category: string; // 'stock', 'bond', 'system', etc.

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.tickets)
    user: User;

    @ManyToOne(() => User, (user) => user.assignedTickets, { nullable: true })
    agent: User;

    @OneToMany(() => Message, (message) => message.ticket)
    messages: Message[];
}
