import { PrismaService } from '../prisma.service';
import { AuthUser } from '../auth/user.decorator';
export declare class UploadService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    handleUpload(user: AuthUser, file: Express.Multer.File): Promise<{
        id: string;
        url: string;
        fileName: string;
    }>;
}
