import React, { useEffect, useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useFilters } from "../../context/FilterContext";
import apiClient from "../../api/axiosClient";

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dark:bg-[#18181b] bg-white border dark:border-white/10 border-gray-200 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs dark:text-zinc-400 text-gray-600 font-medium mb-1">{payload[0].name}</p>
      <p className="text-sm font-semibold" style={{ color: payload[0].payload.fill }}>
        {payload[0].value?.toLocaleString()} <span className="dark:text-zinc-500 text-gray-500 font-normal">tCO₂e</span>
      </p>
    </div>
  );
};

// Custom label that renders in the center of the doughnut
const CenterLabel = ({ viewBox, total }: { viewBox?: any; total: number }) => {
  if (!viewBox) return null;
  const { cx, cy } = viewBox;
  return (
    <g>
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="central" className="fill-zinc-50 text-2xl font-light">
        {total.toLocaleString()}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="central" className="fill-zinc-500 text-[10px] uppercase tracking-widest font-semibold">
        tCO₂e
      </text>
    </g>
  );
};

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

  const total = useMemo(
    () => data.reduce((sum: number, item: any) => sum + (item.value || 0), 0),
    [data]
  );

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
        No source data available.
      </div>
    );
  }

  return (
    <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/[0.06] border-gray-200 p-6 rounded-2xl flex flex-col h-full min-h-[340px] transition-all duration-300 hover:dark:border-white/[0.12] border-gray-200">
      <span className="text-[10px] dark:text-zinc-500 text-gray-500 uppercase tracking-[0.15em] font-semibold mb-2">Emissions by Source</span>
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="46%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              {/* Center label */}
              <CenterLabel total={Math.round(total)} />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
