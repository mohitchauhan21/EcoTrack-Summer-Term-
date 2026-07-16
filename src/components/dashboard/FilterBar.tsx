import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFilters } from "../../context/FilterContext";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/axiosClient";
import { Plus, Download } from "lucide-react";
import { Select } from "../ui/Select";

interface FilterBarProps {
  hideLogEntry?: boolean;
}

export default function FilterBar({ hideLogEntry }: FilterBarProps = {}) {
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
    let startDate: string | null = null;
    let endDate: string | null = now.toISOString();

    if (preset === "This Month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    } else if (preset === "Last Quarter") {
      const currentQ = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), (currentQ - 1) * 3, 1).toISOString();
      endDate = new Date(now.getFullYear(), currentQ * 3, 0, 23, 59, 59).toISOString();
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

  const selectClasses = "bg-transparent border-none outline-none text-sm font-medium dark:text-zinc-100 text-gray-900 cursor-pointer focus:ring-0 appearance-none pr-6";
  const controlClasses = "dark:bg-zinc-900/80 bg-gray-50 border dark:border-white/[0.08] border-gray-200 rounded-xl px-4 h-10 flex items-center gap-2.5 transition-colors hover:dark:border-white/[0.14] border-gray-300";

  return (
    <div className="flex flex-wrap items-center justify-between w-full gap-4">
      {/* Left side filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className={controlClasses}>
          <span className="text-[10px] dark:text-zinc-500 text-gray-500 uppercase font-semibold tracking-[0.12em] hidden sm:inline">Period</span>
          <Select
            value={filters.preset}
            onChange={handleDatePresetChange}
            variant="ghost"
            className="min-w-[120px]"
            options={[
              { value: "All Time", label: "All Time" },
              { value: "This Month", label: "This Month" },
              { value: "Last Quarter", label: "Last Quarter" },
              { value: "Year to Date", label: "Year to Date" },
            ]}
          />
        </div>

        {role !== 'employee' && (
          <div className={controlClasses}>
            <span className="text-[10px] dark:text-zinc-500 text-gray-500 uppercase font-semibold tracking-[0.12em] hidden sm:inline">Dept</span>
            <Select
              value={filters.departmentId || "all"}
              onChange={(value) => updateFilter("departmentId", value)}
              variant="ghost"
              className="min-w-[120px]"
              options={[
                { value: "all", label: "All" },
                ...departments.map(d => ({ value: d._id, label: d.name }))
              ]}
            />
          </div>
        )}

        {role === 'employee' && (
          <div className={controlClasses}>
            <span className="text-[10px] dark:text-zinc-500 text-gray-500 uppercase font-semibold tracking-[0.12em] hidden sm:inline">Dept</span>
            <span className="text-sm font-medium dark:text-zinc-100 text-gray-900">Your Dept</span>
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={handleExport}
          title="Export Spreadsheet"
          className="h-10 px-4 flex items-center gap-2 rounded-xl dark:bg-zinc-900/80 bg-white border dark:border-white/[0.08] border-gray-200 dark:text-zinc-300 text-gray-700 hover:dark:text-white hover:text-gray-900 hover:dark:border-white/[0.14] hover:bg-gray-50 transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        {!hideLogEntry && (
          <button
            onClick={() => navigate(logRoute)}
            className="bg-emerald-500 hover:bg-emerald-400 text-black h-10 px-5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-[0.98] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Log Entry
          </button>
        )}
      </div>
    </div>
  );
}
