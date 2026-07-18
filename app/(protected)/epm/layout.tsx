'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, GitBranch, Calendar, SlidersHorizontal, Rocket, AlertTriangle, Info, ExternalLink } from 'lucide-react';

const epmNav = [
  { label: '18-Month Forecast', href: '/epm/ml-forecasting', icon: TrendingUp },
  { label: 'Quarterly Bridge Walk', href: '/epm/bridge-walks', icon: GitBranch },
  { label: 'Fiscal Year Plan', href: '/epm/fiscal-year-plan', icon: Calendar },
  { label: 'Short-Term Planning', href: '/epm/short-term-planning', icon: SlidersHorizontal },
  { label: 'Long-Term Planning', href: '/epm/long-term-planning', icon: Rocket },
  { label: 'Risks & Opportunities', href: '/epm/risks-opportunities', icon: AlertTriangle },
];

export default function EPMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-6 px-4 sm:px-6 lg:px-8 pb-4">
      {/* Sidebar */}
      <aside className="hidden lg:block w-56 shrink-0 pt-4">
        <div className="sticky top-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-3">
            Planning & Forecasting Modules
          </h3>
          <nav className="space-y-1">
            {epmNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#003B2C]/10 text-[#003B2C]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* EPM Platform Connectivity Note */}
          <div className="mt-6 px-3">
            <div className="rounded-lg bg-[#F0F0F0] p-3">
              <div className="flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-[#003B2C] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-[#003B2C] leading-tight">
                    Connected to EPM Platform
                  </p>
                  <p className="text-[9px] text-[#003B2C]/70 mt-1 leading-relaxed">
                    This hub surfaces analytics from your EPM tool. Forecast adjustments, R&O submissions, and plan inputs are managed in the EPM input application.
                  </p>
                  <button className="mt-2 flex items-center gap-1 text-[9px] font-semibold text-[#003B2C] hover:underline">
                    <ExternalLink className="h-2.5 w-2.5" />
                    Open EPM Input Tool
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 pt-4">{children}</div>
    </div>
  );
}
