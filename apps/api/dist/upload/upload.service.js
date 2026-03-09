"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
let UploadService = class UploadService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleUpload(user, file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const ALLOWED_MIME_TYPES = [
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf", "text/plain", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (file.size > MAX_FILE_SIZE)
            throw new common_1.BadRequestException('File size exceeds 5MB limit');
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
            throw new common_1.BadRequestException('Invalid file type');
        const UPLOAD_DIR = path.join(process.cwd(), "..", "web", "public", "uploads");
        try {
            await fs.access(UPLOAD_DIR);
        }
        catch {
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
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map