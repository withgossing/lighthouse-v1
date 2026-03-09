import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async getCategories(fetchTree: boolean, parentId?: string) {
        if (fetchTree) {
            return this.prisma.category.findMany({
                where: { parentId: null },
                include: {
                    children: {
                        include: {
                            children: true,
                        },
                    },
                },
                orderBy: { name: 'asc' },
            });
        }

        return this.prisma.category.findMany({
            where: parentId !== undefined ? {
                parentId: parentId === 'root' ? null : parentId,
            } : undefined,
            include: {
                parent: true,
            },
            orderBy: { name: 'asc' },
        });
    }
}
