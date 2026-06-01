/**
 * Base skeleton block. Accepts a variant for common preset shapes, plus
 * a className for overriding dimensions, margin, and other one-offs.
 *
 * Variants:
 *   text   — inline block, rounded, h-4 default (override h via className)
 *   card   — rounded-2xl, fills its container (supply h via className)
 *   avatar — circle (supply w/h via className)
 *   chart  — fixed h-[300px] tall block matching Recharts chart area height
 */
export function Skeleton({ variant = 'text', className = '' }) {
  const shape = {
    text:   'rounded',
    card:   'rounded-2xl',
    avatar: 'rounded-full',
    chart:  'h-[300px] rounded-xl',
  }[variant] ?? 'rounded';

  return <div className={`animate-pulse bg-gray-200 ${shape} ${className}`} />;
}

// ---------------------------------------------------------------------------
// Composite skeletons — pixel-matched to their real counterparts
// ---------------------------------------------------------------------------

/**
 * Matches the charity card in /pages/charities/index.js.
 * Layout: logo 80×80 | status badge | title×2 | category | desc×3 |
 *         3-col metrics | border-t CTA
 */
export function CharityCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Logo + badge */}
      <div className="mb-4 flex items-start justify-between">
        <Skeleton className="w-20 h-20 rounded-xl" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      {/* Title */}
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2 mb-3" />
      {/* Category pill */}
      <Skeleton className="h-5 w-24 rounded-full mb-3" />
      {/* Description */}
      <Skeleton className="h-3 w-full mb-1.5" />
      <Skeleton className="h-3 w-full mb-1.5" />
      <Skeleton className="h-3 w-2/3 mb-4" />
      {/* 3-col metrics */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl mb-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="text-center space-y-1.5">
            <Skeleton className="h-5 w-8 mx-auto" />
            <Skeleton className="h-3 w-14 mx-auto" />
          </div>
        ))}
      </div>
      {/* CTA row */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  );
}

/**
 * Matches the event card in /pages/events/index.js.
 * Layout: h-48 image | title×2 | location+date | avatar+name
 */
export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Image */}
      <Skeleton className="h-48 w-full rounded-none" />
      {/* Content */}
      <div className="p-5">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-3/4 mb-4" />
        {/* Location + date row */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* Owner row */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Skeleton variant="avatar" className="w-10 h-10 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Matches the notification row in /pages/notifications.js.
 * Layout: 56×56 icon | title + NEW badge | message×2 | date + action buttons
 */
export function NotificationRowSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex gap-4">
        {/* Icon */}
        <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-1.5" />
          <Skeleton className="h-4 w-4/5 mb-4" />
          {/* Footer */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-28" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-7 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Matches the blog post card in /pages/blog/index.js.
 * Layout: h-48 cover | title×2 | excerpt×2 | date + author meta
 */
export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Cover */}
      <Skeleton className="h-48 w-full rounded-none" />
      {/* Content */}
      <div className="p-5">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-3/4 mb-4" />
        <Skeleton className="h-3 w-full mb-1.5" />
        <Skeleton className="h-3 w-4/5 mb-4" />
        {/* Meta row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Matches a single dashboard stat card (Total Donated, Total Donations, etc).
 * Layout: label | big number | sub-label | emoji icon (right)
 */
export function DashboardStatSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-36" />
        </div>
        <Skeleton variant="avatar" className="w-12 h-12 opacity-50" />
      </div>
    </div>
  );
}

/**
 * Matches the DashboardCharts card wrapper + 300 px chart area.
 * Used inline in dashboard when analytics data hasn't loaded yet.
 */
export function ChartSkeleton({ className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <Skeleton className="h-6 w-56 mb-4" />
      <Skeleton variant="chart" className="w-full" />
    </div>
  );
}
