"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldAlert, UserIcon } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { signIn } = await import("next-auth/react");
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
            } else {
                toast.success(`로그인 성공`);
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            toast.error("네트워크 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
            <Card className="w-full max-w-md shadow-lg border-primary/20">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Lighthouse 헬프데스크</CardTitle>
                    <CardDescription>
                        로그인할 권한을 선택해 주세요. (MVP 테스트용 모의 로그인)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">이메일</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">비밀번호</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="비밀번호 입력"
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full mt-2"
                            disabled={loading}
                        >
                            {loading ? "로그인 중..." : "로그인"}
                        </Button>
                    </form>

                    <div className="relative mt-6 mb-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
                                빠른 테스트 계정 안내
                            </span>
                        </div>
                    </div>

                    <div className="text-xs text-center text-slate-500 space-y-1">
                        <p>관리자: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">test-admin@example.com</code> / <code>mockpassword</code></p>
                        <p>사용자: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">test-user@example.com</code> / <code>mockpassword</code></p>
                    </div>
                </CardContent>
                <CardFooter className="text-center text-sm text-slate-500 justify-center">
                    실제 운영 환경에서는 사내 SSO(싱글 사인온) 계정 연동으로 대체됩니다.
                </CardFooter>
            </Card>
        </div>
    );
}
