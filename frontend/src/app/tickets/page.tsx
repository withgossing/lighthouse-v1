'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, FileText, Clock, CheckCircle2, Search, Filter } from 'lucide-react';

export default function TicketListPage() {
    const tickets = [
        { id: 1, title: '트레이딩 시스템 로그인 오류', status: '처리중', date: '2분 전', type: '시스템 장애', description: '로그인 시 500 에러가 발생합니다.' },
        { id: 2, title: '채권 주문 체결 지연', status: '해결됨', date: '1일 전', type: '성능', description: '주문 체결이 평소보다 3초 이상 지연됩니다.' },
        { id: 3, title: '계정 권한 요청', status: '대기중', date: '2일 전', type: '접근 권한', description: '해외 채권 트레이딩 권한 부여 부탁드립니다.' },
        { id: 4, title: '시세 데이터 불일치', status: '처리중', date: '3일 전', type: '데이터', description: 'USD/KRW 환율 데이터가 로이터와 다릅니다.' },
        { id: 5, title: 'VPN 접속 불안정', status: '해결됨', date: '1주 전', type: '네트워크', description: '재택 근무 중 VPN 연결이 자꾸 끊깁니다.' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">문의 내역</h1>
                            <p className="text-gray-500">접수된 모든 문의 사항을 확인하세요.</p>
                        </div>
                        <Link href="/">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                돌아가기
                            </Button>
                        </Link>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="문의 검색..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            필터
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <Link key={ticket.id} href={`/tickets/${ticket.id}`} className="block">
                                <Card className="group hover:border-blue-200 transition-colors cursor-pointer">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${ticket.status === '해결됨' ? 'bg-green-100 text-green-600' :
                                                ticket.status === '처리중' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>
                                                {ticket.status === '해결됨' ? <CheckCircle2 className="h-5 w-5" /> :
                                                    ticket.status === '처리중' ? <Clock className="h-5 w-5" /> :
                                                        <FileText className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{ticket.title}</h4>
                                                <p className="text-sm text-gray-500 line-clamp-1">{ticket.description}</p>
                                                <div className="flex items-center gap-2 mt-1 md:hidden">
                                                    <span className="text-xs text-gray-500">{ticket.date}</span>
                                                    <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                                        {ticket.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="hidden md:flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                                        {ticket.type}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{ticket.date}</span>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${ticket.status === '해결됨' ? 'bg-green-100 text-green-700' :
                                                ticket.status === '처리중' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {ticket.status}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
