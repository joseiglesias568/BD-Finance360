import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    BarChart3,
    Copy,
    Edit2,
    Grid,
    LineChart,
    List,
    Lock,
    Move,
    PieChart,
    Plus,
    Settings, Share2,
    Trash2,
    Unlock,
    X
} from 'lucide-react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart as RechartsBarChart,
    Cell,
    Line as RechartsLine,
    LineChart as RechartsLineChart,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { CHART_COLORS, SEGMENT_COLORS } from '@/lib/chart-theme';

// Mini chart data keyed by widget id
const widgetChartData: Record<string, { type: 'area' | 'bar' | 'pie' | 'line'; data: any[] }> = {
    'fee-revenue-trend':   { type: 'area',  data: [{ q: 'Q1', v: 4.0 }, { q: 'Q2', v: 5.2 }, { q: 'Q3', v: 6.1 }, { q: 'Q4', v: 6.8 }] },
    'service-line-mix':    { type: 'bar',   data: [{ q: 'Missouri', v: 49 }, { q: 'Illinois', v: 24 }, { q: 'ATXI', v: 9 }, { q: 'Corporate', v: 18 }] },
    'deal-cycle-speed':    { type: 'line',  data: [{ q: 'Jan', v: 4.2 }, { q: 'Feb', v: 4.0 }, { q: 'Mar', v: 3.8 }, { q: 'Apr', v: 3.5 }] },
    'office-profitability':{ type: 'pie',   data: [{ name: 'Consumer', v: 58 }, { name: 'Business', v: 30 }, { name: 'Corporate', v: 12 }] },
    'aum-growth':          { type: 'area',  data: [{ q: 'Q1', v: 116.2 }, { q: 'Q2', v: 116.5 }, { q: 'Q3', v: 116.8 }, { q: 'Q4', v: 117.1 }] },
    'client-engagement':   { type: 'bar',   data: [{ q: 'Weekly', v: 22 }, { q: 'Bi-weekly', v: 35 }, { q: 'Monthly', v: 28 }, { q: 'Quarterly', v: 15 }] },
    'revenue-per-producer':{ type: 'line',  data: [{ q: 'Q1', v: 44.2 }, { q: 'Q2', v: 44.6 }, { q: 'Q3', v: 45.1 }, { q: 'Q4', v: 45.8 }] },
    'client-retention':    { type: 'bar',   data: [{ q: 'Mo 3', v: 98 }, { q: 'Mo 6', v: 95 }, { q: 'Mo 12', v: 91 }, { q: 'Mo 24', v: 86 }] },
    'advisory-vs-ops':     { type: 'pie',   data: [{ name: 'Consumer', v: 55 }, { name: 'Business', v: 45 }] },
    'cross-sell-rate':     { type: 'bar',   data: [{ q: 'ESA+Missouri', v: 38 }, { q: 'Illinois+Missouri', v: 32 }, { q: 'ATXI+Illinois', v: 22 }, { q: 'Bundle', v: 18 }] },
    'platform-adoption':   { type: 'area',  data: [{ q: 'Q1', v: 62 }, { q: 'Q2', v: 65 }, { q: 'Q3', v: 68 }, { q: 'Q4', v: 71 }] },
    'new-service-impact':  { type: 'line',  data: [{ q: 'Wk1', v: 8 }, { q: 'Wk2', v: 12 }, { q: 'Wk3', v: 10 }, { q: 'Wk4', v: 9 }] },
    'peer-revenue-comparison': { type: 'bar',   data: [{ q: 'AEE', v: 2.18 }, { q: 'WEC', v: 2.41 }, { q: 'EVA', v: 0.68 }] },
    'competitor-fees':         { type: 'bar',   data: [{ q: 'AEE', v: 3.5 }, { q: 'WEC', v: 3.8 }, { q: 'LNT', v: 1.9 }, { q: 'ETR', v: 4.1 }] },
    'market-share-map':        { type: 'pie',   data: [{ name: 'BD', v: 38 }, { name: 'WEC Energy', v: 22 }, { name: 'Evergy', v: 14 }, { name: 'Xcel Energy', v: 15 }, { name: 'Other', v: 11 }] },
    'regional-coverage-map':   { type: 'bar',   data: [{ q: 'Northeast', v: 85 }, { q: 'Southeast', v: 78 }, { q: 'West', v: 72 }, { q: 'Midwest', v: 65 }] },
    'regional-rev-growth':     { type: 'area',  data: [{ q: 'Q1', v: 2.0 }, { q: 'Q2', v: 3.5 }, { q: 'Q3', v: 4.2 }, { q: 'Q4', v: 4.8 }] },
    'capex-pipeline':      { type: 'line',  data: [{ q: 'Wk1', v: 12 }, { q: 'Wk2', v: 14 }, { q: 'Wk3', v: 16 }, { q: 'Wk4', v: 18 }] },
    'proptech-adoption':   { type: 'area',  data: [{ q: 'Jan', v: 42 }, { q: 'Feb', v: 48 }, { q: 'Mar', v: 55 }, { q: 'Apr', v: 62 }] },
};

