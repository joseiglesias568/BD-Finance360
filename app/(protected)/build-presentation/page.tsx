'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Calculator,
  Calendar,
  Mic,
  PiggyBank,
  Plus,
  Presentation,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { meetings, MeetingConfig } from '@/lib/meetings-config';

const iconMap: Record<string, React.ElementType> = {
  BarChart3,
  Mic,
  Users,
  PiggyBank,
  Calculator,
  TrendingUp,
};

const cadenceColors: Record<string, { bg: string; text: string }> = {
  Monthly: { bg: 'bg-[#1c519c]/10', text: 'text-[#1c519c]' },
  Quarterly: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Annual: { bg: 'bg-amber-50', text: 'text-amber-700' },
};

const statusStyles: Record<string, { dot: string; text: string }> = {
  Ready: { dot: 'bg-emerald-500', text: 'text-emerald-700' },
  'In Prep': { dot: 'bg-amber-500', text: 'text-amber-700' },
  Upcoming: { dot: 'bg-gray-400', text: 'text-gray-500' },
};

function MeetingCard({ meeting, index }: { meeting: MeetingConfig; index: number }) {
  const Icon = iconMap[meeting.icon] || Presentation;
  const cadence = cadenceColors[meeting.cadence];
  const status = statusStyles[meeting.status];
  const isReady = meeting.status === 'Ready';

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.07 }}
      className={`bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col transition-all duration-200 ${
        isReady
          ? 'group hover:shadow-lg hover:border-[#1c519c]/30 cursor-pointer'
          : 'opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Top row: icon + cadence badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${isReady ? 'bg-[#1c519c]/8 group-hover:bg-[#1c519c]/12' : 'bg-gray-100'} transition-colors`}>
          <Icon className={`w-5 h-5 ${isReady ? 'text-[#1c519c]' : 'text-gray-400'}`} />
        </div>
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${cadence.bg} ${cadence.text}`}>
          {meeting.cadence}
        </span>
      </div>

      {/* Meeting name */}
      <h3 className={`text-[15px] font-semibold mb-1.5 transition-colors ${isReady ? 'text-gray-900 group-hover:text-[#1c519c]' : 'text-gray-600'}`}>
        {meeting.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">
        {meeting.description}
      </p>

      {/* Footer: date + status */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{meeting.nextDate}</span>
        </div>
        {isReady ? (
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            <span className={`text-[10px] font-medium ${status.text}`}>{meeting.status}</span>
          </div>
        ) : (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            Coming Soon
          </span>
        )}
      </div>

      {/* Slide count */}
      <div className="mt-2 text-[10px] text-gray-400">
        {meeting.slides.length} slides prepared
      </div>
    </motion.div>
  );

  if (isReady) {
    return <Link href={`/build-presentation/${meeting.slug}`}>{cardContent}</Link>;
  }
  return <div>{cardContent}</div>;
}

export default function BuildPresentationPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <div className="px-8 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#1c519c]/10 rounded-xl">
                <Presentation className="w-6 h-6 text-[#1c519c]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meeting Hub</h1>
                <p className="text-sm text-gray-500">
                  Select a meeting to prepare and present, or create a custom presentation
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Meeting Grid */}
      <div className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Section: Standard Meetings */}
          <div className="mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Standard Meetings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {meetings.map((meeting, idx) => (
              <MeetingCard key={meeting.slug} meeting={meeting} index={idx} />
            ))}

            {/* Create Custom Presentation card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 + meetings.length * 0.07 }}
              className="group bg-white rounded-xl border-2 border-dashed border-gray-200 p-6 hover:border-[#1c519c]/40 hover:bg-[#1c519c]/[0.02] transition-all duration-200 cursor-pointer h-full flex flex-col items-center justify-center text-center min-h-[220px]"
            >
              <div className="p-3 rounded-full bg-gray-50 group-hover:bg-[#1c519c]/10 transition-colors mb-3">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#1c519c] transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 group-hover:text-[#1c519c] transition-colors mb-1">
                Create Custom Presentation
              </h3>
              <p className="text-xs text-gray-400 max-w-[200px]">
                Build a presentation from scratch with any data and slides you choose
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
