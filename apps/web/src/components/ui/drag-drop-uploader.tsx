"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { UploadCloud, FileIcon, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export interface AttachedFile {
    id: string;      // ID returned from the server after upload
    url: string;     // Public URL of the uploaded file
    fileName: string;// Original file name
}

interface DragDropUploaderProps {
    onUploadComplete: (files: AttachedFile[]) => void;
    maxFiles?: number;
    className?: string;
}

export function DragDropUploader({ onUploadComplete, maxFiles = 3, className }: DragDropUploaderProps) {
    const [uploadedFiles, setUploadedFiles] = useState<AttachedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
                toast.error(`최대 ${maxFiles}개의 파일만 첨부할 수 있습니다.`);
                return;
            }

            setIsUploading(true);
            const newAttachments: AttachedFile[] = [];

            // We intentionally upload sequentially or via Promise.all.
            // Using Promise.all for speed:
            try {
                const uploadPromises = acceptedFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    });

                    const data = await res.json();
                    if (!res.ok || !data.success) {
                        throw new Error(data.error || `${file.name} 업로드 실패`);
                    }
                    return data.data as AttachedFile; // The server returns id, url, fileName
                });

                const results = await Promise.all(uploadPromises);
                newAttachments.push(...results);

                const finalFiles = [...uploadedFiles, ...newAttachments];
                setUploadedFiles(finalFiles);
                onUploadComplete(finalFiles); // Propagate up to parent form
                toast.success(`${results.length}개의 파일이 성공적으로 첨부되었습니다.`);
            } catch (error: any) {
                toast.error(error.message || "파일 업로드 중 오류가 발생했습니다.");
            } finally {
                setIsUploading(false);
            }
        },
        [uploadedFiles, maxFiles, onUploadComplete]
    );

    const removeFile = (fileIdToRemove: string) => {
        const filtered = uploadedFiles.filter(f => f.id !== fileIdToRemove);
        setUploadedFiles(filtered);
        onUploadComplete(filtered);
    };

    const dropzoneOptions: DropzoneOptions = {
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/gif": [".gif"],
            "image/webp": [".webp"],
            "application/pdf": [".pdf"],
            "text/plain": [".txt"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
        maxSize: 5 * 1024 * 1024, // 5MB limit on client side too
        disabled: isUploading || uploadedFiles.length >= maxFiles,
    };

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone(dropzoneOptions);

    // Handle initial client-side rejection errors (e.g., too big)
    React.useEffect(() => {
        if (fileRejections.length > 0) {
            toast.error("일부 파일이 거부되었습니다. (5MB 이하 이미지/문서만 가능)");
        }
    }, [fileRejections]);

    return (
        <div className={cn("space-y-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                    isDragActive ? "border-primary bg-primary/10" : "border-slate-300 hover:border-primary/50",
                    (isUploading || uploadedFiles.length >= maxFiles) && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
            >
                <input {...getInputProps()} />
                {isUploading ? (
                    <div className="flex flex-col items-center space-y-2 text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-sm font-medium">업로드 중...</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-2 text-slate-500">
                        <UploadCloud className={cn("w-10 h-10", isDragActive ? "text-primary" : "text-slate-400")} />
                        <span className="text-sm font-medium">
                            {isDragActive ? "이곳에 파일을 놓아주세요" : "클릭하거나 파일을 드래그하여 첨부 (최대 5MB)"}
                        </span>
                        <span className="text-xs text-slate-400">지원 형식: JPG, PNG, PDF, TXT, DOCX</span>
                    </div>
                )}
            </div>

            {/* Display Uploaded Files */}
            {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {uploadedFiles.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-3 border rounded-md bg-slate-50 dark:bg-slate-900"
                        >
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <FileIcon className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm truncate text-slate-700 dark:text-slate-300" title={file.fileName}>
                                    {file.fileName}
                                </span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-slate-500 hover:text-red-500 shrink-0"
                                onClick={() => removeFile(file.id)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
