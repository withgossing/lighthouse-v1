import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@lighthouse/db';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit(): Promise<void>;
}
