import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, BarChart3, FileText, Plus } from "lucide-react";
import KpiCard from "./KpiCard";
import RecentActivityFeed from "./RecentActivityFeed";
import apiClient from "../../api/axiosClient";
import { isToday, isThisMonth } from "date-fns";

export default function EmployeeDashboardView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetch up to 100 recent logs to calculate local KPIs
        const res = await apiClient.get('/logs?limit=100');
        setLogs(res.data.logs || []);
      } catch (error) {
        console.error("Error fetching employee logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Calculate KPIs
  const todayCount = logs.filter(log => isToday(new Date(log.date || log.createdAt))).length;
  const monthCount = logs.filter(log => isThisMonth(new Date(log.date || log.createdAt))).length;
  const totalCo2 = logs.reduce((acc, log) => acc + (Number(log.carbonEquivalent) || 0), 0);
  
  // Format last submission
  const lastLog = logs.length > 0 ? logs[0] : null;
  const lastSubmissionDisplay = lastLog 
    ? new Date(lastLog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    : "No submissions yet";

  return (
    <div className="grid grid-cols-12 gap-5 mt-4">
      {/* 4 KPI Cards */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 animate-fade-in-up">
        <KpiCard 
          title="TODAY'S ENTRIES" 
          value={loading ? "-" : todayCount.toString()} 
          subtitle="logged today"
          loading={loading}
        />
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 animate-fade-in-up delay-100">
        <KpiCard 
          title="THIS MONTH" 
          value={loading ? "-" : `${monthCount} Logs`} 
          subtitle="total submissions"
          loading={loading}
        />
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 animate-fade-in-up delay-200">
        <KpiCard 
          title="TOTAL CO₂ LOGGED" 
          value={loading ? "-" : `${totalCo2.toFixed(1)} tCO₂e`} 
          subtitle="overall contribution"
          loading={loading}
        />
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 animate-fade-in-up delay-300">
        <KpiCard 
          title="LAST SUBMISSION" 
          value={loading ? "-" : lastSubmissionDisplay.split(',')[0]} 
          subtitle={loading || !lastLog ? "" : lastSubmissionDisplay.split(',')[1]?.trim()}
          loading={loading}
        />
      </div>

      {/* Main Content Area */}
      <div className="col-span-12 lg:col-span-7 animate-fade-in-up delay-400">
        <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-8 lg:p-10 flex flex-col justify-center h-full shadow-sm hover:shadow-md transition-shadow">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light dark:text-zinc-100 text-gray-900 tracking-tight mb-3">Quick Actions</h2>
            <p className="dark:text-zinc-400 text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
              Quickly record new emissions or review your submitted entries.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/dashboard/logs/add" 
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide text-sm transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 active:scale-[0.98] sm:flex-1 max-w-[240px]"
            >
              <Plus className="w-4 h-4" /> Add New Log
            </Link>
            <Link 
              to="/dashboard/logs" 
              className="flex items-center justify-center gap-2 dark:bg-zinc-800 bg-gray-100 hover:bg-gray-200 dark:hover:bg-zinc-700 dark:text-zinc-100 text-gray-900 px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] sm:flex-1 max-w-[240px]"
            >
              <FileText className="w-4 h-4" /> View My Logs
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="col-span-12 lg:col-span-5 animate-fade-in-up delay-500">
        <RecentActivityFeed />
      </div>
    </div>
  );
}
