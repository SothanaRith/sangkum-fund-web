import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

export function DonationTrendsChart({ data }) {
  const formattedData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: item.total,
    count: item.count
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Donation Trends (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} name="Amount ($)" />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Count" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonationsByMonthChart({ data }) {
  const formattedData = data.map(item => ({
    month: item.month,
    total: item.total,
    count: item.count
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Monthly Donations</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8b5cf6" name="Total Amount ($)" />
          <Bar dataKey="count" fill="#3b82f6" name="Donation Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonationsByStatusChart({ data }) {
  const formattedData = data.map(item => ({
    name: item.status,
    value: item.count
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Donations by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopEventsChart({ data }) {
  const formattedData = data.map(item => ({
    name: item.eventName.length > 20 ? item.eventName.substring(0, 20) + '...' : item.eventName,
    total: item.total,
    count: item.count
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Top Donated Events</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#10b981" name="Total Amount ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EventsPerformanceChart({ data }) {
  const formattedData = data.map(item => ({
    name: item.eventName.length > 15 ? item.eventName.substring(0, 15) + '...' : item.eventName,
    goal: item.goalAmount,
    raised: item.raised,
    progress: item.progress
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 My Events Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="goal" fill="#94a3b8" name="Goal ($)" />
          <Bar dataKey="raised" fill="#10b981" name="Raised ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
