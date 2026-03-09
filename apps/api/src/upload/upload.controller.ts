import { Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, type AuthUser } from '../auth/user.decorator';

@Controller('api/upload')
@UseGuards(AuthGuard)
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @CurrentUser() user: AuthUser,
        @UploadedFile() file: Express.Multer.File
    ) {
        const data = await this.uploadService.handleUpload(user, file);
        return { success: true, data };
    }
}
