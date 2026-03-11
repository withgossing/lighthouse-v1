import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CategoriesService } from './categories.service';

@Controller('api/categories')
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @CacheTTL(3600000) // 1 hour cache, static data
    async getCategories(
        @Query('tree') tree?: string,
        @Query('parentId') parentId?: string,
    ) {
        const fetchTree = tree === 'true';
        const data = await this.categoriesService.getCategories(fetchTree, parentId);
        return { success: true, data };
    }
}
