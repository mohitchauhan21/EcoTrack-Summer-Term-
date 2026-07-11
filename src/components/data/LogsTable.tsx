import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useFilters } from "../../context/FilterContext";
import apiClient from "../../api/axiosClient";

interface Props {
  refreshTrigger: number;
}

export default function LogsTable({ refreshTrigger }: Props) {
  const { filters } = useFilters();
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.departmentId && filters.departmentId !== "all") params.append("departmentId", filters.departmentId);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      params.append("page", page.toString());
      params.append("limit", "10");

      const res = await apiClient.get(`/logs?${params.toString()}`);
      setLogs(res.data.logs);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Error fetching logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters, page, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this log?")) {
      try {
        await apiClient.delete(`/logs/${id}`);
        fetchLogs();
      } catch (error) {
        console.error("Error deleting log", error);
      }
    }
  };

  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
        <h3 className="text-xl font-light text-zinc-100">Emission Logs</h3>
        <span className="text-sm font-medium text-zinc-500">{total} entries</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a] text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
              <th className="p-5 border-b border-white/5 text-left">Date</th>
              <th className="p-5 border-b border-white/5 text-left">Department</th>
              <th className="p-5 border-b border-white/5 text-left">Activity</th>
              <th className="p-5 border-b border-white/5 text-left">Amount</th>
              <th className="p-5 border-b border-white/5 text-left">CO2e (t)</th>
              <th className="p-5 border-b border-white/5 text-left">Source</th>
              <th className="p-5 border-b border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm font-medium">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-500">Loading data...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-500">No logs found matching your filters.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-white/[0.02] transition-colors text-zinc-300">
                  <td className="p-5 whitespace-nowrap">{format(new Date(log.date), 'MMM d, yyyy')}</td>
                  <td className="p-5">{log.departmentId?.name || 'Unknown'}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      log.activityType === 'Travel' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      log.activityType === 'Utilities' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      log.activityType === 'Supply Chain' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {log.activityType}
                    </span>
                  </td>
                  <td className="p-5 text-zinc-100">{log.rawAmount.toLocaleString()} <span className="text-zinc-500 text-xs ml-1">{log.rawUnit}</span></td>
                  <td className="p-5 text-emerald-400">{log.carbonEquivalent.toFixed(2)}</td>
                  <td className="p-5 text-zinc-500 max-w-[200px] truncate" title={log.source}>{log.source || '-'}</td>
                  <td className="p-5 text-right whitespace-nowrap">
                    <button className="text-zinc-500 hover:text-white mr-4 transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(log._id)} className="text-zinc-500 hover:text-red-400 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-5 border-t border-white/5 bg-[#0a0a0a] flex items-center justify-between mt-auto">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-zinc-900 border border-white/10 text-zinc-300 rounded text-sm font-bold uppercase tracking-wide hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Page {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={page * 10 >= total}
          className="px-4 py-2 bg-zinc-900 border border-white/10 text-zinc-300 rounded text-sm font-bold uppercase tracking-wide hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
