import React, { useEffect, useState } from "react";
import FilterBar from "../../components/dashboard/FilterBar";
import KpiCard from "../../components/dashboard/KpiCard";
import EmissionTrendChart from "../../components/dashboard/EmissionTrendChart";
import EmissionSourcePieChart from "../../components/dashboard/EmissionSourcePieChart";
import { useFilters } from "../../context/FilterContext";
import apiClient from "../../api/axiosClient";

export default function AnalyticsPage() {
  const { filters } = useFilters();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [filters]);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-light dark:text-zinc-100 text-gray-900 mb-2">Analytics</h1>
        <p className="dark:text-zinc-500 text-gray-500 text-sm">
          Deep dive into corporate carbon emissions data and trends.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 flex justify-end mb-2">
          <FilterBar />
        </div>

        <div className="col-span-12 md:col-span-4">
          <KpiCard 
            title="TOTAL EMISSIONS" 
            value={summary ? `${summary.totalEmissions.toLocaleString()}` : "0"} 
            subtitle="tCO2e"
            loading={loading}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <KpiCard 
            title="HIGHEST EMITTING DEPT" 
            value={summary?.highestEmittingDept ? summary.highestEmittingDept.name : "N/A"} 
            subtitle={summary?.highestEmittingDept ? `${summary.highestEmittingDept.percentage}% of total` : ""}
            loading={loading}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <KpiCard 
            title="MoM CHANGE" 
            value={`${Math.abs(summary?.momChange || 0).toFixed(1)}%`} 
            subtitle="vs previous period"
            trend={summary?.momChange}
            loading={loading}
          />
        </div>

        <div className="col-span-12 lg:col-span-8">
          <EmissionTrendChart />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <EmissionSourcePieChart />
        </div>
      </div>
    </div>
  );
}
