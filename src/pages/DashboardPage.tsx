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

/** Safely format a number — returns fallback on NaN / undefined / null */
function safeNum(val: any, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

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

  // ── Derived KPI values with NaN protection ──────────────────────
  const totalEmissions = summary ? safeNum(summary.totalEmissions).toLocaleString() : "0";

  const highestDeptName = summary?.highestEmittingDept?.name || "No Data";
  const highestDeptPct = safeNum(summary?.highestEmittingDept?.percentage);
  const highestDeptSubtitle =
    summary?.highestEmittingDept && !isNaN(highestDeptPct)
      ? `${highestDeptPct.toFixed(1)}% of total`
      : "";

  const momChangeRaw = safeNum(summary?.momChange);
  const momChangeDisplay = `${Math.abs(momChangeRaw).toFixed(1)}%`;

  const totalLogs = summary ? safeNum(summary.logCount).toLocaleString() : "0";

  return (
    <div className="flex-1 pb-12">
      {/* ── Dashboard Header ─────────────────────────────────── */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          {/* Left — Title */}
          <div>
            <h1 className="text-3xl font-light dark:text-zinc-50 text-gray-950 tracking-tight">
              Welcome, {userName || "User"}
            </h1>
            <p className="dark:text-zinc-500 text-gray-500 text-sm mt-1.5">
              Here is your EcoTrack summary.
            </p>
          </div>

          {/* Right — Filters */}
          <FilterBar />
        </div>
      </header>

      {!canViewAnalytics ? (
        <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-10 text-center max-w-2xl mx-auto mt-12">
          <h2 className="text-xl dark:text-zinc-100 text-gray-900 font-light mb-4">Your Carbon Data</h2>
          <p className="dark:text-zinc-400 text-gray-600 mb-8 text-sm leading-relaxed">
            You are logged in as a data entry employee. You can add new carbon logs or view your existing entries.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/dashboard/logs/add" className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              Add Log
            </Link>
            <Link to="/dashboard/logs" className="dark:bg-zinc-800 bg-gray-200 hover:bg-zinc-700 dark:text-zinc-100 text-gray-900 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
              View My Logs
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-5">
          {/* Section label */}
          <div className="col-span-12 mb-1">
            <h2 className="text-xs dark:text-zinc-500 text-gray-500 uppercase tracking-[0.15em] font-semibold">Company Overview</h2>
          </div>

          {/* 4 KPI Cards */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KpiCard 
              title="TOTAL EMISSIONS" 
              value={totalEmissions} 
              subtitle="tCO2e"
              loading={loading}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KpiCard 
              title="HIGHEST EMITTING DEPT" 
              value={highestDeptName} 
              subtitle={highestDeptSubtitle}
              loading={loading}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KpiCard 
              title="MoM CHANGE" 
              value={momChangeDisplay} 
              subtitle="vs previous period"
              trend={momChangeRaw}
              loading={loading}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KpiCard 
              title="TOTAL LOGS" 
              value={totalLogs} 
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
