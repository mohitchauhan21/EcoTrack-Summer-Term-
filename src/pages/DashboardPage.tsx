import React, { useEffect, useState } from "react";
import FilterBar from "../components/dashboard/FilterBar";
import KpiCard from "../components/dashboard/KpiCard";
import EmissionTrendChart from "../components/dashboard/EmissionTrendChart";
import EmissionSourcePieChart from "../components/dashboard/EmissionSourcePieChart";
import DepartmentBarChart from "../components/dashboard/DepartmentBarChart";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import EmployeeDashboardView from "../components/dashboard/EmployeeDashboardView";
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

  const canViewAnalytics = role === "admin" || role === "executive";

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
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          {/* Left — Title */}
          <div>
            <h1 className="text-3xl font-light dark:text-zinc-50 text-gray-950 tracking-tight">
              Welcome, {userName || "User"}
            </h1>
            <p className="dark:text-zinc-500 text-gray-500 text-sm mt-1.5">
              {canViewAnalytics 
                ? "Here is your EcoTrack summary." 
                : "Manage your department's carbon entries and track your recent activity."}
            </p>
          </div>

          {/* Right — Filters */}
          <FilterBar />
        </div>
      </header>

      {!canViewAnalytics ? (
        <EmployeeDashboardView />
      ) : (
        <div className="grid grid-cols-12 gap-6">
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
