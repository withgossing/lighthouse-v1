"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldAlert, UserIcon } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<"ADMIN" | "USER" | null>(null);

    const handleLogin = async (role: "ADMIN" | "USER") => {
        setLoading(role);
        try {
            const response = await fetch("/api/auth/mock-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success(`Logged in successfully as ${role}`);
                router.push("/");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to login");
            }
        } catch (error) {
            toast.error("Network error during login");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
            <Card className="w-full max-w-md shadow-lg border-primary/20">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Lighthouse Helpdesk</CardTitle>
                    <CardDescription>
                        Select a role to continue. This is a mock login for MVP development purposes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-3">
                        <Button
                            size="lg"
                            className="w-full h-14 text-md"
                            onClick={() => handleLogin("ADMIN")}
                            disabled={loading !== null}
                        >
                            {loading === "ADMIN" ? "Authenticating..." : (
                                <>
                                    <ShieldAlert className="w-5 h-5 mr-2" />
                                    Login as IT Admin
                                </>
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
                                    Or
                                </span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full h-14 text-md"
                            onClick={() => handleLogin("USER")}
                            disabled={loading !== null}
                        >
                            {loading === "USER" ? "Authenticating..." : (
                                <>
                                    <UserIcon className="w-5 h-5 mr-2" />
                                    Login as General User
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="text-center text-sm text-slate-500 justify-center">
                    For production, this will be replaced with real SSO Provider.
                </CardFooter>
            </Card>
        </div>
    );
}
