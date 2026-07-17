import React, { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useFilters } from "../../context/FilterContext";
import apiClient from "../../api/axiosClient";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-xs dark:text-zinc-400 text-gray-600 font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-emerald-400">
        {payload[0].value?.toLocaleString()} <span className="dark:text-zinc-500 text-gray-500 font-normal">tCO₂e</span>
      </p>
    </div>
  );
};

export default function EmissionTrendChart() {
  const { filters } = useFilters();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.departmentId && filters.departmentId !== "all") params.append("departmentId", filters.departmentId);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const res = await apiClient.get(`/analytics/trend?${params.toString()}`);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching trend data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrend();
  }, [filters]);

  if (loading) {
    return (
      <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 p-6 rounded-2xl h-80 shadow-sm flex items-center justify-center">
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
      <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 p-6 rounded-2xl h-80 shadow-sm flex items-center justify-center dark:text-zinc-500 text-gray-500 text-sm">
        No trend data available.
      </div>
    );
  }

  return (
    <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 p-6 rounded-2xl flex flex-col h-full min-h-[340px] transition-all duration-300 shadow-sm hover:border-emerald-500/30 dark:hover:border-white/[0.12] hover:shadow-md hover:-translate-y-0.5">
      <span className="text-[10px] dark:text-zinc-500 text-gray-500 uppercase tracking-[0.15em] font-semibold mb-6">Emission Trend (tCO₂e)</span>
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeOpacity: 0.2, strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="tCO2e"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCo2)"
              activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#18181b' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
