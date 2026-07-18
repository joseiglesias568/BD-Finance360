'use client';

import { branding } from '@/config';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const c = branding.colors;

export default function LoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                sessionStorage.setItem('justLoggedIn', 'true');
                router.push('/');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid password');
                setIsLoading(false);
            }
        } catch {
            setError('Unable to connect. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${c.primaryDark} 0%, #001A3A 40%, #00102A 60%, ${c.primaryDark} 100%)` }}>
            {/* Subtle background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-[60%] h-[60%] rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${c.primaryLight} 0%, transparent 70%)` }} />
                <div className="absolute -bottom-1/4 -left-1/4 w-[50%] h-[50%] rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${c.primaryLight} 0%, transparent 70%)` }} />
            </div>

            {/* Login container */}
            <div className="w-full max-w-md space-y-6 relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <div className="relative w-40 h-28">
                        <Image
                            src="/logo-white.svg"
                            alt={branding.logoAlt}
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                            unoptimized
                        />
                    </div>
                </div>

                {/* Header Text */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-white mb-1">Finance360</h1>
                    <p className="text-base font-medium" style={{ color: c.primaryLight }}>{branding.tagline}</p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl p-6 shadow-2xl backdrop-blur-sm" style={{ backgroundColor: `${c.navBgLight}cc`, borderColor: `${c.primaryLight}18`, borderWidth: '1px' }}>
                    <h2 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Password field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4" style={{ color: c.primary }} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                                style={{
                                    backgroundColor: c.primaryDark,
                                    borderColor: `${c.primary}66`,
                                    borderWidth: '1px',
                                    // focus styles handled by className for ring
                                }}
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
                                )}
                            </button>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-2.5">
                                <p className="text-red-400 text-xs">{error}</p>
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 text-white text-sm font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: c.primary }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.primaryAlt)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.primary)}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <p className="text-gray-400 text-xs">
                            {branding.subtitle}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center">
                        <Image
                            src="/images/acn-logo.png"
                            alt="Accenture"
                            width={24}
                            height={24}
                            style={{ height: 'auto' }}
                            className="object-contain brightness-0 invert opacity-60"
                            unoptimized
                        />
                    </div>
                    <p className="text-gray-400 text-xs">
                        Designed &amp; Built by {branding.designedBy} for {branding.companyName}
                    </p>
                    <p className="text-gray-500 text-xs">
                        &copy; {new Date().getFullYear()} {branding.copyrightHolder}. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
