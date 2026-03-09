import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthUser } from '../auth/user.decorator';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
    constructor(private readonly prisma: PrismaService) { }

    async handleUpload(user: AuthUser, file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No file uploaded');

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const ALLOWED_MIME_TYPES = [
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf", "text/plain", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (file.size > MAX_FILE_SIZE) throw new BadRequestException('File size exceeds 5MB limit');
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) throw new BadRequestException('Invalid file type');

        const UPLOAD_DIR = path.join(process.cwd(), "..", "web", "public", "uploads");
        try {
            await fs.access(UPLOAD_DIR);
        } catch {
            await fs.mkdir(UPLOAD_DIR, { recursive: true });
        }

        const fileExtension = path.extname(file.originalname);
        const uniqueFileName = `${crypto.randomUUID()}${fileExtension}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFileName);
        const publicUrl = `/uploads/${uniqueFileName}`;

        await fs.writeFile(filePath, file.buffer);

        const attachment = await this.prisma.attachment.create({
            data: {
                fileName: file.originalname,
                fileUrl: publicUrl,
                fileSize: file.size,
                mimeType: file.mimetype,
                uploadedById: user.id
            }
        });

        return {
            id: attachment.id,
            url: publicUrl,
            fileName: file.originalname
        };
    }
}
