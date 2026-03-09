import { auth } from "@/../auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
        const baseUrl = process.env.INTERNAL_API_URL || 'http://localhost:18012';
        const dest = new URL(pathname + req.nextUrl.search, baseUrl);

        const requestHeaders = new Headers(req.headers);
        if (req.auth?.user) {
            requestHeaders.set('x-user-id', req.auth.user.id || '');
            requestHeaders.set('x-user-role', (req.auth.user as any).role || 'USER');
        }

        return NextResponse.rewrite(dest, {
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/api/:path*'],
};
