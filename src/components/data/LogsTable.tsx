import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2, FileX, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useFilters } from "../../context/FilterContext";
import apiClient from "../../api/axiosClient";

interface Props {
  refreshTrigger: number;
  onEdit?: (log: any) => void;
}

export default function LogsTable({ refreshTrigger, onEdit }: Props) {
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

  const handleAddFirstLog = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
      <div className="px-6 py-5 border-b dark:border-white/[0.06] border-gray-100 flex justify-between items-center dark:bg-zinc-900 bg-white">
        <div>
          <h3 className="text-xl font-medium dark:text-zinc-100 text-gray-900">Emission Logs</h3>
          <p className="text-xs dark:text-zinc-500 text-gray-500 mt-1 tracking-wide">{total} total entries found</p>
        </div>
      </div>
      
      <div className="overflow-x-auto flex-grow relative min-h-[650px]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-10 dark:bg-zinc-800 bg-gray-50/95 backdrop-blur-md border-b dark:border-white/[0.06] border-gray-200 shadow-sm">
            <tr className="dark:text-zinc-500 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
              <th className="px-6 py-4 text-left font-bold tracking-wider">Date</th>
              <th className="px-6 py-4 text-left font-bold tracking-wider">Department</th>
              <th className="px-6 py-4 text-left font-bold tracking-wider">Activity</th>
              <th className="px-6 py-4 text-right font-bold tracking-wider">Amount</th>
              <th className="px-6 py-4 text-right font-bold tracking-wider">CO₂e (t)</th>
              <th className="px-6 py-4 text-left font-bold tracking-wider">Source</th>
              <th className="px-6 py-4 text-right font-bold tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y dark:divide-white/[0.04] divide-gray-100 text-sm transition-opacity duration-300 ${loading && logs.length > 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            {loading && logs.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-5"><div className="h-4 dark:bg-zinc-800 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-5"><div className="h-4 dark:bg-zinc-800 bg-gray-200 rounded w-32"></div></td>
                  <td className="px-6 py-5"><div className="h-6 dark:bg-zinc-800 bg-gray-200 rounded-full w-20"></div></td>
                  <td className="px-6 py-5 flex justify-end"><div className="h-4 dark:bg-zinc-800 bg-gray-200 rounded w-16"></div></td>
                  <td className="px-6 py-5"><div className="flex justify-end"><div className="h-4 dark:bg-zinc-800 bg-gray-200 rounded w-12"></div></div></td>
                  <td className="px-6 py-5"><div className="h-4 dark:bg-zinc-800 bg-gray-200 rounded w-28"></div></td>
                  <td className="px-6 py-5 flex justify-end"><div className="h-8 w-16 dark:bg-zinc-800 bg-gray-200 rounded"></div></td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full dark:bg-zinc-900 bg-gray-100 flex items-center justify-center mb-4 text-emerald-500/50">
                      <FileX className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium dark:text-zinc-200 text-gray-800 mb-1">No emission logs found</p>
                    <p className="text-sm dark:text-zinc-500 text-gray-500 mb-6 max-w-sm">
                      There is no data matching your current filters. Adjust your filters or add a new entry to get started.
                    </p>
                    <button 
                      onClick={handleAddFirstLog}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-bold uppercase tracking-wide text-xs transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Log
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="dark:hover:bg-white/[0.02] hover:bg-gray-50/80 transition-colors duration-200 dark:text-zinc-300 text-gray-700 group">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{format(new Date(log.date), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.departmentId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                      log.activityType === 'Travel' ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20' :
                      log.activityType === 'Utilities' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      log.activityType === 'Supply Chain' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' :
                      'dark:bg-zinc-800 bg-gray-200 dark:text-zinc-400 text-gray-600 border border-gray-300 dark:border-zinc-700'
                    }`}>
                      {log.activityType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-medium dark:text-zinc-100 text-gray-900">{log.rawAmount.toLocaleString()}</span>
                    <span className="dark:text-zinc-500 text-gray-500 text-xs ml-1.5">{log.rawUnit}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-bold text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                      {log.carbonEquivalent.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-[200px] truncate dark:text-zinc-500 text-gray-500" title={log.source}>
                    {log.source || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => onEdit && onEdit(log)}
                        className="p-2 rounded-full dark:text-zinc-400 text-gray-500 dark:hover:text-white hover:text-gray-900 dark:hover:bg-white/10 hover:bg-gray-200 transition-colors" 
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(log._id)} 
                        className="p-2 rounded-full dark:text-zinc-400 text-gray-500 hover:text-red-500 dark:hover:bg-red-500/10 hover:bg-red-50 transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t dark:border-white/[0.06] border-gray-100 dark:bg-zinc-900 bg-white flex items-center justify-between">
        <span className="dark:text-zinc-500 text-gray-500 text-xs font-bold uppercase tracking-widest">
          Page <span className="dark:text-zinc-200 text-gray-800">{page}</span> of <span className="dark:text-zinc-200 text-gray-800">{totalPages}</span>
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 flex items-center justify-center dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 dark:text-zinc-300 text-gray-700 rounded-lg dark:hover:bg-zinc-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {/* Dynamic pagination indicators */}
            {(() => {
              const startPage = Math.floor((page - 1) / 5) * 5 + 1;
              const endPage = Math.min(startPage + 4, totalPages);
              const pages = [];
              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }

              return pages.map((pageNum) => {
                const isActive = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      isActive 
                        ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                        : "dark:text-zinc-400 text-gray-600 dark:hover:bg-white/5 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              });
            })()}
          </div>

          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages}
            className="p-2 flex items-center justify-center dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 dark:text-zinc-300 text-gray-700 rounded-lg dark:hover:bg-zinc-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