const PIE_COLORS = [CHART_COLORS.green, CHART_COLORS.blue, CHART_COLORS.amber, CHART_COLORS.red];

function WidgetChart({ widgetId }: { widgetId: string }) {
    const config = widgetChartData[widgetId];
    if (!config) {
        return (
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400 text-sm">No data available</p>
            </div>
        );
    }

    const tooltipStyle = {
        contentStyle: { background: '#003B2C', border: 'none', borderRadius: 8, fontSize: 11, color: '#fff', padding: '6px 10px' },
        itemStyle: { color: '#fff', fontSize: 11 },
    };

    return (
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                {config.type === 'area' ? (
                    <AreaChart data={config.data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                        <defs>
                            <linearGradient id={`wg-${widgetId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="q" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <Tooltip {...tooltipStyle} />
                        <Area type="monotone" dataKey="v" stroke={CHART_COLORS.green} strokeWidth={2} fill={`url(#wg-${widgetId})`} />
                    </AreaChart>
                ) : config.type === 'bar' ? (
                    <RechartsBarChart data={config.data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                        <XAxis dataKey="q" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <Tooltip {...tooltipStyle} />
                        <Bar dataKey="v" fill={CHART_COLORS.green} radius={[3, 3, 0, 0]} />
                    </RechartsBarChart>
                ) : config.type === 'line' ? (
                    <RechartsLineChart data={config.data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                        <XAxis dataKey="q" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <Tooltip {...tooltipStyle} />
                        <RechartsLine type="monotone" dataKey="v" stroke={CHART_COLORS.green} strokeWidth={2} dot={{ r: 4, fill: CHART_COLORS.green }} />
                    </RechartsLineChart>
                ) : (
                    <RechartsPieChart>
                        <Pie data={config.data} dataKey="v" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={3}>
                            {config.data.map((_: any, i: number) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip {...tooltipStyle} />
                    </RechartsPieChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}

export default function Custom() {
    const [savedDashboards, setSavedDashboards] = useState([
        {
            id: 1,
            name: 'Regional Network Performance',
            description: 'Coverage footprint, regional revenue growth, and peer revenue benchmarking by geography',
            widgets: ['regional-rev-growth', 'peer-revenue-comparison', 'regional-coverage-map'],
            lastModified: '2 days ago',
            shared: true,
            owner: 'James Mitchell'
        },
        {
            id: 2,
            name: 'Member & Revenue Analytics',
            description: 'BD Aetna membership trends, specialty Rx attach rates, PCW Rx volume, and member cohort analysis',
            widgets: ['aum-growth', 'client-engagement', 'revenue-per-producer', 'client-retention'],
            lastModified: '1 week ago',
            shared: false,
            owner: 'Marcus Thompson'
        },
        {
            id: 3,
            name: 'Specialty & Digital Pipeline',
            description: 'Tracking Medicare Advantage pipeline and Health100 digital platform adoption',
            widgets: ['service-line-mix', 'capex-pipeline', 'proptech-adoption'],
            lastModified: '3 days ago',
            shared: true,
            owner: 'Rachel Kim'
        }
    ]);

    const [isCreating, setIsCreating] = useState(false);
    const [selectedDashboard, setSelectedDashboard] = useState<number | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Available widgets for custom dashboards
    const availableWidgets = [
        {
            category: 'Revenue & Financial Performance',
            widgets: [
                { id: 'fee-revenue-trend', name: 'Segment Revenue Growth Trend', icon: LineChart },
                { id: 'service-line-mix', name: 'Segment Revenue Mix', icon: BarChart3 },
                { id: 'deal-cycle-speed', name: 'Specialty Rx Fill Cycle Speed', icon: Activity },
                { id: 'office-profitability', name: 'Segment Profitability Analysis', icon: PieChart }
            ]
        },
        {
            category: 'Member & Patient',
            widgets: [
                { id: 'aum-growth', name: 'Medical Membership Growth', icon: LineChart },
                { id: 'client-engagement', name: 'Member Engagement Analysis', icon: BarChart3 },
                { id: 'revenue-per-producer', name: 'Revenue Per Member Trend', icon: Activity },
                { id: 'client-retention', name: 'Member Retention Cohorts', icon: PieChart }
            ]
        },
        {
            category: 'Product & Platform',
            widgets: [
                { id: 'advisory-vs-ops', name: 'Commercial vs. Medicare Mix', icon: PieChart },
                { id: 'cross-sell-rate', name: 'Integrated Care Attach Rate', icon: BarChart3 },
                { id: 'platform-adoption', name: 'Health100 Digital Platform Adoption', icon: LineChart },
                { id: 'new-service-impact', name: 'Specialty Rx Volume Impact', icon: Activity }
            ]
        },
        {
            category: 'Competitive Intelligence',
            widgets: [
                { id: 'peer-revenue-comparison', name: 'Peer Revenue Comparison', icon: BarChart3 },
                { id: 'competitor-fees', name: 'Managed Care MBR Benchmark', icon: List },
                { id: 'market-share-map', name: 'Medicare Advantage MBR Comparison', icon: Grid },
                { id: 'regional-coverage-map', name: 'CVS Clinical Network Footprint', icon: Grid }
            ]
        }
    ];

    const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
    const [dashboardName, setDashboardName] = useState('');
    const [dashboardDescription, setDashboardDescription] = useState('');

    const handleCreateDashboard = () => {
        if (dashboardName && selectedWidgets.length > 0) {
            const newDashboard = {
                id: savedDashboards.length + 1,
                name: dashboardName,
                description: dashboardDescription,
                widgets: selectedWidgets,
                lastModified: 'Just now',
                shared: false,
                owner: 'Current User'
            };
            setSavedDashboards([...savedDashboards, newDashboard]);
            setIsCreating(false);
            setDashboardName('');
            setDashboardDescription('');
            setSelectedWidgets([]);
        }
    };

    const toggleWidget = (widgetId: string) => {
        setSelectedWidgets(prev =>
            prev.includes(widgetId)
                ? prev.filter(id => id !== widgetId)
                : [...prev, widgetId]
        );
    };

    const renderDashboardBuilder = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Create Custom Dashboard</h2>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Dashboard Details */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dashboard Name
                        </label>
                        <input
                            type="text"
                            value={dashboardName}
                            onChange={(e) => setDashboardName(e.target.value)}
                            placeholder="e.g., Capital Markets Pipeline Tracker"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003B2C]"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={dashboardDescription}
                            onChange={(e) => setDashboardDescription(e.target.value)}
                            placeholder="Brief description of this dashboard's purpose..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003B2C]"
                        />
                    </div>

                    {/* Widget Selection */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Widgets</h3>
                        <div className="space-y-6">
                            {availableWidgets.map((category) => (
                                <div key={category.category}>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">{category.category}</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {category.widgets.map((widget) => {
                                            const Icon = widget.icon;
                                            const isSelected = selectedWidgets.includes(widget.id);
                                            return (
                                                <button
                                                    key={widget.id}
                                                    onClick={() => toggleWidget(widget.id)}
                                                    className={`p-4 rounded-lg border-2 transition-all ${isSelected
                                                        ? 'border-[#003B2C] bg-[#F0F0F0]'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#003B2C]/10' : 'bg-gray-100'
                                                            }`}>
                                                            <Icon className={`w-5 h-5 ${isSelected ? 'text-[#003B2C]' : 'text-gray-600'
                                                                }`} />
                                                        </div>
                                                        <span className={`text-sm font-medium ${isSelected ? 'text-[#003B2C]' : 'text-gray-700'
                                                            }`}>
                                                            {widget.name}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Widgets Preview */}
                    {selectedWidgets.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Selected Widgets ({selectedWidgets.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {selectedWidgets.map((widgetId) => {
                                    const widget = availableWidgets
                                        .flatMap(c => c.widgets)
                                        .find(w => w.id === widgetId);
                                    return (
                                        <span
                                            key={widgetId}
                                            className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                                        >
                                            {widget?.name}
                                            <button
                                                onClick={() => toggleWidget(widgetId)}
                                                className="ml-2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                    <button
                        onClick={() => setIsCreating(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateDashboard}
                        disabled={!dashboardName || selectedWidgets.length === 0}
                        className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors ${dashboardName && selectedWidgets.length > 0
                            ? 'bg-[#003B2C] hover:bg-[#007A3D]'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        Create Dashboard
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const renderDashboardView = () => {
        const dashboard = savedDashboards.find(d => d.id === selectedDashboard);
        if (!dashboard) return null;

        return (
            <div className="space-y-6">
                {/* Dashboard Header */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{dashboard.name}</h2>
                            <p className="text-sm text-gray-600 mt-1">{dashboard.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>Created by {dashboard.owner}</span>
                                <span>&#8226;</span>
                                <span>Modified {dashboard.lastModified}</span>
                                <span>&#8226;</span>
                                <span className="flex items-center">
                                    {dashboard.shared ? (
                                        <>
                                            <Unlock className="w-3 h-3 mr-1" />
                                            Shared
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-3 h-3 mr-1" />
                                            Private
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className={`p-2 rounded-lg transition-colors ${editMode
                                    ? 'bg-emerald-100 text-[#003B2C]'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setSelectedDashboard(null)}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>

                    {editMode && (
                        <div className="mt-4 p-4 bg-[#F0F0F0] rounded-lg border border-[#003B2C]/20">
                            <p className="text-sm text-[#003B2C]">
                                Edit mode enabled. Drag widgets to rearrange, or click the settings icon to configure.
                            </p>
                        </div>
                    )}
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {dashboard.widgets.map((widgetId, index) => {
                        const widget = availableWidgets
                            .flatMap(c => c.widgets)
                            .find(w => w.id === widgetId);
                        const Icon = widget?.icon || Grid;

                        return (
                            <motion.div
                                key={widgetId}
                                layout
                                className={`bg-white rounded-xl shadow-sm p-6 ${editMode ? 'cursor-move hover:shadow-lg' : ''
                                    } ${index === 0 ? 'col-span-2' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-[#F0F0F0] rounded-lg">
                                            <Icon className="w-5 h-5 text-[#003B2C]" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">
                                            {widget?.name || 'Unknown Widget'}
                                        </h3>
                                    </div>
                                    {editMode && (
                                        <div className="flex items-center space-x-1">
                                            <button className="p-1 text-gray-400 hover:text-gray-600">
                                                <Move className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-gray-600">
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <WidgetChart widgetId={widgetId} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {!selectedDashboard ? (
                <>
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Custom Dashboards</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Create personalized views with your preferred metrics and visualizations
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-[#003B2C] text-white rounded-lg hover:bg-[#007A3D] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="text-sm font-medium">Create Dashboard</span>
                            </button>
                        </div>
                    </div>

                    {/* Saved Dashboards Grid */}
                    <div className="grid grid-cols-3 gap-6">
                        {savedDashboards.map((dashboard) => (
                            <motion.div
                                key={dashboard.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => setSelectedDashboard(dashboard.id)}
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                {dashboard.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {dashboard.description}
                                            </p>
                                        </div>
                                        {dashboard.shared ? (
                                            <Unlock className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <Lock className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {dashboard.widgets.slice(0, 3).map((widget) => (
                                            <span
                                                key={widget}
                                                className="inline-flex px-2 py-1 bg-[#F0F0F0] text-[#003B2C] text-xs rounded"
                                            >
                                                {widget.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                            </span>
                                        ))}
                                        {dashboard.widgets.length > 3 && (
                                            <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                                                +{dashboard.widgets.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{dashboard.owner}</span>
                                        <span>{dashboard.lastModified}</span>
                                    </div>
                                </div>

                                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle edit
                                        }}
                                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle delete
                                        }}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {/* Template Cards */}
                        <div className="bg-gradient-to-br from-[#F0F0F0] to-emerald-50 rounded-xl p-6 border border-[#003B2C]/20">
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-[#003B2C]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Grid className="w-6 h-6 text-[#003B2C]" />
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                                        Use a Template
                                    </h4>
                                    <p className="text-xs text-gray-600 mb-3">
                                        Start with pre-built BD dashboard templates
                                    </p>
                                    <button className="text-xs font-medium text-[#003B2C] hover:text-[#007A3D]">
                                        Browse Templates
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                renderDashboardView()
            )}

            {/* Dashboard Builder Modal */}
            <AnimatePresence>
                {isCreating && renderDashboardBuilder()}
            </AnimatePresence>
        </div>
    );
}