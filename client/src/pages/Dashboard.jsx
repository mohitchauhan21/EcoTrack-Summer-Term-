import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Zap, FileText, Building2,
  TrendingUp, Plus, Loader2, ArrowRight
} from 'lucide-react';
import api from '../services/api';
import KpiCard from '../components/common/KpiCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const ACTIVITY_COLORS = {
  electricity: 'bg-yellow-100 text-yellow-700',
  transport: 'bg-blue-100 text-blue-700',
  waste: 'bg-orange-100 text-orange-700',
  water: 'bg-cyan-100 text-cyan-700',
  fuel: 'bg-red-100 text-red-700',
  other: 'bg-gray-100 text-gray-700',
};

/**
 * Dashboard page — KPI cards, recent logs, and quick actions.
 */
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await api.get('/dashboard');
        setData(res.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl font-extrabold text-secondary-900 flex items-center gap-2 tracking-tight">
            <LayoutDashboard className="h-8 w-8 text-primary-600" />
            Dashboard
          </h1>
          <p className="text-secondary-500 mt-1">Overview of your carbon emissions</p>
        </motion.div>
        <Link to="/carbon-logs">
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
            Add Log
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
          <KpiCard
            icon={<Zap className="h-5 w-5" />}
            label="Total Emissions"
            value={`${(data?.totalEmissions || 0).toLocaleString()} kg`}
            trend={data?.trend}
            trendLabel="vs. last month"
            iconBg="bg-primary-100"
            iconColor="text-primary-600"
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
          <KpiCard
            icon={<FileText className="h-5 w-5" />}
            label="Total Logs"
            value={data?.logCount || 0}
            iconBg="bg-info-400/20"
            iconColor="text-info-600"
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
          <KpiCard
            icon={<Building2 className="h-5 w-5" />}
            label="Top Department"
            value={data?.topDepartment?.name || 'N/A'}
            iconBg="bg-warning-400/20"
            iconColor="text-warning-600"
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
          <KpiCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Monthly Trend"
            value={`${data?.trend > 0 ? '+' : ''}${data?.trend || 0}%`}
            trend={data?.trend}
            trendLabel="emission change"
            iconBg="bg-accent-400/20"
            iconColor="text-accent-600"
          />
        </motion.div>
      </motion.div>

      {/* Recent Logs */}
      <Card title="Recent Carbon Logs">
        {!data?.recentLogs?.length ? (
          <div className="text-center py-12">
            <div className="bg-secondary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-secondary-300" />
            </div>
            <p className="text-secondary-500 font-medium">No logs yet.</p>
            <p className="text-secondary-400 text-sm mt-1">Start tracking by adding carbon logs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead className="border-b border-secondary-100">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-500 text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-500 text-sm">Activity</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-500 text-sm">Department</th>
                  <th className="text-right py-3 px-4 font-semibold text-secondary-500 text-sm">CO₂e (kg)</th>
                </tr>
              </thead>
              <tbody>
                {data.recentLogs.map((log) => (
                  <tr key={log._id} className="border-b border-secondary-50 hover:bg-secondary-50/50 transition-colors group">
                    <td className="py-3.5 px-4 text-secondary-700">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ACTIVITY_COLORS[log.activityType] || ACTIVITY_COLORS.other}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5"></span>
                        {log.activityType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-secondary-700">{log.departmentId?.name || '—'}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-secondary-900">
                      {log.carbonEquivalent.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data?.recentLogs?.length > 0 && (
          <div className="mt-6 text-center">
            <Link to="/carbon-logs" className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-bold transition-colors hover:gap-2">
              View all logs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default Dashboard;
