import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from "recharts";
import { useFilters } from "../../context/FilterContext";
import apiClient from "../../api/axiosClient";

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
      <div className="bg-[#0f0f0f] border border-white/5 p-5 rounded-2xl h-80 flex items-center justify-center">
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
      <div className="bg-[#0f0f0f] border border-white/5 p-5 rounded-2xl h-80 flex items-center justify-center text-zinc-500">
        No trend data available.
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f0f] border border-white/5 p-5 rounded-2xl flex flex-col h-full min-h-[320px]">
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Emission Trend (tCO2e)</span>
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Area type="monotone" dataKey="tCO2e" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
