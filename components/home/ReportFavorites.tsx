'use client';

import type { ReportsConfig } from '@/config/types';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Star } from 'lucide-react';
import Link from 'next/link';

// Map category name to brand-appropriate badge colors
const categoryColorMap: Record<string, string> = {
    'Financial Performance': 'bg-blue-50 text-blue-600',
    'Property & Operations': 'bg-emerald-50 text-emerald-600',
    'Digital & Customer': 'bg-purple-50 text-purple-600',
    'Risk & Sustainability': 'bg-red-50 text-red-600',
    'Revenue & Market': 'bg-teal-50 text-teal-600',
    'People & Culture': 'bg-orange-50 text-orange-600',
};

function getCategoryColors(category: string): string {
    return categoryColorMap[category] ?? 'bg-gray-50 text-gray-600';
}

// Pick first report from each unique category as "favorites"
function pickFavorites(reportsConfig: ReportsConfig) {
    const seen = new Set<string>();
    const favorites = [];
    for (const report of reportsConfig.reports) {
        if (!seen.has(report.category) && favorites.length < 4) {
            seen.add(report.category);
            favorites.push(report);
        }
    }
    return favorites;
}

interface ReportFavoritesProps {
    reportsConfig: ReportsConfig;
}

export default function ReportFavorites({ reportsConfig }: ReportFavoritesProps) {
    const favoriteReports = pickFavorites(reportsConfig);

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-900 tracking-tight">Report Hub Favorites</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Quick access to your most-used reports</p>
                </div>
                <Link
                    href="/report-hub"
                    className="flex items-center text-sm font-medium text-[#1c519c] hover:text-[#1c519c] transition-colors"
                >
                    See All
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {favoriteReports.map((report) => (
                    <motion.div
                        key={report.id}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="bg-white rounded-xl border border-gray-200/80 hover:border-[#1c519c]/20 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="p-4">
                            {/* Category + Favorite */}
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${getCategoryColors(report.category)}`}>
                                    {report.category}
                                </span>
                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            </div>

                            {/* Report name */}
                            <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{report.name}</h4>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{report.description}</p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className="flex items-center space-x-1.5">
                                    <FileText className="w-3 h-3 text-gray-400" />
                                    <span className="text-[10px] text-gray-400 font-medium">{report.frequency}</span>
                                </div>
                                <div className="flex items-center text-xs font-medium text-[#1c519c] group-hover:text-[#1c519c] transition-colors">
                                    <span>View Details</span>
                                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
