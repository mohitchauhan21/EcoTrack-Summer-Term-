import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import AnimatedCounter from "../ui/AnimatedCounter";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number; // negative is good (green), positive is bad (red)
  loading?: boolean;
}

export default function KpiCard({ title, value, subtitle, trend, loading }: KpiCardProps) {
  return (
    <div className="group dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 p-6 rounded-2xl flex flex-col justify-between h-full shadow-sm transition-all duration-300 hover:border-emerald-500/30 dark:hover:border-white/[0.12] hover:shadow-md hover:-translate-y-0.5">
      <div>
        <span className="text-[10px] dark:text-zinc-500 text-gray-500 uppercase tracking-[0.15em] font-semibold">{title}</span>

        {loading ? (
          <div className="animate-pulse flex flex-col gap-3 mt-4">
            <div className="h-9 dark:bg-zinc-800/60 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="h-4 dark:bg-zinc-800/40 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : (
          <>
            <div className="text-[2.5rem] font-extralight mt-2 dark:text-zinc-50 text-gray-950 leading-tight flex items-baseline gap-1 tracking-tight">
              {typeof value === 'string' && value.includes('%') ? (
                 <>{value}</>
              ) : typeof value === 'string' && isNaN(parseFloat(value.replace(/,/g, ''))) ? (
                 <span className="text-3xl">{value}</span>
              ) : (
                 <AnimatedCounter 
                    value={typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value} 
                    decimals={typeof value === 'string' && value.includes('.') ? 2 : 0} 
                 />
              )}
              {subtitle === 'tCO2e' && (
                <span className="text-sm font-medium text-emerald-500/80 ml-0.5">tCO₂e</span>
              )}
            </div>
            {subtitle !== 'tCO2e' && subtitle && (
              <div className="text-xs dark:text-zinc-500 text-gray-500 mt-2 font-medium">{subtitle}</div>
            )}
          </>
        )}
      </div>

      {!loading && trend !== undefined && (
        <div className={`flex items-center gap-1.5 text-xs mt-5 font-medium ${trend <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend <= 0 ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
          {Math.abs(trend).toFixed(1)}% {trend <= 0 ? 'improvement' : 'increase'} vs previous period
        </div>
      )}
      
      {!loading && trend === undefined && (
        <div className="h-1 dark:bg-zinc-800/60 bg-gray-200 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-emerald-500/80 rounded-full w-[80%] transition-all duration-1000 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
        </div>
      )}
    </div>
  );
}
