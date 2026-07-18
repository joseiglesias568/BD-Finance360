'use client';

import type { FinancialConfig, KPIConfig } from '@/config/types';
import { insightCharts } from '@/config';
import DisclaimerModal from '@/components/DisclaimerModal';
import HomeTileSection, { buildHomeTiles } from '@/components/home/CFOTiles';
import type { CFOTileData } from '@/components/home/CFOTiles';
import InsightDetailModal from '@/components/home/InsightDetailModal';
import { personalizedInsights } from '@/lib/ai/insights-data';
import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PersonalizedInsight } from '@/lib/ai/search-types';

// Suggested search queries for the hero chips
const suggestedQueries = [
    'How is our market share trending?',
    'What is our adjusted operating margin?',
    'How is third-party MRO revenue scaling?',
    'How are Chart integration synergies tracking vs. plan?',
];

interface HomeClientProps {
    kpiConfig: KPIConfig;
    financials: FinancialConfig;
}

export default function HomeClient({ kpiConfig, financials }: HomeClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInsight, setSelectedInsight] = useState<PersonalizedInsight | null>(null);
    const [searchFocused, setSearchFocused] = useState(false);

    // Build the 3 tile sections from database data
    const { heroTiles, strategicTiles, riskTiles } = buildHomeTiles(kpiConfig, financials);

    const handleAISearch = () => {
        if (!searchQuery.trim()) return;
        router.push(`/ai-search?q=${encodeURIComponent(searchQuery.trim())}`);
    };

    // ── Tile click → InsightDetailModal ──────────────────────────────
    const handleTileClick = (tile: CFOTileData) => {
        const insight = personalizedInsights.find(i => i.id === tile.insightId);
        if (insight) {
            setSelectedInsight(insight);
        }
    };

    const handleCloseModal = () => setSelectedInsight(null);

    const handleViewConsole = () => {
        if (selectedInsight?.consoleLink) {
            router.push(selectedInsight.consoleLink);
            setSelectedInsight(null);
        }
    };

    return (
        <div className="flex-1 bg-gray-50/50">
            {/* Dark Green Hero Banner */}
            <div className="relative overflow-hidden px-8" style={{ background: 'linear-gradient(135deg, #003B2C 0%, #003322 30%, #003B2C 70%, #003B2C 100%)' }}>
                {/* Subtle texture overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                {/* Soft radial glow */}
                <div className="absolute top-0 right-0 w-[50%] h-[120%] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(212,233,226,0.06) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 w-[40%] h-[100%] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(0,92,62,0.15) 0%, transparent 60%)' }} />
                <div className="max-w-7xl mx-auto pt-20 pb-16">
                    {/* Centered Search Bar + Overlay Chips */}
                    <div className="relative mb-24">
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                                    placeholder="Finance search..."
                                    className="w-full pl-14 pr-16 py-4 text-base bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40 transition-all placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleAISearch}
                                    disabled={!searchQuery.trim()}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2.5 bg-[#F0F0F0] text-[#003B2C] rounded-xl hover:bg-[#003B2C] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Sparkles className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Suggested Query Chips — overlay, no layout shift */}
                        <div
                            className={`absolute left-0 right-0 top-full mt-4 flex flex-wrap justify-center gap-3 transition-opacity duration-200 pointer-events-none ${
                                searchFocused ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            {suggestedQueries.map((q) => (
                                <button
                                    key={q}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        router.push(`/ai-search?q=${encodeURIComponent(q)}`);
                                    }}
                                    className={`inline-flex items-center space-x-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/90 hover:bg-white/20 hover:border-white/30 transition-all ${
                                        searchFocused ? 'pointer-events-auto' : ''
                                    }`}
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-white/60" />
                                    <span>{q}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Section 1: Financial Scorecard — IN the hero */}
                    <HomeTileSection
                        sectionTitle="Financial Scorecard"
                        sectionSubtitle="CFO scoreboard — EPS, free cash flow, adjusted operating margin, and capital allocation — within BD's framework of organic revenue growth, portfolio optimization, and balance-sheet discipline (Christopher J. DelOrefice, CFO)."
                        linkHref="/executive-summary"
                        linkLabel="Executive Summary"
                        tiles={heroTiles}
                        variant="hero"
                        onTileClick={handleTileClick}
                    />
                </div>
            </div>

            {/* White Sections */}
            <div className="px-8 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Section 2: Strategic Execution */}
                    <HomeTileSection
                        sectionTitle="Strategic Execution"
                        sectionSubtitle="BD segment revenue growth, Alaris market return, BioPharma Systems GLP-1 pipeline, and BD Simplify cost efficiency (per investor materials & earnings commentary)."
                        linkHref="/monthly-report"
                        linkLabel="Monthly Report"
                        tiles={strategicTiles}
                        variant="white"
                        onTileClick={handleTileClick}
                    />

                    {/* Section 3: Risk & Growth Radar */}
                    <HomeTileSection
                        sectionTitle="Risk & Growth Radar"
                        sectionSubtitle="Forward-looking risks and opportunities"
                        tiles={riskTiles}
                        variant="white"
                        onTileClick={handleTileClick}
                    />
                </div>
            </div>

            {/* InsightDetailModal — opens when any tile is clicked */}
            {selectedInsight && (
                <InsightDetailModal
                    insight={selectedInsight}
                    onClose={handleCloseModal}
                    onViewConsole={handleViewConsole}
                    insightCharts={insightCharts.charts}
                />
            )}

            {/* Disclaimer Modal */}
            <DisclaimerModal />
        </div>
    );
}
