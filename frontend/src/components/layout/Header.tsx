'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Menu, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/knowledge?q=${encodeURIComponent(searchQuery)}`);
        }
    };

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
                    <Button variant="ghost" size="sm" className="relative text-gray-500 hover:text-gray-700">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                    </Button>
                    <div className="h-8 w-px bg-gray-200 mx-1"></div>
                    <div className="flex items-center gap-3 pl-1">
                        <div className="hidden text-right md:block">
                            <div className="text-sm font-medium text-gray-900">홍길동</div>
                            <div className="text-xs text-gray-500">트레이딩 팀</div>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            <User className="h-5 w-5 text-gray-500" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
