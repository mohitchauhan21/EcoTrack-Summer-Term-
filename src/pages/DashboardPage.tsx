import React, { useEffect, useState } from "react";
import FilterBar from "../components/dashboard/FilterBar";
import KpiCard from "../components/dashboard/KpiCard";
import EmissionTrendChart from "../components/dashboard/EmissionTrendChart";
import EmissionSourcePieChart from "../components/dashboard/EmissionSourcePieChart";
import DepartmentBarChart from "../components/dashboard/DepartmentBarChart";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import { useFilters } from "../context/FilterContext";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/axiosClient";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { filters } = useFilters();
  const { role, userName } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const canViewAnalytics = role === "admin" || role === "superadmin" || role === "executive";

  useEffect(() => {
    if (!canViewAnalytics) {
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.departmentId && filters.departmentId !== "all") params.append("departmentId", filters.departmentId);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const res = await apiClient.get(`/analytics/summary?${params.toString()}`);
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching summary data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [filters, canViewAnalytics]);

  return (
    <div className="flex-1 pb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-zinc-100 tracking-tight">Welcome, {userName || "User"}</h1>
        <p className="text-zinc-500 text-sm mt-1">Here is your EcoTrack summary.</p>
      </header>

      {!canViewAnalytics ? (
        <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-8 text-center max-w-2xl mx-auto mt-12">
          <h2 className="text-xl text-zinc-100 font-light mb-4">Your Carbon Data</h2>
          <p className="text-zinc-400 mb-6 text-sm">You are logged in as a data entry employee. You can add new carbon logs or view your existing entries.</p>
          <div className="flex justify-center gap-4">
            <Link to="/dashboard/logs/add" className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-lg font-bold text-sm transition-colors">
              Add Log
            </Link>
            <Link to="/dashboard/logs" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-6 py-2 rounded-lg font-bold text-sm transition-colors">
              View My Logs
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 flex flex-col md:flex-row justify-between md:items-end mb-2 gap-4">
            <h2 className="text-lg text-zinc-200">Company Overview</h2>
            <FilterBar />
          </div>

          {/* 4 KPI Cards */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KpiCard 
              title="TOTAL EMISSIONS" 
              value={summary ? `${summary.totalEmissions.toLocaleString()}` : "0"} 
              subtitle="tCO2e"
              loading={loading}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KpiCard 
              title="HIGHEST EMITTING DEPT" 
              value={summary?.highestEmittingDept ? summary.highestEmittingDept.name : "N/A"} 
              subtitle={summary?.highestEmittingDept ? `${summary.highestEmittingDept.percentage}% of total` : ""}
              loading={loading}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KpiCard 
              title="MoM CHANGE" 
              value={`${Math.abs(summary?.momChange || 0).toFixed(1)}%`} 
              subtitle="vs previous period"
              trend={summary?.momChange}
              loading={loading}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KpiCard 
              title="TOTAL LOGS" 
              value={summary ? `${summary.logCount.toLocaleString()}` : "0"} 
              subtitle="tracked entries"
              loading={loading}
            />
          </div>

          {/* Charts Row 1 */}
          <div className="col-span-12 lg:col-span-8">
            <EmissionTrendChart />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <EmissionSourcePieChart />
          </div>

          {/* Charts Row 2 */}
          <div className="col-span-12 lg:col-span-7">
            <DepartmentBarChart />
          </div>
          <div className="col-span-12 lg:col-span-5">
            <RecentActivityFeed />
          </div>
        </div>
      )}
    </div>
  );
}
