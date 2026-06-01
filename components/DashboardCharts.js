import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ChartSkeleton } from '@/components/Skeleton';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Trophy, Target } from 'lucide-react';

// Unified 5-color palette used across every chart
export const CHART_PALETTE = ['#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

const AXIS_STYLE = { fill: '#9ca3af', fontSize: 11 };
const GRID_COLOR = '#f3f4f6';

// ─── Shared wrappers ─────────────────────────────────────────────────────────

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 overflow-hidden min-w-0">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-5">{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart({ message = 'No data to display yet' }) {
  return (
    <div className="flex flex-col items-center justify-center h-[260px] select-none">
      <svg className="w-24 h-24 mb-4" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="58" width="14" height="26" rx="3" fill="#fed7aa" />
        <rect x="31" y="44" width="14" height="40" rx="3" fill="#fdba74" />
        <rect x="52" y="30" width="14" height="54" rx="3" fill="#fb923c" />
        <rect x="73" y="18" width="14" height="66" rx="3" fill="#f97316" />
        <path d="M6 86h84" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
        <circle cx="72" cy="24" r="14" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
        <path d="M68 24h8M72 20v8" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="text-sm font-semibold text-gray-500">{message}</p>
      <p className="text-xs text-gray-300 mt-1">Data will appear once available</p>
    </div>
  );
}

// ─── Custom tooltips ─────────────────────────────────────────────────────────

function MoneyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 min-w-[150px]">
      {label && (
        <p className="text-xs font-semibold text-gray-500 mb-2 pb-1 border-b border-gray-100">{label}</p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-xs text-gray-500">{p.name}:</span>
          <span className="text-xs font-bold text-gray-900 ml-auto">
            {p.dataKey === 'count'
              ? Number(p.value).toLocaleString()
              : `$${Number(p.value).toLocaleString()}`}
          </span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.payload.fill }} />
        <span className="text-sm font-semibold text-gray-900">{p.name}</span>
      </div>
      <p className="text-sm font-bold text-gray-700 mt-1">
        {Number(p.value).toLocaleString()} donations
      </p>
    </div>
  );
}

// ─── Charts ──────────────────────────────────────────────────────────────────

export function DonationTrendsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={<><TrendingUp className="w-5 h-5 inline-block mr-2 align-middle" /> Donation Trends</>}>
        <EmptyChart message="No trend data for this period" />
      </ChartCard>
    );
  }

  const formatted = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: parseFloat(item.total) || 0,
    count: item.count || 0,
  }));

  return (
    <ChartCard title={<><TrendingUp className="w-5 h-5 inline-block mr-2 align-middle" /> Donation Trends</>}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={formatted} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
          <XAxis dataKey="date" tick={AXIS_STYLE} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS_STYLE} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toLocaleString()}`} />
          <Tooltip content={<MoneyTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="amount" stroke={CHART_PALETTE[0]} strokeWidth={2.5} dot={false} name="Amount ($)" animationDuration={800} animationEasing="ease-out" />
          <Line type="monotone" dataKey="count" stroke={CHART_PALETTE[3]} strokeWidth={2} dot={false} name="count" strokeDasharray="4 2" animationDuration={800} animationEasing="ease-out" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DonationsByMonthChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={<><BarChart3 className="w-5 h-5 inline-block mr-2 align-middle" /> Monthly Donations</>}>
        <EmptyChart message="No monthly data yet" />
      </ChartCard>
    );
  }

  const formatted = data.map(item => ({
    month: item.month,
    total: parseFloat(item.total) || 0,
    count: item.count || 0,
  }));

  return (
    <ChartCard title={<><BarChart3 className="w-5 h-5 inline-block mr-2 align-middle" /> Monthly Donations</>}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
          <XAxis dataKey="month" tick={AXIS_STYLE} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS_STYLE} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toLocaleString()}`} />
          <Tooltip content={<MoneyTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="total" fill={CHART_PALETTE[0]} name="Amount ($)" radius={[4, 4, 0, 0]} animationDuration={800} animationEasing="ease-out" />
          <Bar dataKey="count" fill={CHART_PALETTE[3]} name="count" radius={[4, 4, 0, 0]} animationDuration={800} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DonationsByStatusChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={<><PieChartIcon className="w-5 h-5 inline-block mr-2 align-middle" /> Donations by Status</>}>
        <EmptyChart message="No status data yet" />
      </ChartCard>
    );
  }

  const formatted = data.map(item => ({
    name: item.status,
    value: item.count || 0,
  }));

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RAD = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartCard title={<><PieChartIcon className="w-5 h-5 inline-block mr-2 align-middle" /> Donations by Status</>}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={formatted}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={90}
            dataKey="value"
            animationDuration={800}
            animationEasing="ease-out"
          >
            {formatted.map((_, i) => (
              <Cell key={`cell-${i}`} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TopEventsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={<><Trophy className="w-5 h-5 inline-block mr-2 align-middle" /> Top Donated Campaigns</>}>
        <EmptyChart message="No campaign data yet" />
      </ChartCard>
    );
  }

  const formatted = data.map(item => ({
    name: item.eventName?.length > 24 ? item.eventName.substring(0, 24) + '…' : (item.eventName || 'Untitled'),
    total: parseFloat(item.total) || 0,
  }));

  const dynamicHeight = Math.max(280, formatted.length * 54);

  return (
    <ChartCard title={<><Trophy className="w-5 h-5 inline-block mr-2 align-middle" /> Top Donated Campaigns</>}>
      <ResponsiveContainer width="100%" height={dynamicHeight}>
        <BarChart data={formatted} layout="vertical" margin={{ top: 4, right: 32, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
          <XAxis type="number" tick={AXIS_STYLE} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toLocaleString()}`} />
          <YAxis dataKey="name" type="category" width={120} tick={AXIS_STYLE} tickLine={false} axisLine={false} />
          <Tooltip content={<MoneyTooltip />} />
          <Bar dataKey="total" fill={CHART_PALETTE[2]} name="Amount ($)" radius={[0, 4, 4, 0]} animationDuration={800} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function EventsPerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={<><Target className="w-5 h-5 inline-block mr-2 align-middle" /> Campaign Performance</>}>
        <EmptyChart message="No campaign performance data yet" />
      </ChartCard>
    );
  }

  const formatted = data.map(item => ({
    name: item.eventName?.length > 16 ? item.eventName.substring(0, 16) + '…' : (item.eventName || 'Untitled'),
    goal: parseFloat(item.goalAmount) || 0,
    raised: parseFloat(item.raised) || 0,
  }));

  return (
    <ChartCard title={<><Target className="w-5 h-5 inline-block mr-2 align-middle" /> Campaign Performance</>}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
          <XAxis dataKey="name" tick={AXIS_STYLE} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS_STYLE} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toLocaleString()}`} />
          <Tooltip content={<MoneyTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="goal" fill={CHART_PALETTE[4]} name="Goal ($)" radius={[4, 4, 0, 0]} animationDuration={800} animationEasing="ease-out" />
          <Bar dataKey="raised" fill={CHART_PALETTE[2]} name="Raised ($)" radius={[4, 4, 0, 0]} animationDuration={800} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
