'use client';

import { Sparkles } from 'lucide-react';
import { useState } from 'react';

interface AISearchSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSearch: () => void;
    isSearching: boolean;
}

const suggestedPrompts = [
    'How is our market share trending?',
    'What is our operating margin?',
    'Leasing revenue performance',
    'How is our AUM growing?',
];

export default function AISearchSection({
    searchQuery,
    setSearchQuery,
    onSearch,
    isSearching,
}: AISearchSectionProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    const triggerSearch = (query: string) => {
        setSearchQuery(query);
        setTimeout(onSearch, 100);
    };

    return (
        <div className="px-8 pt-20 pb-16">
            <div className="max-w-3xl mx-auto text-center">
                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Finance search..."
                        className="w-full pl-6 pr-16 py-4 text-base bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-gray-400"
                    />
                    <button
                        onClick={onSearch}
                        disabled={isSearching || !searchQuery.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#003B2C] text-white p-3 rounded-xl hover:bg-[#007A3D] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSearching ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Suggested Prompts - single row */}
                <div className="flex items-center justify-center gap-2.5 mt-4">
                    {suggestedPrompts.map((q) => (
                        <button
                            key={q}
                            onClick={() => triggerSearch(q)}
                            className="flex items-center space-x-1.5 text-xs text-white/80 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full transition-colors border border-white/10 whitespace-nowrap"
                        >
                            <Sparkles className="w-3 h-3 flex-shrink-0" />
                            <span>{q}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
