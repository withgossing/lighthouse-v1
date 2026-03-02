import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    meta?: {
        totalCount?: number;
        page?: number;
        limit?: number;
    };
}

export function successResponse<T>(
    data: T,
    meta?: ApiResponse["meta"],
    status: number = 200
) {
    const response: ApiResponse<T> = {
        success: true,
        data,
    };
    if (meta) {
        response.meta = meta;
    }
    return NextResponse.json(response, { status });
}

export function errorResponse(
    message: string,
    status: number = 400
) {
    const response: ApiResponse = {
        success: false,
        error: message,
    };
    return NextResponse.json(response, { status });
}
