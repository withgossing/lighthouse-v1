import { UploadService } from './upload.service';
import { type AuthUser } from '../auth/user.decorator';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(user: AuthUser, file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            id: string;
            url: string;
            fileName: string;
        };
    }>;
}
