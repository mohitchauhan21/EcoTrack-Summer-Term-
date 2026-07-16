import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFilters } from "../../context/FilterContext";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/axiosClient";
import { Plus, Download } from "lucide-react";

export default function FilterBar() {
  const { filters, updateFilter, setFilters } = useFilters();
  const { role, departmentId: clientDeptId } = useAuth();
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'employee' && clientDeptId) {
      updateFilter("departmentId", clientDeptId);
    }
  }, [role, clientDeptId]);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await apiClient.get("/departments");
        setDepartments(res.data);
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };
    if (role !== 'employee') {
      fetchDepts();
    }
  }, [role]);

  const handleDatePresetChange = (preset: string) => {
    const now = new Date();
    let startDate = null;
    let endDate = now.toISOString();

    if (preset === "This Month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    } else if (preset === "Last Quarter") {
      const currentQ = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), (currentQ - 1) * 3, 1).toISOString();
      endDate = new Date(now.getFullYear(), currentQ * 3, 0, 23, 59, 59).toISOString();
    } else if (preset === "Q1 2026") {
      startDate = new Date(2026, 0, 1).toISOString();
      endDate = new Date(2026, 2, 31, 23, 59, 59).toISOString();
    } else if (preset === "Year to Date") {
      startDate = new Date(now.getFullYear(), 0, 1).toISOString();
    } else if (preset === "All Time") {
      startDate = null;
      endDate = null;
    }

    setFilters({ ...filters, preset, startDate, endDate });
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (role === 'employee' && clientDeptId) {
        params.append("departmentId", clientDeptId);
      } else if (filters.departmentId && filters.departmentId !== "all") {
        params.append("departmentId", filters.departmentId);
      }
      
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await apiClient.get(`/analytics/export?${params.toString()}`, {
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ecotrack-export.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const logRoute = '/dashboard/logs/add';

  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
      <div className="bg-zinc-900 border border-white/10 rounded px-4 py-2 flex items-center gap-3">
        <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest hidden sm:inline">Period</span>
        <select
          value={filters.preset}
          onChange={(e) => handleDatePresetChange(e.target.value)}
          className="bg-transparent border-none outline-none text-sm font-medium text-zinc-100 cursor-pointer focus:ring-0"
        >
          <option value="All Time">All Time</option>
          <option value="This Month">This Month</option>
          <option value="Last Quarter">Last Quarter</option>
          <option value="Q1 2026">Q1 2026</option>
          <option value="Year to Date">Year to Date</option>
          <option value="Custom Range">Custom Range</option>
        </select>
      </div>

      {role !== 'employee' && (
        <div className="bg-zinc-900 border border-white/10 rounded px-4 py-2 flex items-center gap-3">
          <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest hidden sm:inline">Dept</span>
          <select
            value={filters.departmentId || "all"}
            onChange={(e) => updateFilter("departmentId", e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium text-zinc-100 cursor-pointer focus:ring-0"
          >
            <option value="all">All</option>
            {departments.map(d => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}

      {role === 'employee' && (
        <div className="bg-zinc-900 border border-white/10 rounded px-4 py-2 flex items-center gap-3">
          <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest hidden sm:inline">Dept</span>
          <span className="text-sm font-medium text-zinc-100">Your Dept</span>
        </div>
      )}

      <button
        onClick={handleExport}
        title="Export Spreadsheet"
        className="text-zinc-500 hover:text-white p-2 transition-colors"
      >
        <Download className="w-5 h-5" />
      </button>

      <button
        onClick={() => navigate(logRoute)}
        className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap"
      >
        Log Entry
      </button>
    </div>
  );
}
