import React, { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useFilters } from "../../context/FilterContext";
import apiClient from "../../api/axiosClient";

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

export default function EmissionSourcePieChart() {
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

        const res = await apiClient.get(`/analytics/by-source?${params.toString()}`);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching source data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSources();
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
        No source data available.
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f0f] border border-white/5 p-5 rounded-2xl flex flex-col h-full min-h-[320px]">
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Emissions by Source</span>
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} tCO2e`, 'Emissions']}
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5', borderRadius: '8px' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
