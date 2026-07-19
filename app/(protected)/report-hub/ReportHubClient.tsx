'use client';

import type { ReportsConfig, ReportTemplate } from '@/config/types';
import { roundFinancial } from '@/lib/engines';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar,
    ChevronRight,
    Clock,
    Download,
    Eye,
    ExternalLink,
    Filter,
    Grid,
    Heart,
    Info,
    LayoutDashboard,
    List,
    Play,
    Search,
    Share2,
    Star,
    TrendingUp,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Console short names for card badges
const CONSOLE_SHORT: Record<string, string> = {
    'north-america-performance': 'NA Perf',
    'international-performance': 'Intl',
    'channel-development': 'Channel Dev',
    'competitive-intelligence': 'Competitive',
    'store-operations-excellence': 'Property Ops',
    'store-development-pipeline': 'Portfolio Dev',
    'menu-product-strategy': 'Service Lines',
    'supply-chain-procurement': 'Supply Chain',
    'digital-mobile-loyalty': 'Digital/Platform',
    'brand-marketing': 'Brand & Mktg',
    'partner-experience': 'Employee Exp',
    'financial-performance-capital': 'Financial',
    'capital-allocation': 'Capital Alloc',
    'risk-compliance-sustainability': 'Risk & Compl',
};

// Recently-viewed helpers (localStorage)
const RV_KEY = 'report-hub-recently-viewed';
function getRecentlyViewed(): string[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(RV_KEY) || '[]'); } catch { return []; }
}
function addRecentlyViewed(externalId: string) {
    const list = getRecentlyViewed().filter(id => id !== externalId);
    list.unshift(externalId);
    localStorage.setItem(RV_KEY, JSON.stringify(list.slice(0, 12)));
}

// Add sequential UI id and normalize lastUpdated — all other fields come from config/DB directly
function enrichReport(r: ReportTemplate, idx: number) {
    return {
        ...r,
        id: idx + 1,
        externalId: r.id,
        lastUpdated: r.lastGenerated ?? 'Mar 2025',
        rating: roundFinancial(r.rating, 1),
    };
}

// Build unique sorted values from report data for filter dropdowns
function buildFilterOptions(reports: ReturnType<typeof enrichReport>[]) {
    const departments = Array.from(new Set(reports.map(r => r.department))).sort();
    const formats = Array.from(new Set(reports.map(r => r.format))).sort();
    const frequencies = Array.from(new Set(reports.map(r => r.frequency))).sort();
    return { departments, formats, frequencies };
}

// Build category tabs from DB categories
function buildCategories(reports: ReturnType<typeof enrichReport>[]) {
    const cats = [{ id: 'all', name: 'All Reports', count: reports.length }];
    const catCounts: Record<string, number> = {};
    for (const r of reports) {
        catCounts[r.category] = (catCounts[r.category] || 0) + 1;
    }
    for (const [cat, count] of Object.entries(catCounts)) {
        cats.push({ id: cat, name: cat, count });
    }
    return cats;
}

// Simple client-side filter
function filterReports(reports: ReturnType<typeof enrichReport>[], opts: { category: string; department: string; frequency: string; format: string; rating: number }) {
    return reports.filter(r => {
        if (opts.category !== 'all' && r.category !== opts.category) return false;
        if (opts.department && r.department !== opts.department) return false;
        if (opts.frequency && r.frequency !== opts.frequency) return false;
        if (opts.format && r.format !== opts.format) return false;
        if (opts.rating && r.rating < opts.rating) return false;
        return true;
    });
}

// Simple client-side search
function searchReports(reports: ReturnType<typeof enrichReport>[], query: string) {
    const q = query.toLowerCase();
    return reports.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
}

// Recommend similar reports by category
function getRecommendations(current: ReturnType<typeof enrichReport>, all: ReturnType<typeof enrichReport>[]) {
    return all.filter(r => r.id !== current.id && r.category === current.category).slice(0, 6);
}

interface ReportHubClientProps {
    reportsConfig: ReportsConfig;
}

