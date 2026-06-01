import React from 'react';
import { Activity, PieChart, AlertTriangle, TrendingUp, CheckCircle, Clock, Calendar, DollarSign, Users, Check, X } from 'lucide-react';
import { formatCurrency, timeAgo } from '@/lib/utils';

export default function SystemStatsPanel({ stats, health, events, donations, users }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-900">Pending Approvals</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">{stats.pendingEvents}</div>
          <p className="text-xs text-orange-700 mt-1">Events awaiting review</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Avg Donation</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {stats.totalDonations > 0 ? formatCurrency(stats.totalAmount / stats.totalDonations) : '$0'}
          </div>
          <p className="text-xs text-blue-700 mt-1">Average per donation</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Active Rate</span>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">
            {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
          </div>
          <p className="text-xs text-green-700 mt-1">Active users</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Charity Pending</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{stats.notifications || 0}</div>
          <p className="text-xs text-purple-700 mt-1">Awaiting verification</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Recent Activity Feed
            </h3>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {[
              ...(events || []).slice(0,5).map(e => ({
                icon: Calendar,
                title: 'New event submitted',
                detail: e.title,
                time: e.createdAt,
                color: 'orange',
              })),
              ...(donations || []).slice(0,5).map(d => ({
                icon: DollarSign,
                title: 'New donation received',
                detail: `${d.donorName || 'Anonymous'} → ${d.eventTitle}`,
                time: d.createdAt,
                color: 'green',
              })),
              ...(users || []).slice(0,5).map(u => ({
                icon: Users,
                title: 'New user registered',
                detail: u.username || u.email,
                time: u.createdAt,
                color: 'blue',
              })),
            ]
              .sort((a,b) => new Date(b.time) - new Date(a.time))
              .slice(0,8)
              .map((item, idx) => {
                const colorClasses = {
                  orange: 'bg-orange-100 text-orange-600',
                  green: 'bg-green-100 text-green-600',
                  blue: 'bg-blue-100 text-blue-600',
                };
                return (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                    <div className={`p-2 rounded-lg ${colorClasses[item.color]}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                      <div className="text-sm text-gray-600 truncate">{item.detail}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.time ? timeAgo(item.time) : 'Just now'}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-600" />
              System Health Metrics
            </h3>
          </div>
          <div className="p-4 space-y-5">
            {[
              { label: 'API Response Time', value: health?.apiResponseTime || 0, max: 100, color: 'from-green-500 to-emerald-500', unit: '%' },
              { label: 'Database Load', value: health?.dbLoad || 0, max: 100, color: 'from-blue-500 to-cyan-500', unit: '%' },
              { label: 'Storage Usage', value: health?.storageUsage || 0, max: 100, color: 'from-orange-500 to-amber-500', unit: '%' },
              { label: 'Active Sessions', value: Math.min(health?.activeSessions || 0, 100), max: 100, color: 'from-purple-500 to-pink-500', unit: '%' },
            ].map((metric) => {
              const percentage = (metric.value / metric.max) * 100;
              const statusColor = percentage < 50 ? 'text-green-600' : percentage < 80 ? 'text-yellow-600' : 'text-red-600';
              
              return (
                <div key={metric.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    <span className={`text-sm font-bold ${statusColor}`}>{Math.round(metric.value)}{metric.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 inline-flex items-center gap-1">
                    {percentage < 50 ? <><Check className="w-3 h-3 mr-1 inline" />Excellent</> : percentage < 80 ? <><AlertTriangle className="w-3 h-3 mr-1 inline" />Good</> : <><X className="w-3 h-3 mr-1 inline" />Warning</>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
