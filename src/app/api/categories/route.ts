import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/categories
 * Returns the hierarchical structure of Categories.
 * Supports filtering by parentId or fetching the whole tree.
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const fetchTree = searchParams.get("tree") === "true"; // Default flat otherwise

        // Option A: Fetch as a nested tree (useful for UI Dropdowns that support trees)
        if (fetchTree) {
            // Get all top-level categories (where parentId is null)
            const rootCategories = await prisma.category.findMany({
                where: { parentId: null },
                include: {
                    children: {
                        include: {
                            children: true, // Supports up to 3 levels deep. Add more nesting if needed.
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return successResponse(rootCategories);
        }

        // Option B: Fetch flat list (useful for simple selects, maybe filtering by parent)
        const parentId = searchParams.get("parentId");

        const categories = await prisma.category.findMany({
            where: parentId !== null ? {
                parentId: parentId === "root" ? null : parentId
            } : undefined,
            include: {
                parent: true
            },
            orderBy: { name: 'asc' }
        });

        return successResponse(categories);

    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return errorResponse("Failed to fetch categories", 500);
    }
}

// Ensure the Edge Runtime doesn't accidentally cache this
export const dynamic = "force-dynamic";
