import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { useFilters } from "../../context/FilterContext";
import apiClient from "../../api/axiosClient";

const COLORS = ['#10b981', '#0ea5e9', '#6366f1', '#a855f7', '#f43f5e'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dark:bg-[#18181b] bg-white border dark:border-white/10 border-gray-200 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs dark:text-zinc-400 text-gray-600 font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold" style={{ color: payload[0].color }}>
        {payload[0].value?.toLocaleString()} <span className="dark:text-zinc-500 text-gray-500 font-normal">tCO₂e</span>
      </p>
    </div>
  );
};

export default function DepartmentBarChart() {
  const { filters } = useFilters();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.departmentId && filters.departmentId !== "all") params.append("departmentId", filters.departmentId);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const res = await apiClient.get(`/analytics/by-department?${params.toString()}`);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching department data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSources();
  }, [filters]);

  if (loading) {
    return (
      <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/[0.06] border-gray-200 p-6 rounded-2xl h-80 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-4 w-4 bg-emerald-500/50 rounded-full"></div>
          <div className="h-4 w-4 bg-emerald-500/50 rounded-full animation-delay-200"></div>
          <div className="h-4 w-4 bg-emerald-500/50 rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/[0.06] border-gray-200 p-6 rounded-2xl h-80 flex items-center justify-center dark:text-zinc-500 text-gray-500 text-sm">
        No department data available.
      </div>
    );
  }

  return (
    <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/[0.06] border-gray-200 p-6 rounded-2xl flex flex-col h-full min-h-[340px] transition-all duration-300 hover:dark:border-white/[0.12] border-gray-200">
      <span className="text-[10px] dark:text-zinc-500 text-gray-500 uppercase tracking-[0.15em] font-semibold mb-5">Emissions by Department</span>
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={4}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.3 }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
