'use client';
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Monitor, Share2, StopCircle, Video } from 'lucide-react';

export default function RemoteSupportPage() {
    const [isSharing, setIsSharing] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startSharing = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false // Screen sharing usually doesn't need audio in this context
            });
            setStream(mediaStream);
            setIsSharing(true);

            // Handle stream stop (user clicks "Stop Sharing" in browser UI)
            mediaStream.getVideoTracks()[0].onended = () => {
                setIsSharing(false);
                setStream(null);
            };

        } catch (err) {
            console.error("Error starting screen share:", err);
            // alert("Could not start screen sharing.");
        }
    };

    const stopSharing = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsSharing(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">원격 지원 세션</h1>
                            <p className="text-gray-500">상담원과 화면을 공유하여 지원을 받으세요.</p>
                        </div>
                        {isSharing && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full animate-pulse">
                                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                                <span className="text-sm font-bold">화면 공유 중</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Control Panel */}
                        <div className="space-y-6">
                            <Card className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">세션 제어</h3>

                                {!isSharing ? (
                                    <Button
                                        onClick={startSharing}
                                        className="w-full h-12 text-base"
                                    >
                                        <Share2 className="mr-2 h-5 w-5" /> 내 화면 공유하기
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={stopSharing}
                                        variant="danger"
                                        className="w-full h-12 text-base"
                                    >
                                        <StopCircle className="mr-2 h-5 w-5" /> 공유 중지
                                    </Button>
                                )}

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="text-sm font-bold text-blue-900 mb-2">사용 안내</h4>
                                    <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                                        <li>상담원의 요청이 있으면 "내 화면 공유하기"를 클릭하세요.</li>
                                        <li>공유할 화면이나 창을 선택하세요.</li>
                                        <li>상담원이 고객님의 화면을 볼 수 있게 됩니다.</li>
                                        <li>언제든지 공유를 중지할 수 있습니다.</li>
                                    </ul>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">상담원 상태</h3>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Monitor className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium">상담원 연결 대기중...</div>
                                        <div className="text-xs text-gray-500">세션 ID: #8392-12</div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Preview Area */}
                        <div className="md:col-span-2">
                            <Card className="h-[500px] flex items-center justify-center bg-gray-900 overflow-hidden relative">
                                {isSharing && stream ? (
                                    <video
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-contain"
                                        ref={video => {
                                            if (video && stream) video.srcObject = stream;
                                        }}
                                    />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <div className="h-20 w-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Video className="h-10 w-10 text-gray-600" />
                                        </div>
                                        <p className="text-lg font-medium text-gray-400">화면 미리보기가 여기에 표시됩니다</p>
                                        <p className="text-sm text-gray-600 mt-2">활성화된 화면 공유 세션이 없습니다</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
