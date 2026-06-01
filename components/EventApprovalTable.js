import React from 'react';
import { Calendar, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function EventApprovalTable({ 
  events, 
  searchTerm, 
  filterStatus, 
  handleEventAction 
}) {
  const filteredEvents = events.filter(e => {
    const matchesSearch = !searchTerm || 
      e.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      e.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Event List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Event</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Organizer</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Funding Progress</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEvents.map((event) => {
              const fundedPercentage = event.goalAmount ? 
                Math.round((event.currentAmount / event.goalAmount) * 100) : 0;
              
              return (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{event.title}</div>
                        <div className="text-sm text-gray-500 truncate">{event.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{event.ownerName}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">
                          {formatCurrency(event.currentAmount)} / {formatCurrency(event.goalAmount)}
                        </span>
                        <span className="text-xs font-bold text-orange-600">{fundedPercentage}%</span>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(fundedPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      event.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      event.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      event.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                      event.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          alert(`Event: ${event.title}\n\nFunding: ${formatCurrency(event.currentAmount)} / ${formatCurrency(event.goalAmount)}\n\nStatus: ${event.status}`);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {event.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleEventAction(event.id, 'approve')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve Event"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const reason = window.prompt('Enter rejection reason:', 'Event does not meet guidelines');
                              if (reason !== null) {
                                handleEventAction(event.id, 'reject', reason);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject Event"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete event "${event.title}"?`)) {
                            handleEventAction(event.id, 'delete');
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* No events message */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No events found</p>
        </div>
      )}
    </div>
  );
}
