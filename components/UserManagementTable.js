import React from 'react';
import { Shield, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDate, timeAgo } from '@/lib/utils';

export default function UserManagementTable({
  users,
  searchTerm,
  filterStatus,
  setFilterStatus,
  setSearchTerm,
  handleUserAction
}) {
  const filteredUsers = users.filter(u => {
    const matchesSearch = !searchTerm || 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && u.isActive && !u.isBlocked) ||
      (filterStatus === 'inactive' && !u.isActive) ||
      (filterStatus === 'blocked' && u.isBlocked);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="blocked">Blocked Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Activity</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-orange-600">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {user.role || 'USER'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.isBlocked 
                      ? 'bg-red-100 text-red-700'
                      : user.isActive 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.isBlocked ? 'Blocked' : user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      user.isActive && !user.isBlocked ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm text-gray-600">
                      {user.lastLoginAt ? `Last: ${timeAgo(user.lastLoginAt)}` : 'Never'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => handleUserAction(user.id, user.isBlocked ? 'unblock' : (user.isActive ? 'deactivate' : 'activate'))}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isBlocked
                          ? 'text-blue-600 hover:bg-blue-50'
                          : user.isActive
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={user.isBlocked ? 'Unblock' : user.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {user.isBlocked ? (
                        <Shield className="w-4 h-4" />
                      ) : user.isActive ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleUserAction(user.id, user.isBlocked ? 'unblock' : 'block')}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isBlocked
                          ? 'text-gray-600 hover:bg-gray-100'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title={user.isBlocked ? 'Unblock' : 'Block'}
                    >
                      {user.isBlocked ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
