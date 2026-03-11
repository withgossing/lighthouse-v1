import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
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
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
                    new FileTypeValidator({ fileType: /^(image\/(jpeg|png|gif|webp))|(application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document))|(text\/plain)$/ }),
                ],
            }),
        ) file: Express.Multer.File
    ) {
        const data = await this.uploadService.handleUpload(user, file);
        return { success: true, data };
    }
}
