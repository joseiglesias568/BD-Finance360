'use client';

type Status = 'good' | 'warning' | 'critical' | 'on-track' | 'at-risk' | 'behind' | 'completed' | 'neutral' | 'info' | 'positive';

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  good:     { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'on-track': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  positive: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  warning:  { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'at-risk': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  critical: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  behind:   { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  neutral:  { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
  info:     { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

const statusLabels: Record<string, string> = {
  good: 'On Track',
  'on-track': 'On Track',
  positive: 'Positive',
  warning: 'At Risk',
  'at-risk': 'At Risk',
  critical: 'Behind',
  behind: 'Behind',
  completed: 'Completed',
  neutral: 'Neutral',
  info: 'Info',
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
  size?: 'sm' | 'md';
  dotOnly?: boolean;
  className?: string;
}

export default function StatusBadge({ status, label, size = 'sm', dotOnly = false, className = '' }: StatusBadgeProps) {
  const styles = statusStyles[status] || statusStyles.neutral;
  const displayLabel = label || statusLabels[status] || status;

  if (dotOnly) {
    return <span className={`inline-block w-2 h-2 rounded-full ${styles.dot} ${className}`} />;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${styles.bg} ${styles.text} ${
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
    } ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {displayLabel}
    </span>
  );
}
