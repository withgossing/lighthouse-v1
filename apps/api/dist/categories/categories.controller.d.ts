import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getCategories(tree?: string, parentId?: string): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
}
