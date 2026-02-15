'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Construction, ArrowLeft, Search } from 'lucide-react';
import { Suspense } from 'react';

function KnowledgeBaseContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    return (
        <main className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8 flex justify-center">
                    <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center">
                        {query ? <Search className="h-12 w-12 text-blue-600" /> : <Construction className="h-12 w-12 text-blue-600" />}
                    </div>
                </div>

                {query ? (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">"{query}" 검색 결과 없음</h1>
                        <p className="text-gray-500 mb-8 text-lg">
                            죄송합니다. 요청하신 검색어에 대한 문서를 찾을 수 없습니다.<br />
                            문의 등록을 통해 직접 질문해주시기 바랍니다.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/tickets">
                                <Button variant="outline" className="gap-2">
                                    문의 내역 보기
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    대시보드로 돌아가기
                                </Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">지식 베이스 준비 중</h1>
                        <p className="text-gray-500 mb-8 text-lg">
                            현재 지식 베이스 서비스를 준비하고 있습니다.<br />
                            빠른 시일 내에 유용한 가이드와 정보를 제공해 드리겠습니다.
                        </p>
                        <Link href="/">
                            <Button className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                대시보드로 돌아가기
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}

export default function KnowledgeBasePage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
                <KnowledgeBaseContent />
            </Suspense>
        </div>
    );
}
