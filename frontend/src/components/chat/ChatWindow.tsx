'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Send, Paperclip, MoreVertical, Phone } from 'lucide-react';

interface Message {
    id: string;
    sender: 'user' | 'agent' | 'system';
    content: string;
    timestamp: string;
}

export const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'system', content: '김영희 상담원과 연결되었습니다.', timestamp: '10:00 AM' },
        { id: '2', sender: 'agent', content: '안녕하세요! 트레이딩 시스템 관련하여 어떤 도움이 필요하신가요?', timestamp: '10:01 AM' },
        { id: '3', sender: 'user', content: '채권 주문 시 오류가 발생해서 문의드립니다.', timestamp: '10:02 AM' },
    ]);
    const [inputText, setInputText] = useState('');

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            content: inputText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, newMessage]);
        setInputText('');
    };

    return (
        <Card className="flex flex-col h-[600px] shadow-xl border-t-4 border-t-blue-600">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-xl">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">김</div>
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">김영희 (Sarah)</h3>
                        <span className="text-xs text-green-600 font-medium">활동중 • 고객 지원팀</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="text-gray-500">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'system' ? (
                            <div className="w-full flex justify-center my-2">
                                <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{msg.content}</span>
                            </div>
                        ) : (
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                }`}>
                                <p className="text-sm">{msg.content}</p>
                                <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                                    }`}>
                                    {msg.timestamp}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-end gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 relative">
                        <textarea
                            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 max-h-32 min-h-[44px]"
                            placeholder="메시지를 입력하세요..."
                            rows={1}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.nativeEvent.isComposing) return;
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                    </div>
                    <Button onClick={handleSendMessage} className="rounded-lg h-11 w-11 p-0 flex items-center justify-center">
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};
