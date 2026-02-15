'use client';

import React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { ArrowLeft, Clock, CheckCircle2, FileText, User, MessageSquare } from 'lucide-react';

// Mock data - in a real app this would come from an API
const TICKETS = [
    {
        id: 1, title: '트레이딩 시스템 로그인 오류', status: '처리중', date: '2024-02-15 10:30', type: '시스템 장애', description: '트레이딩 시스템에 로그인하려고 할 때 500 Internal Server Error가 발생합니다. 크롬 브라우저를 사용 중이며, 캐시 삭제 후에도 동일한 문제가 지속됩니다.', author: '홍길동', updates: [
            { id: 1, author: '김영희 (상담원)', content: '안녕하세요. 불편을 드려 죄송합니다. 현재 서버 로그를 확인 중입니다.', date: '2024-02-15 10:35' }
        ]
    },
    {
        id: 2, title: '채권 주문 체결 지연', status: '해결됨', date: '2024-02-14 14:20', type: '성능', description: '국채 3년물 주문 체결이 평소보다 3초 이상 지연되는 현상이 발생했습니다.', author: '홍길동', updates: [
            { id: 1, author: '시스템', content: '티켓이 접수되었습니다.', date: '2024-02-14 14:20' },
            { id: 2, author: '이철수 (엔지니어)', content: '네트워크 지연 문제를 확인하고 수정했습니다. 현재는 정상적으로 체결되고 있습니다.', date: '2024-02-14 15:00' }
        ]
    },
    { id: 3, title: '계정 권한 요청', status: '대기중', date: '2024-02-13 09:15', type: '접근 권한', description: '해외 채권 트레이딩 데스크 접근 권한 부여를 요청드립니다. 부서 이동으로 인한 권한 변경입니다.', author: '홍길동', updates: [] },
    { id: 4, title: '시세 데이터 불일치', status: '처리중', date: '2024-02-12 11:00', type: '데이터', description: 'USD/KRW 환율 데이터가 로이터 단말기와 약 5pip 차이가 납니다. 확인 부탁드립니다.', author: '홍길동', updates: [] },
    { id: 5, title: 'VPN 접속 불안정', status: '해결됨', date: '2024-02-08 18:00', type: '네트워크', description: '재택 근무 중 VPN 연결이 30분마다 끊어지는 현상이 있습니다.', author: '홍길동', updates: [] },
];

export default function TicketDetailPage() {
    const params = useParams();
    const id = Number(params?.id);
    const ticket = TICKETS.find(t => t.id === id);

    if (!ticket) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <main className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">문의 내역을 찾을 수 없습니다.</h1>
                    <Link href="/tickets">
                        <Button>목록으로 돌아가기</Button>
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Link href="/tickets">
                            <Button variant="ghost" size="sm" className="pl-0 gap-2 text-gray-500 hover:text-gray-900">
                                <ArrowLeft className="h-4 w-4" />
                                목록으로 돌아가기
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                    {ticket.type}
                                </span>
                                <span className="text-sm text-gray-500">{ticket.date}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${ticket.status === '해결됨' ? 'bg-green-100 text-green-700' :
                            ticket.status === '처리중' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {ticket.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-white border border-gray-200 shadow-sm">
                                <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
                                    <h3 className="font-semibold text-gray-900">문의 내용</h3>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                        {ticket.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="bg-gray-50 border-t border-gray-100 py-3 px-6">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">작성자: {ticket.author}</span>
                                    </div>
                                </CardFooter>
                            </Card>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    답변 및 업데이트
                                </h3>

                                {ticket.updates && ticket.updates.length > 0 ? (
                                    ticket.updates.map((update) => (
                                        <Card key={update.id} className="bg-white border border-gray-200">
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-900">{update.author}</span>
                                                    <span className="text-xs text-gray-500">{update.date}</span>
                                                </div>
                                                <p className="text-gray-700 text-sm">{update.content}</p>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <p className="text-gray-500">아직 등록된 답변이 없습니다.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Card className="p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">상태 타임라인</h3>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent">
                                    <div className="relative flex gap-6 pb-2">
                                        <div className="absolute left-0 mt-1 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-sm z-10">
                                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        </div>
                                        <div className="flex-1 ml-12">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="font-bold text-gray-900 text-sm">티켓 접수됨</div>
                                                <time className="text-gray-400 text-xs">{ticket.date.split(' ')[0]}</time>
                                            </div>
                                            <div className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">문의 내용이 시스템에 등록되었습니다.</div>
                                        </div>
                                    </div>

                                    {ticket.status === '해결됨' && (
                                        <div className="relative flex gap-6 pb-2">
                                            <div className="absolute left-0 mt-1 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-100 text-green-600 shadow-sm z-10">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 ml-12">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="font-bold text-gray-900 text-sm">해결됨</div>
                                                    <time className="text-gray-400 text-xs">{ticket.date.split(' ')[0]}</time>
                                                </div>
                                                <div className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">문제가 해결되었습니다.</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
