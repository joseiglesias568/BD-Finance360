// =============================================================================
// Shared Chart Theme
// Single source of truth for Recharts styling across the platform
// =============================================================================

export const CHART_COLORS = {
  green: '#1c519c',
  greenLight: '#1c519c',
  greenSoft: '#F0F0F0',
  greenDark: '#1c519c',
  emerald: '#10B981',
  blue: '#3B82F6',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  gray: '#9CA3AF',
  grayLight: '#E5E7EB',
  grayDark: '#374151',
  teal: '#14B8A6',
  indigo: '#6366F1',
};

export const CHART_AXIS_STYLE = { fontSize: 10, fill: '#6B7280' };

export const CHART_TOOLTIP_DARK = {
  contentStyle: {
    background: '#1c519c',
    border: 'none',
    borderRadius: 8,
    fontSize: 11,
    color: '#fff',
    padding: '6px 10px',
  },
  itemStyle: { color: '#fff', fontSize: 11 },
  labelStyle: { color: '#fff', fontSize: 11, fontWeight: 600 },
};

export const CHART_GRID_STYLE = {
  vertical: false,
  stroke: '#F3F4F6',
};

/** Segment colors: North America, International, Project Management */
export const SEGMENT_COLORS = [CHART_COLORS.green, CHART_COLORS.blue, CHART_COLORS.amber];
