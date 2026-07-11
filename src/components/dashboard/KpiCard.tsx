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
    <div className="bg-[#0f0f0f] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-full">
      <div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{title}</span>
        {loading ? (
          <div className="animate-pulse flex flex-col gap-2 mt-2">
            <div className="h-8 bg-zinc-800 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
          </div>
        ) : (
          <>
            <div className="text-4xl font-light mt-1 text-zinc-100 flex items-baseline">
              {typeof value === 'string' && value.includes('%') ? (
                 <>{value}</>
              ) : (
                 <AnimatedCounter 
                    value={typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value} 
                    decimals={typeof value === 'string' && value.includes('.') ? 2 : 0} 
                 />
              )}
              {subtitle === 'tCO2e' && <span className="text-lg text-emerald-500 ml-1">tCO2e</span>}
            </div>
            {subtitle !== 'tCO2e' && subtitle && <div className="text-sm text-zinc-400 mt-1">{subtitle}</div>}
          </>
        )}
      </div>

      {!loading && trend !== undefined && (
        <div className={`flex items-center gap-2 text-xs mt-4 ${trend <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend <= 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
          {Math.abs(trend)}% {trend <= 0 ? 'Improvement' : 'Increase'} vs previous period
        </div>
      )}
      
      {!loading && trend === undefined && (
        <div className="h-1 bg-zinc-800 rounded-full mt-6">
          <div className="h-full bg-emerald-500 rounded-full w-[80%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>
      )}
    </div>
  );
}
