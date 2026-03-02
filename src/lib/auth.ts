import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export interface SessionData {
    userId: string;
    role: "ADMIN" | "USER";
}

/**
 * Parses the mock session cookie to retrieve the current user's session data.
 * In a real environment, this would verify a JWT or check a real session store.
 */
export async function getSession(): Promise<SessionData | null> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("lighthouse_mock_session")?.value;

    if (!sessionToken) {
        return null;
    }

    try {
        const sessionData = JSON.parse(sessionToken) as SessionData;
        return sessionData;
    } catch (e) {
        return null;
    }
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
