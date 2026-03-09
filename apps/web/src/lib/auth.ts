import { auth } from "@/../auth";
import { prisma } from "@/lib/prisma";

export interface SessionData {
    userId: string;
    role: "ADMIN" | "USER";
}

/**
 * Parses the session securely using NextAuth v5.
 */
export async function getSession(): Promise<SessionData | null> {
    const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    return {
        userId: session.user.id,
        role: (session.user as any).role || "USER",
    };
}

/**
 * Retrieves the full user record from the database using the current session.
 */
export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
    });

    return user;
}

/**
 * Middleware-like function to enforce authentication at the API route level.
 * Use this to quickly reject unauthorized requests.
 */
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("UNAUTHORIZED");
    }
    return user;
}
