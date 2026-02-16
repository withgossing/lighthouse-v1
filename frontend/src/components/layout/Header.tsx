'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Menu, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Mock Notifications
    const notifications = [
        { id: 1, text: '새로운 시스템 업데이트가 예정되어 있습니다.', time: '10분 전', read: false, type: 'system', link: '/' },
        { id: 2, text: '김철수님이 티켓 #1234에 댓글을 남겼습니다.', time: '1시간 전', read: false, type: 'ticket', link: '/tickets/1234' },
        { id: 3, text: 'VPN 연결 오류가 해결되었습니다.', time: '어제', read: true, type: 'alert', link: '/remote' },
    ];

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/knowledge?q=${encodeURIComponent(searchQuery)}`);
            setShowNotifications(false);
            setShowUserMenu(false);
        }
    };

    const handleNotificationClick = (notification: any) => {
        setShowNotifications(false);
        setShowUserMenu(false);
        if (notification.link) {
            router.push(notification.link);
        }
    };

    // Close popovers when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.notification-container') && !target.closest('.user-menu-container')) {
                setShowNotifications(false);
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">L</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hidden md:block">
                            Lighthouse
                        </span>
                    </Link>
                </div>

                <div className="flex-1 max-w-md mx-8 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="해결 방법 검색..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Notification Bell */}
                    <div className="relative notification-container">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="relative text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowUserMenu(false);
                            }}
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </Button>

                        {/* Notification Popover */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900">알림</h3>
                                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">모두 읽음</button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <p className="text-sm text-gray-800 mb-1">{notification.text}</p>
                                            <p className="text-xs text-gray-500">{notification.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-xl text-center">
                                    <button className="text-xs text-gray-500 hover:text-gray-900 font-medium">전체 알림 보기</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-1"></div>

                    {/* User Profile */}
                    <div className="relative user-menu-container">
                        <button
                            className="flex items-center gap-3 pl-1 focus:outline-none"
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false);
                            }}
                        >
                            <div className="hidden text-right md:block">
                                <div className="text-sm font-medium text-gray-900">홍길동</div>
                                <div className="text-xs text-gray-500">트레이딩 팀</div>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 transition-shadow hover:shadow-md">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                                    <div className="text-sm font-medium text-gray-900">홍길동</div>
                                    <div className="text-xs text-gray-500">트레이딩 팀</div>
                                </div>
                                <div className="py-1">
                                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                        내 프로필
                                    </Link>
                                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                        설정
                                    </Link>
                                    <Link href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                        도움말
                                    </Link>
                                </div>
                                <div className="border-t border-gray-100 py-1">
                                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">
                                        로그아웃
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
