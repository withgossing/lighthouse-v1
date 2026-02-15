import React from 'react';
import { Header } from '@/components/layout/Header';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 py-8 h-[calc(100vh-64px)]">
                <div className="max-w-4xl mx-auto h-full pb-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">지원 채팅</h1>
                        <p className="text-gray-500">문의 사항이 있으시면 언제든지 상담원에게 물어보세요.</p>
                    </div>
                    <ChatWindow />
                </div>
            </main>
        </div>
    );
}
