import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { TicketModule } from './ticket/ticket.module';
import { User } from './entities/user.entity';
import { Ticket } from './entities/ticket.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isPostgres = process.env.DB_TYPE === 'postgres';
        if (isPostgres) {
          return {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'admin',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'lighthouse',
            entities: [User, Ticket, Message],
            synchronize: true,
          };
        } else {
          return {
            type: 'sqlite',
            database: 'lighthouse.db',
            entities: [User, Ticket, Message],
            synchronize: true,
          };
        }
      },
    }),
    ChatModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
