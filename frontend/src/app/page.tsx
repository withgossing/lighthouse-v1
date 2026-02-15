import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  MessageSquare,
  Monitor,
  HelpCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">홍길동님, 환영합니다 👋</h1>
          <p className="text-gray-500">오늘 어떤 도움이 필요하신가요?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link href="/chat" className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 text-left block">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all"></div>
            <MessageSquare className="h-8 w-8 mb-4 text-white/90" />
            <h3 className="text-xl font-bold mb-2">새 문의 등록</h3>
            <p className="text-blue-100 text-sm">채팅 상담을 시작하거나 티켓을 남겨주세요.</p>
          </Link>

          <Link href="/remote" className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-purple-100 transition-all duration-300 transform hover:-translate-y-1 text-left block">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Monitor className="h-24 w-24 text-purple-600" />
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Monitor className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">원격 지원</h3>
            <p className="text-gray-500 text-sm">화면 공유를 통한 지원을 요청합니다.</p>
          </Link>

          <Link href="/knowledge" className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-emerald-300 hover:shadow-emerald-100 transition-all duration-300 transform hover:-translate-y-1 text-left block">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HelpCircle className="h-24 w-24 text-emerald-600" />
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">지식 베이스</h3>
            <p className="text-gray-500 text-sm">가이드 및 자주 묻는 질문을 검색하세요.</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Inquiries */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">최근 문의 내역</h2>
              <Link href="/tickets">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  모두 보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { id: 1, title: '트레이딩 시스템 로그인 오류', status: '처리중', date: '2분 전', type: '시스템 장애' },
                { id: 2, title: '채권 주문 체결 지연', status: '해결됨', date: '1일 전', type: '성능' },
                { id: 3, title: '계정 권한 요청', status: '대기중', date: '2일 전', type: '접근 권한' },
              ].map((ticket) => (
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
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{ticket.date}</span>
                            <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                              {ticket.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.status === '해결됨' ? 'bg-green-100 text-green-700' :
                        ticket.status === '처리중' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {ticket.status}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* System Status / Notices */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900">시스템 상태</h2>
            <Card className="bg-white border-0 shadow-lg shadow-gray-200/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">모든 시스템 정상 가동</CardTitle>
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-0">
                <div className="space-y-4">
                  {[
                    { name: '트레이딩 엔진', status: '정상', color: 'bg-green-500' },
                    { name: '시세 데이터 피드', status: '정상', color: 'bg-green-500' },
                    { name: '결제 게이트웨이', status: '점검중', color: 'bg-yellow-500' },
                  ].map((sys, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm font-medium text-gray-700">{sys.name}</span>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${sys.color}`}></div>
                        <span className="text-xs text-gray-500">{sys.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button variant="outline" size="sm" className="w-full text-xs">전체 상태 보고서 보기</Button>
              </CardFooter>
            </Card>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900">정기 점검 안내</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    이번 주 토요일 오전 2:00 ~ 4:00 (UTC) 시스템 정기 점검이 예정되어 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
