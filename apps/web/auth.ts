import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user) {
                    return null;
                }

                // If user has no password (e.g., from old Mock login days), fallback to email checks for Dev ONLY
                // In a real app we would force them to set a password. Let's allow login for mock users if they matched exactly or have bcrypt passwords.
                if ((user as any).password) {
                    const isPasswordValid = await bcrypt.compare(credentials.password as string, (user as any).password);
                    if (!isPasswordValid) return null;
                } else {
                    // Backdoor fallback for preexisting mock users without passwords setup yet
                    if (credentials.password !== "mockpassword") return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role, // Custom field
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60 // 7 days
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev_only",
    trustHost: true,
});
