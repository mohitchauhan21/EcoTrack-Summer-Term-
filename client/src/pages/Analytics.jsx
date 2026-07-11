import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import api from '../services/api';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1'];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Analytics page — Recharts visualizations for emissions data.
 */
const Analytics = () => {
  const [data, setData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch departments
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const { data: res } = await api.get('/company/departments');
        setDepartments(res.data.departments);
      } catch {
        // silent
      }
    };
    fetchDepts();
  }, []);

  // Fetch analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterDept) params.append('departmentId', filterDept);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const { data: res } = await api.get(`/dashboard/analytics?${params}`);
        setData(res.data);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [filterDept, startDate, endDate]);

  // Transform data for charts
  const activityData = data?.byActivity?.map((item) => ({
    name: item._id?.charAt(0).toUpperCase() + item._id?.slice(1),
    value: Math.round(item.total),
    count: item.count,
  })) || [];

  const departmentData = data?.byDepartment?.map((item) => ({
    name: item.name,
    value: Math.round(item.total),
    count: item.count,
  })) || [];

  const monthlyData = data?.byMonth?.map((item) => ({
    name: `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`,
    emissions: Math.round(item.total),
    logs: item.count,
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const noData = !activityData.length && !departmentData.length && !monthlyData.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary-600" />
          Analytics
        </h1>
        <p className="text-secondary-500 mt-1">Visualize and analyze your emissions data</p>
      </div>

      {/* Filters */}
      <Card noPadding>
        <div className="flex flex-col sm:flex-row gap-3 p-4">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-lg border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-lg border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            placeholder="Start date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-lg border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            placeholder="End date"
          />
        </div>
      </Card>

      {noData ? (
        <Card>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">No data to visualize yet.</p>
            <p className="text-secondary-400 text-sm mt-1">Add carbon logs to see analytics.</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Row 1: Bar + Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart — Emissions by Activity */}
            <Card title="Emissions by Activity Type">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                      formatter={(value) => [`${value.toLocaleString()} kg CO₂e`, 'Emissions']}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Pie Chart — Emissions by Department */}
            <Card title="Emissions by Department">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                    >
                      {departmentData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                      formatter={(value) => [`${value.toLocaleString()} kg CO₂e`, 'Emissions']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Row 2: Line Chart — Monthly Trend */}
          <Card title="Monthly Emissions Trend">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                    formatter={(value, name) => [
                      name === 'emissions' ? `${value.toLocaleString()} kg CO₂e` : value,
                      name === 'emissions' ? 'Emissions' : 'Logs',
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6, fill: '#059669' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="logs"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </motion.div>
  );
};

export default Analytics;