export default function ReportHubClient({ reportsConfig }: ReportHubClientProps) {
    const router = useRouter();

    // Enrich DB reports with UI fields
    const allReports = useMemo(() => reportsConfig.reports.map((r, i) => enrichReport(r, i)), [reportsConfig]);

    // Recently viewed reports (from localStorage)
    const [recentIds, setRecentIds] = useState<string[]>([]);
    useEffect(() => { setRecentIds(getRecentlyViewed()); }, []);
    const recentReports = useMemo(() => {
        return recentIds.map(id => allReports.find(r => r.externalId === id)).filter(Boolean) as typeof allReports;
    }, [recentIds, allReports]);
    const reportCategories = useMemo(() => buildCategories(allReports), [allReports]);
    const filterOptions = useMemo(() => buildFilterOptions(allReports), [allReports]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [displayCount, setDisplayCount] = useState(24);

    // Filter states
    const [filters, setFilters] = useState({
        department: '',
        frequency: '',
        format: '',
        rating: 0
    });

    // Get filtered reports
    const filteredReports = filterReports(
        searchQuery ? searchReports(allReports, searchQuery) : allReports,
        { ...filters, category: selectedCategory }
    );

    // Toggle favorite
    const toggleFavorite = (reportId: number) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(reportId)) {
                newFavorites.delete(reportId);
            } else {
                newFavorites.add(reportId);
            }
            return newFavorites;
        });
    };

    // Report Card Component - Vertical Magazine Style
    const ReportCard = ({ report }: { report: any }) => {
        const categoryBorderColor = report.category === 'Revenue & Market' ? 'border-l-emerald-600' :
            report.category === 'Property & Operations' ? 'border-l-amber-500' :
                report.category === 'Digital & Customer' ? 'border-l-indigo-500' :
                    report.category === 'People & Culture' ? 'border-l-orange-500' :
                        report.category === 'Financial Performance' ? 'border-l-blue-500' :
                            report.category === 'Risk & Sustainability' ? 'border-l-red-500' :
                                'border-l-gray-300';

        return (
            <motion.div
                className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer p-4 border-l-[3px] ${categoryBorderColor} ${
                    report.isNew ? 'bg-blue-50/30' : report.isTrending ? 'bg-amber-50/30' : ''
                }`}
                onClick={() => setSelectedReport(report)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
            >
                {/* Category Badge */}
                <div className="flex items-start justify-between mb-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${report.category === 'Revenue & Market' ? 'bg-emerald-100 text-emerald-700' :
                        report.category === 'Property & Operations' ? 'bg-amber-100 text-amber-700' :
                            report.category === 'Digital & Customer' ? 'bg-indigo-100 text-indigo-700' :
                                report.category === 'People & Culture' ? 'bg-orange-100 text-orange-700' :
                                    report.category === 'Financial Performance' ? 'bg-blue-100 text-blue-700' :
                                        report.category === 'Risk & Sustainability' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                        }`}>
                        {report.format}
                    </span>
                    {(report.isNew || report.isTrending) && (
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${report.isNew ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {report.isNew ? 'New' : <TrendingUp className="w-3 h-3" />}
                        </span>
                    )}
                </div>

                {/* Report Title */}
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5 line-clamp-2 min-h-[2.5rem]">
                    {report.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-2 line-clamp-2 min-h-[2rem]">
                    {report.description}
                </p>

                {/* Console link indicator */}
                {report.relatedConsoleId && CONSOLE_SHORT[report.relatedConsoleId] && (
                    <div className="flex items-center mb-2 text-xs text-[#1c519c] bg-[#F0F0F0]/50 rounded px-2 py-1">
                        <LayoutDashboard className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{CONSOLE_SHORT[report.relatedConsoleId]}</span>
                    </div>
                )}

                {/* Key Info Grid - Compact */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-gray-500">{report.frequency}</div>
                    </div>
                    <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-gray-500">{report.department}</div>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-0.5" />
                            {report.rating}
                        </span>
                        <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-0.5" />
                            {(report.views / 1000).toFixed(0)}k
                        </span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(report.id);
                        }}
                        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                    >
                        <Heart className={`w-3.5 h-3.5 ${favorites.has(report.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Top Section - Title and Stats */}
                    <div className="py-6 space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Report HUB</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Navigate your current reporting landscape. As new consoles are created, reports will be retired and redirect you to the appropriate digital tools.
                                </p>
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#1c519c]">{allReports.length}</div>
                                    <div className="text-xs text-gray-500">Total Reports</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-600">{allReports.filter(r => r.relatedConsoleId).length}</div>
                                    <div className="text-xs text-gray-500">Console-Linked</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-amber-600">{allReports.filter(r => r.isTrending).length}</div>
                                    <div className="text-xs text-gray-500">Trending</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#1c519c]">{favorites.size}</div>
                                    <div className="text-xs text-gray-500">Favorites</div>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar - Moved to its own row */}
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1 max-w-2xl">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1c519c] focus:border-[#1c519c] bg-gray-50"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-3 rounded-lg border transition-colors flex items-center space-x-2 ${showFilters ? 'bg-[#F0F0F0] border-[#1c519c] text-[#1c519c]' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-medium">Filters</span>
                            </button>
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                        }`}
                                    title="Grid view"
                                >
                                    <Grid className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                        }`}
                                    title="List view"
                                >
                                    <List className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Category Tabs - Cleaner design */}
                        <div className="border-t border-gray-100 -mx-8 px-8 pt-4">
                            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                                {reportCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${selectedCategory === category.id
                                                ? 'bg-[#1c519c] text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span>{category.name}</span>
                                        <span className={`text-xs ${selectedCategory === category.id ? 'text-emerald-200' : 'text-gray-500'
                                            }`}>
                                            {category.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Frequency quick filters */}
                            <div className="flex items-center space-x-2 mt-2 pb-2">
                                <span className="text-xs text-gray-400 font-medium mr-1">Cadence:</span>
                                {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(freq => (
                                    <button
                                        key={freq}
                                        onClick={() => setFilters(f => ({ ...f, frequency: f.frequency === freq ? '' : freq }))}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                            filters.frequency === freq
                                                ? 'bg-[#1c519c] text-white'
                                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                    >
                                        {freq}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white border-b border-gray-200 overflow-hidden"
                    >
                        <div className="px-4 sm:px-6 lg:px-8 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select
                                        value={filters.department}
                                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1c519c]"
                                    >
                                        <option value="">All Departments</option>
                                        {filterOptions.departments.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                                    <select
                                        value={filters.frequency}
                                        onChange={(e) => setFilters({ ...filters, frequency: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1c519c]"
                                    >
                                        <option value="">All Frequencies</option>
                                        {filterOptions.frequencies.map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                                    <select
                                        value={filters.format}
                                        onChange={(e) => setFilters({ ...filters, format: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1c519c]"
                                    >
                                        <option value="">All Formats</option>
                                        {filterOptions.formats.map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                                    <select
                                        value={filters.rating}
                                        onChange={(e) => setFilters({ ...filters, rating: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1c519c]"
                                    >
                                        <option value="0">All Ratings</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="4.5">4.5+ Stars</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => {
                                        setFilters({ department: '', frequency: '', format: '', rating: 0 });
                                        setSearchQuery('');
                                    }}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recently Viewed */}
            {recentReports.length > 0 && (
                <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        Recently Viewed
                    </h3>
                    <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                        {recentReports.slice(0, 8).map((report) => (
                            <button
                                key={report.externalId}
                                onClick={() => router.push(`/report-hub/${report.externalId}`)}
                                className="flex-shrink-0 bg-white border border-gray-200 rounded-lg px-4 py-2.5 hover:border-[#1c519c] hover:shadow-sm transition-all flex items-center space-x-2 min-w-[200px] max-w-[260px]"
                            >
                                <div className="text-left min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">{report.name}</div>
                                    <div className="text-xs text-gray-500">{report.frequency} · {report.category}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {searchQuery ? `Search results for "${searchQuery}"` :
                            selectedCategory !== 'all' ? `${reportCategories.find(c => c.id === selectedCategory)?.name} Reports` :
                                'All Reports'}
                        <span className="text-gray-500 text-sm font-normal ml-2">({filteredReports.length} reports)</span>
                    </h2>

                    {/* Quick Stats */}
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-gray-500">
                            <TrendingUp className="w-4 h-4 text-yellow-500" />
                            <span>{filteredReports.filter(r => r.isTrending).length} trending</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="w-4 h-4 text-red-500" />
                            <span>{filteredReports.filter(r => r.isNew).length} new</span>
                        </div>
                    </div>
                </div>

                {/* Reports Grid/List */}
                {viewMode === 'grid' ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredReports.slice(0, displayCount).map((report) => (
                                <ReportCard key={report.id} report={report} />
                            ))}
                        </div>
                        {filteredReports.length > displayCount && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setDisplayCount(prev => prev + 24)}
                                    className="px-6 py-2.5 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:border-[#1c519c] hover:text-[#1c519c] transition-all"
                                >
                                    Load More ({filteredReports.length - displayCount} remaining)
                                </button>
                            </div>
                        )}
                    </>

                ) : (
                    // List View
                    <div className="space-y-3">
                        {filteredReports.slice(0, displayCount).map((report) => (
                            <motion.div
                                key={report.id}
                                whileHover={{ x: 4 }}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer"
                                onClick={() => setSelectedReport(report)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">{report.name}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${report.category === 'financial' ? 'bg-[#F0F0F0] text-[#1c519c]' :
                                                report.category === 'store-operations' ? 'bg-emerald-100 text-emerald-700' :
                                                    report.category === 'digital-loyalty' ? 'bg-[#F0F0F0] text-[#1c519c]' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {report.category}
                                            </span>
                                            {report.isNew && <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">NEW</span>}
                                            {report.isTrending && <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Trending</span>}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                                        <div className="flex items-center space-x-6 text-xs text-gray-500">
                                            <span className="flex items-center"><Eye className="w-3 h-3 mr-1" />{report.views}</span>
                                            <span className="flex items-center"><Star className="w-3 h-3 mr-1 text-yellow-400" />{report.rating}</span>
                                            <span>{report.frequency}</span>
                                            <span>{report.format}</span>
                                            <span>by {report.owner}</span>
                                            <span>Updated {report.lastUpdated}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredReports.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">No reports found matching your criteria</p>
                        <button
                            onClick={() => {
                                setFilters({ department: '', frequency: '', format: '', rating: 0 });
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                            className="px-4 py-2 bg-[#1c519c] text-white rounded-lg hover:bg-[#1c519c] transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Report Detail Modal */}
            <AnimatePresence>
                {selectedReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedReport(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="relative bg-gradient-to-r from-[#1c519c] to-[#1c519c] p-6">
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>

                                <h2 className="text-2xl font-bold text-white mb-2">{selectedReport.name}</h2>
                                <div className="flex items-center space-x-4 text-sm text-emerald-100">
                                    <span className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                        {selectedReport.rating}
                                    </span>
                                    <span>{selectedReport.frequency}</span>
                                    <span>{selectedReport.format}</span>
                                    <span>{selectedReport.views} views</span>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                        <p className="text-gray-600 mb-6">{selectedReport.description}</p>

                                        {selectedReport.aiInsight && (
                                            <div className="bg-[#F0F0F0] rounded-lg p-4 mb-6">
                                                <h3 className="font-semibold text-[#1c519c] mb-2 flex items-center">
                                                    <Info className="w-4 h-4 mr-2" />
                                                    AI Insight
                                                </h3>
                                                <p className="text-[#1c519c] text-sm">{selectedReport.aiInsight}</p>
                                            </div>
                                        )}

                                        {selectedReport.tags?.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedReport.tags.map((tag: string) => (
                                                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => {
                                                    addRecentlyViewed(selectedReport.externalId);
                                                    setRecentIds(getRecentlyViewed());
                                                    router.push(`/report-hub/${selectedReport.externalId}`);
                                                }}
                                                className="flex-1 px-6 py-3 bg-[#1c519c] text-white rounded-lg font-medium hover:bg-[#1c519c] transition-colors flex items-center justify-center"
                                            >
                                                <ExternalLink className="w-5 h-5 mr-2" />
                                                Open Report
                                            </button>
                                            <button
                                                onClick={() => toggleFavorite(selectedReport.id)}
                                                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                                            >
                                                <Heart className={`w-5 h-5 mr-2 ${favorites.has(selectedReport.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                                                {favorites.has(selectedReport.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-4">Report Details</h3>
                                        <dl className="space-y-3">
                                            <div>
                                                <dt className="text-sm text-gray-500">Owner</dt>
                                                <dd className="text-sm font-medium text-gray-900">{selectedReport.owner}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm text-gray-500">Department</dt>
                                                <dd className="text-sm font-medium text-gray-900">{selectedReport.department}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm text-gray-500">Last Updated</dt>
                                                <dd className="text-sm font-medium text-gray-900">{selectedReport.lastUpdated}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm text-gray-500">Next Update</dt>
                                                <dd className="text-sm font-medium text-gray-900">{selectedReport.nextUpdate}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm text-gray-500">Access Level</dt>
                                                <dd className="text-sm font-medium text-gray-900">{selectedReport.accessLevel}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm text-gray-500">Data Source</dt>
                                                <dd className="text-sm font-medium text-gray-900">{selectedReport.dataSource}</dd>
                                            </div>
                                        </dl>

                                        <div className="mt-6 pt-6 border-t">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
                                            <div className="space-y-2">
                                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                                                    <Share2 className="w-4 h-4 mr-2" />
                                                    Share Report
                                                </button>
                                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </button>
                                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    Schedule
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="mt-8 pt-8 border-t">
                                    <h3 className="font-semibold text-gray-900 mb-4">Similar Reports You Might Like</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {getRecommendations(selectedReport, allReports).map((report) => (
                                            <div
                                                key={report.id}
                                                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => setSelectedReport(report)}
                                            >
                                                <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{report.name}</h4>
                                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                                    <span>{report.rating}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{report.frequency}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}