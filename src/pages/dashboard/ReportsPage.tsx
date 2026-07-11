import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import apiClient from '../../api/axiosClient';

export default function ReportsPage() {
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
  const [filters, setFilters] = useState({
    departmentId: 'all',
    startDate: '',
    endDate: ''
  });
  const [exporting, setExporting] = useState(false);
  const [previewLogs, setPreviewLogs] = useState<any[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [summary, setSummary] = useState<{totalEmissions: number, logCount: number} | null>(null);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await apiClient.get('/departments');
        setDepartments(res.data);
      } catch (error) {
        console.error('Failed to fetch departments', error);
      }
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    const fetchPreview = async () => {
      setPreviewLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.departmentId && filters.departmentId !== 'all') params.append("departmentId", filters.departmentId);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        
        params.append("limit", "10"); // Only preview top 10

        const [logsRes, summaryRes] = await Promise.all([
          apiClient.get(`/logs?${params.toString()}`),
          apiClient.get(`/analytics/summary?${params.toString()}`)
        ]);

        setPreviewLogs(logsRes.data.logs || []);
        setSummary(summaryRes.data);
      } catch (error) {
        console.error("Error fetching preview", error);
      } finally {
        setPreviewLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchPreview, 500);
    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams();
      if (filters.departmentId && filters.departmentId !== 'all') {
        params.append("departmentId", filters.departmentId);
      }
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      // The backend actually returns XLSX, let's fix the filename extension
      const response = await apiClient.get(`/analytics/export?${params.toString()}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data as any]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ecotrack_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting data", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-light text-zinc-100 mb-2">Reports & Exports</h1>
        <p className="text-zinc-500 text-sm">
          Generate custom spreadsheet reports ready for compliance and board review.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
            <h3 className="text-zinc-100 font-bold flex items-center gap-2 mb-6">
              <Filter className="w-4 h-4 text-emerald-500" />
              Report Parameters
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Department</label>
                <select
                  value={filters.departmentId}
                  onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                >
                  <option value="all">All Departments</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer [color-scheme:dark]"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black px-4 py-3 rounded-lg font-bold uppercase tracking-wide transition-colors text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:shadow-none"
              >
                <Download className="w-4 h-4" />
                {exporting ? 'Generating...' : 'Export XLSX'}
              </button>
            </div>
          </div>
        </div>

        {/* Data Preview Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <FileText className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Selected Records</p>
                <p className="text-2xl font-light text-zinc-100">{summary ? summary.logCount.toLocaleString() : '0'}</p>
              </div>
            </div>
            <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Filter className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Total Emissions (Filtered)</p>
                <p className="text-2xl font-light text-zinc-100">
                  {summary ? summary.totalEmissions.toLocaleString() : '0'} <span className="text-sm text-blue-500 font-medium">tCO2e</span>
                </p>
              </div>
            </div>
          </div>

          {/* Preview Table */}
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
              <h3 className="text-zinc-200 font-medium text-sm">Data Preview (Top 10 Rows)</h3>
              {previewLoading && <span className="text-xs text-zinc-500 animate-pulse">Updating...</span>}
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0a0a0a] sticky top-0 border-b border-white/5 shadow-sm">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Activity</th>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-wider text-zinc-500 uppercase text-right">Raw Amount</th>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-wider text-zinc-500 uppercase text-right">CO2e</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {previewLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-sm">
                        No logs match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    previewLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                          {new Date(log.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                          {log.departmentId?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                          {log.activityType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 text-right font-mono">
                          {log.rawAmount.toLocaleString()} <span className="text-[10px] text-zinc-600">{log.rawUnit}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 text-right font-mono font-bold">
                          {log.carbonEquivalent.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
