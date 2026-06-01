import React from 'react';

export default function StatCard({ 
  icon: Icon, 
  iconColorClass = 'text-primary-500', 
  iconBgClass = 'bg-primary-50', 
  title, 
  value, 
  trend,
  trendLabel = 'from last month'
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBgClass}`}>
        {Icon && <Icon className={`w-7 h-7 ${iconColorClass}`} />}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <p className="text-sm mt-1">
            <span className={trend > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-gray-500 ml-1">{trendLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
}
