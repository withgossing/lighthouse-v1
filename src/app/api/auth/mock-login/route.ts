import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

// QA/Security Agent Feedback: Strictly forbid this route in production.
if (process.env.NODE_ENV === "production") {
    throw new Error("This route is disabled in production.");
}

/**
 * POST /api/auth/mock-login
 * A backdoor route to create a test user and obtain a session cookie.
 * Request Body: { role: "ADMIN" | "USER", name?: string, email?: string }
 */
export async function POST(req: NextRequest) {
    // Double-check environment just in case.
    if (process.env.NODE_ENV === "production") {
        return errorResponse("Forbidden Route", 403);
    }

    try {
        const body = await req.json();
        const role: Role = body.role === "ADMIN" ? "ADMIN" : "USER";
        const name = body.name || `Test ${role}`;
        const email = body.email || `test-${role.toLowerCase()}@example.com`;
        const externalId = `mock-ext-${Date.now()}`;

        // Find existing or create newly mocked user
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    role,
                    externalId,
                },
            });
        }

        // Create a simple mock session string
        const sessionData = {
            userId: user.id,
            role: user.role,
        };

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set("lighthouse_mock_session", JSON.stringify(sessionData), {
            httpOnly: true,
            secure: (process.env.NODE_ENV as string) === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return successResponse({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }, undefined, 200);

    } catch (error: any) {
        return errorResponse(error.message || "Failed to login", 500);
    }
}

// Ensure the Edge Runtime doesn't accidentally cache this
export const dynamic = "force-dynamic";
