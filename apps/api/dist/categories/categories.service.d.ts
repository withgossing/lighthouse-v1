import { PrismaService } from '../prisma.service';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCategories(fetchTree: boolean, parentId?: string): Promise<({
        children: ({
            children: {
                id: string;
                name: string;
                description: string | null;
                parentId: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[] | ({
        parent: {
            id: string;
            name: string;
            description: string | null;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        name: string;
        description: string | null;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
