'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronDown,
    ChevronRight,
    Info,
    LogOut,
    Menu,
    Search,
    Sparkles,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { branding } from '@/config';
import { mainNavigation, NavItem } from '@/lib/navigation-config';

function initialsFromExecutiveName(name: string): string {
    const parts = name.trim().split(/\s+/).filter((p) => !p.endsWith('.'));
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Helper: does this nav item have a dropdown (either regular or mega-menu)?
const hasDropdown = (item: NavItem) => !!item.items || !!item.megaMenuColumns;

export default function ManagementReportingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const personaName = branding.cfo;
    const personaTitle = branding.cfoTitle;
    const personaInitials = initialsFromExecutiveName(personaName);

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const isHomePage = pathname === '/';

    // Close mobile menu and user menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
        setShowUserMenu(false);
    }, [pathname]);

    // Close user menu on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
        };
        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showUserMenu]);

    // Check if a nav item or its children are active
    const isNavItemActive = useCallback((item: NavItem): boolean => {
        if (item.href && pathname === item.href) return true;
        if (item.items) {
            return item.items.some(sub => pathname === sub.href || pathname.startsWith(sub.href + '/'));
        }
        if (item.megaMenuColumns) {
            return item.megaMenuColumns.some(col =>
                col.some(cat =>
                    cat.items.some(sub => pathname === sub.href || pathname.startsWith(sub.href + '/'))
                )
            );
        }
        return false;
    }, [pathname]);

    const isDropdownItemActive = useCallback((href: string): boolean => {
        return pathname === href || pathname.startsWith(href + '/');
    }, [pathname]);

    // Dropdown hover handlers with delay
    const handleMouseEnter = (label: string) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
            dropdownTimeoutRef.current = null;
        }
        setActiveDropdown(label);
    };

    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
            // Clear cookie client-side as fallback
        }
        localStorage.removeItem('disclaimerAcknowledged');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 relative z-50">
                <div className="flex items-center justify-between h-14 px-4">
                    {/* Left: Logo + Platform Title */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image
                                src="/logo-icon.svg"
                                alt="BD Finance360"
                                width={42}
                                height={32}
                                className="h-8 w-auto max-h-8 object-contain flex-shrink-0"
                                priority
                                unoptimized
                            />
                            <div className="flex flex-col">
                                <h1 className="text-sm font-semibold text-[#00A651] tracking-wide leading-tight">
                                    BD Finance360
                                </h1>
                                <p className="text-[10px] text-gray-400 font-medium leading-tight tracking-wider uppercase hidden sm:block">
                                    AI-Powered Financial Intelligence
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Horizontal Nav (desktop only) */}
                    <nav className="hidden lg:flex items-center space-x-1 ml-8">
                        {mainNavigation.map((item) => (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => hasDropdown(item) ? handleMouseEnter(item.label) : undefined}
                                onMouseLeave={() => hasDropdown(item) ? handleMouseLeave() : undefined}
                            >
                                {/* Nav item button/link */}
                                {hasDropdown(item) ? (
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                                        className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isNavItemActive(item)
                                                ? 'text-[#1B3A6B] bg-[#1B3A6B]/5'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href || '#'}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isNavItemActive(item)
                                                ? 'text-[#1B3A6B] bg-[#1B3A6B]/5'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                    </Link>
                                )}

                                {/* Active indicator bar */}
                                {isNavItemActive(item) && (
                                    <motion.div
                                        layoutId="navActiveIndicator"
                                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1B3A6B]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Regular dropdown panel */}
                                <AnimatePresence>
                                    {item.items && activeDropdown === item.label && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                                            onMouseEnter={() => handleMouseEnter(item.label)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div className="py-1">
                                                {item.items.map((subItem) => (
                                                    <Link
                                                        key={subItem.href}
                                                        href={subItem.href}
                                                        onClick={() => setActiveDropdown(null)}
                                                        className={`block px-4 py-3 transition-colors ${
                                                            isDropdownItemActive(subItem.href)
                                                                ? 'bg-[#1B3A6B]/5 border-l-2 border-[#1B3A6B]'
                                                                : 'hover:bg-gray-50 border-l-2 border-transparent'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className={`text-sm font-medium ${
                                                                isDropdownItemActive(subItem.href) ? 'text-[#1B3A6B]' : 'text-gray-900'
                                                            }`}>
                                                                {subItem.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-0.5">{subItem.description}</p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Mega-menu dropdown panel */}
                                <AnimatePresence>
                                    {item.megaMenuColumns && activeDropdown === item.label && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                                            style={{ width: '580px', left: '50%', transform: 'translateX(-50%)' }}
                                            onMouseEnter={() => handleMouseEnter(item.label)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div className="grid grid-cols-3 p-4 gap-4">
                                                {item.megaMenuColumns.map((column, colIdx) => (
                                                    <div key={colIdx} className={colIdx < item.megaMenuColumns!.length - 1 ? 'border-r border-gray-100 pr-4' : ''}>
                                                        {column.map((category) => (
                                                            <div key={category.name} className="mb-4 last:mb-0">
                                                                <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-2">
                                                                    {category.name}
                                                                </h4>
                                                                {category.items.map((subItem) => (
                                                                    <Link
                                                                        key={subItem.href}
                                                                        href={subItem.comingSoon ? '#' : subItem.href}
                                                                        onClick={(e) => {
                                                                            if (subItem.comingSoon) {
                                                                                e.preventDefault();
                                                                                return;
                                                                            }
                                                                            setActiveDropdown(null);
                                                                        }}
                                                                        className={`block px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                                                                            isDropdownItemActive(subItem.href)
                                                                                ? 'bg-[#1B3A6B]/5 text-[#1B3A6B] font-medium'
                                                                                : subItem.comingSoon
                                                                                    ? 'text-gray-400 cursor-default'
                                                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <span className="leading-tight">{subItem.label}</span>
                                                                            {subItem.comingSoon && (
                                                                                <span className="text-[9px] text-gray-400 whitespace-nowrap flex-shrink-0">Coming Soon</span>
                                                                            )}
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* Right: Search + User + Mobile toggle */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        {/* Search icon (non-home pages) */}
                        {!isHomePage && (
                            <button
                                onClick={() => setShowSearchModal(!showSearchModal)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Search"
                            >
                                <Search className="w-4.5 h-4.5 text-gray-500" />
                            </button>
                        )}

                        {/* User menu (desktop) */}
                        <div className="hidden md:block relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900 leading-tight">{personaName}</p>
                                    <p className="text-[11px] text-gray-400 leading-tight">{personaTitle}</p>
                                </div>
                                <div className="w-9 h-9 rounded-full border-2 border-[#1B3A6B]/30 bg-[#1B3A6B] flex items-center justify-center">
                                    <span className="text-white font-semibold text-xs">{personaInitials}</span>
                                </div>
                            </button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{personaName}</p>
                                            <p className="text-xs text-gray-500">{personaTitle}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href="/ai-agents"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Info className="w-4 h-4 text-gray-400" />
                                                <span>How it Works</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4 text-gray-400" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-gray-700" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Search modal (non-home pages) */}
                <AnimatePresence>
                    {showSearchModal && !isHomePage && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 bg-gradient-to-b from-white to-gray-50/80 border-b border-gray-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm z-30"
                        >
                            <div className="max-w-2xl mx-auto px-4 py-5">
                                <div className="group relative rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,51,102,0.08)] border border-gray-200/80 hover:shadow-[0_4px_20px_rgba(0,51,102,0.12)] hover:border-[#1B3A6B]/20 transition-all duration-300 focus-within:shadow-[0_4px_20px_rgba(0,51,102,0.15)] focus-within:border-[#1B3A6B]/30">
                                    <div className="flex items-center">
                                        <div className="relative flex-1">
                                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] text-gray-400 group-focus-within:text-[#1B3A6B] transition-colors duration-200" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Ask me anything about your business..."
                                                className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-l-2xl text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') setShowSearchModal(false);
                                                    if (e.key === 'Enter' && searchQuery.trim()) {
                                                        router.push(`/ai-search?q=${encodeURIComponent(searchQuery)}`);
                                                        setShowSearchModal(false);
                                                        setSearchQuery('');
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="pr-2">
                                            <button
                                                onClick={() => {
                                                    if (searchQuery.trim()) {
                                                        router.push(`/ai-search?q=${encodeURIComponent(searchQuery)}`);
                                                        setShowSearchModal(false);
                                                        setSearchQuery('');
                                                    }
                                                }}
                                                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#1B3A6B] to-[#1B3A6B] hover:from-[#24508A] hover:to-[#1B3A6B] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                <span>AI Search</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3 px-1">
                                    <p className="text-[11px] text-gray-400 tracking-wide">Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-500 border border-gray-200">Enter</kbd> to search &middot; <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-500 border border-gray-200">Esc</kbd> to close</p>
                                    <p className="text-[11px] text-gray-400 tracking-wide">Powered by AI</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Mobile slide-out menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                            className="fixed left-0 top-0 bottom-0 w-80 bg-navy-gradient shadow-2xl z-50 flex flex-col border-r border-gray-700 lg:hidden"
                        >
                            {/* Mobile menu header */}
                            <div className="p-5 border-b border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Image
                                            src="/logo-white.svg"
                                            alt="BD Finance360"
                                            width={207}
                                            height={32}
                                            className="h-8 w-auto max-h-8 max-w-[min(100%,12rem)] object-contain object-left flex-shrink-0"
                                            unoptimized
                                        />
                                        <h2 className="text-lg font-bold text-white">BD Finance360</h2>
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile nav */}
                            <nav className="flex-1 overflow-y-auto p-4">
                                {/* Home link */}
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-lg mb-1 transition-colors ${
                                        pathname === '/'
                                            ? 'bg-[#1B3A6B]/20 text-[#F0F0F0]'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <span className="font-medium">Home</span>
                                </Link>

                                {mainNavigation.map((item) => (
                                    <div key={item.label} className="mb-1">
                                        {/* Regular dropdown items */}
                                        {item.items ? (
                                            <>
                                                <button
                                                    onClick={() => setExpandedMobileSection(
                                                        expandedMobileSection === item.label ? null : item.label
                                                    )}
                                                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                                                        isNavItemActive(item)
                                                            ? 'bg-[#1B3A6B]/20 text-[#F0F0F0]'
                                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                >
                                                    <span className="font-medium">{item.label}</span>
                                                    <ChevronRight className={`w-4 h-4 transition-transform ${
                                                        expandedMobileSection === item.label ? 'rotate-90' : ''
                                                    }`} />
                                                </button>
                                                <AnimatePresence>
                                                    {expandedMobileSection === item.label && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pl-4 py-1">
                                                                {item.items.map((subItem) => (
                                                                    <Link
                                                                        key={subItem.href}
                                                                        href={subItem.href}
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${
                                                                            isDropdownItemActive(subItem.href)
                                                                                ? 'text-[#F0F0F0] bg-[#1B3A6B]/10'
                                                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                                        }`}
                                                                    >
                                                                        <span>{subItem.label}</span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : item.megaMenuColumns ? (
                                            /* Mega-menu items in mobile: show categories with items */
                                            <>
                                                <button
                                                    onClick={() => setExpandedMobileSection(
                                                        expandedMobileSection === item.label ? null : item.label
                                                    )}
                                                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                                                        isNavItemActive(item)
                                                            ? 'bg-[#1B3A6B]/20 text-[#F0F0F0]'
                                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                >
                                                    <span className="font-medium">{item.label}</span>
                                                    <ChevronRight className={`w-4 h-4 transition-transform ${
                                                        expandedMobileSection === item.label ? 'rotate-90' : ''
                                                    }`} />
                                                </button>
                                                <AnimatePresence>
                                                    {expandedMobileSection === item.label && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pl-4 py-1">
                                                                {item.megaMenuColumns.flat().map((category) => (
                                                                    <div key={category.name} className="mb-2">
                                                                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 pt-2 pb-1">
                                                                            {category.name}
                                                                        </p>
                                                                        {category.items.map((subItem) => (
                                                                            <Link
                                                                                key={subItem.href}
                                                                                href={subItem.comingSoon ? '#' : subItem.href}
                                                                                onClick={(e) => {
                                                                                    if (subItem.comingSoon) {
                                                                                        e.preventDefault();
                                                                                        return;
                                                                                    }
                                                                                    setIsMobileMenuOpen(false);
                                                                                }}
                                                                                className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors ${
                                                                                    isDropdownItemActive(subItem.href)
                                                                                        ? 'text-[#F0F0F0] bg-[#1B3A6B]/10'
                                                                                        : subItem.comingSoon
                                                                                            ? 'text-gray-500 cursor-default'
                                                                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                                                }`}
                                                                            >
                                                                                <span>{subItem.label}</span>
                                                                                {subItem.comingSoon && (
                                                                                    <span className="text-[9px] text-gray-500">Coming Soon</span>
                                                                                )}
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.href || '#'}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                                    isNavItemActive(item)
                                                        ? 'bg-[#1B3A6B]/20 text-[#F0F0F0]'
                                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            {/* Mobile user section */}
                            <div className="p-4 border-t border-gray-700">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-[#1B3A6B]/50 bg-[#1B3A6B] flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">{personaInitials}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{personaName}</p>
                                        <p className="text-xs text-gray-400">{personaTitle}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left flex items-center space-x-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-gray-50">
                {children}
            </div>

            {/* Site-wide Footer */}
            <footer className="bg-white border-t border-gray-200 py-3 px-4">
                <div className="flex items-center justify-center space-x-2">
                    <span className="text-xs text-gray-400">Designed &amp; Built by</span>
                    <Image
                        src="/images/acn-logo.png"
                        alt="Accenture"
                        width={20}
                        height={20}
                        style={{ height: 'auto' }}
                        className="object-contain opacity-60"
                        unoptimized
                    />
                    <span className="text-xs text-gray-400">for Becton, Dickinson and Company</span>
                </div>
            </footer>

        </div>
    );
}
