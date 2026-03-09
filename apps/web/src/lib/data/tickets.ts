import { getSession } from "@/lib/auth";

export async function getTicketById(id: string) {
    const session = await getSession();
    if (!session) return null;

    try {
        const baseUrl = process.env.INTERNAL_API_URL || 'http://localhost:18012';
        const res = await fetch(`${baseUrl}/api/tickets/${id}`, {
            headers: {
                'x-user-id': session.userId,
                'x-user-role': session.role
            },
            cache: 'no-store'
        });
        const json = await res.json();

        if (!json.success) return null;

        return { ticket: json.data, currentUser: session };
    } catch (e) {
        console.error("Failed to fetch ticket by ID from backend", e);
        return null;
    }
}
