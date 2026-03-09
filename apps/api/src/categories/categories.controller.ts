import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('api/categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    async getCategories(
        @Query('tree') tree?: string,
        @Query('parentId') parentId?: string,
    ) {
        const fetchTree = tree === 'true';
        const data = await this.categoriesService.getCategories(fetchTree, parentId);
        return { success: true, data };
    }
}
