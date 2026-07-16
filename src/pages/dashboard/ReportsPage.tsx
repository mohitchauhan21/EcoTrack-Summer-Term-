import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { Select } from '../../components/ui/Select';
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
    <div className="max-w-6xl space-y-10 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-light dark:text-zinc-100 text-gray-900 mb-2">Reports & Exports</h1>
        <p className="dark:text-zinc-500 text-gray-500 text-sm">
          Generate custom spreadsheet reports ready for compliance and board review.
        </p>
      </div>

      {/* 1. Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/5 border-gray-200 rounded-2xl p-8 flex items-center gap-6 shadow-sm h-full">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shrink-0">
            <FileText className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">Selected Records</p>
            <p className="text-4xl font-light dark:text-zinc-100 text-gray-900 tracking-tight">
              {summary ? summary.logCount.toLocaleString() : '0'}
            </p>
          </div>
        </div>
        
        <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/5 border-gray-200 rounded-2xl p-8 flex items-center gap-6 shadow-sm h-full">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shrink-0">
            <Filter className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">Total Emissions (Filtered)</p>
            <p className="text-4xl font-light dark:text-zinc-100 text-gray-900 tracking-tight">
              {summary ? summary.totalEmissions.toLocaleString() : '0'}
              <span className="text-lg text-blue-500 font-medium ml-2 tracking-normal">tCO₂e</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Report Parameters */}
      <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/5 border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="mb-8 border-b dark:border-white/5 border-gray-100 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest dark:text-zinc-100 text-gray-900 flex items-center gap-2 mb-1">
            <Filter className="w-4 h-4 text-emerald-500" />
            Report Parameters
          </h3>
          <p className="text-xs dark:text-zinc-500 text-gray-500">
            These settings control the data included in the generated report.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Department</label>
            <Select
              value={filters.departmentId}
              onChange={(value) => setFilters({ ...filters, departmentId: value })}
              options={[
                { value: 'all', label: 'All Departments' },
                ...departments.map((d) => ({ value: d._id, label: d.name }))
              ]}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full dark:bg-zinc-900 bg-gray-50 border dark:border-white/10 border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer [color-scheme:dark]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full dark:bg-zinc-900 bg-gray-50 border dark:border-white/10 border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer [color-scheme:dark]"
            />
          </div>

          <div className="flex lg:justify-end lg:col-span-1 md:col-span-2">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full lg:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:dark:bg-zinc-800 bg-gray-200 disabled:dark:text-zinc-500 text-gray-500 text-black px-6 py-3.5 rounded-lg font-bold uppercase tracking-wide transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] disabled:shadow-none min-w-[180px]"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Generating...' : 'Export Report'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Report Preview */}
      <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/5 border-gray-200 rounded-2xl overflow-hidden flex flex-col h-[550px] shadow-sm">
        <div className="px-6 py-5 border-b dark:border-white/5 border-gray-100 flex justify-between items-center dark:bg-[#0f0f0f] bg-white">
          <h3 className="dark:text-zinc-100 text-gray-900 font-bold text-sm uppercase tracking-widest">Data Preview <span className="dark:text-zinc-500 text-gray-500 font-normal tracking-normal normal-case ml-2">(Top 10 Rows)</span></h3>
          {previewLoading && <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 animate-pulse">Updating...</span>}
        </div>
        
        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-10 dark:bg-[#0a0a0a] bg-gray-50/95 backdrop-blur-md border-b dark:border-white/5 border-gray-200 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold tracking-wider dark:text-zinc-500 text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold tracking-wider dark:text-zinc-500 text-gray-500 uppercase">Department</th>
                <th className="px-6 py-4 text-[10px] font-bold tracking-wider dark:text-zinc-500 text-gray-500 uppercase">Activity</th>
                <th className="px-6 py-4 text-[10px] font-bold tracking-wider dark:text-zinc-500 text-gray-500 uppercase text-right">Raw Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold tracking-wider dark:text-zinc-500 text-gray-500 uppercase text-right">CO₂e (t)</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/[0.04] divide-gray-100">
              {previewLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full dark:bg-zinc-900 bg-gray-100 flex items-center justify-center mb-4 text-emerald-500/50">
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium dark:text-zinc-200 text-gray-800 mb-1">No records found</p>
                      <p className="text-sm dark:text-zinc-500 text-gray-500 max-w-sm">
                        There is no data matching your current report parameters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                previewLogs.map((log) => (
                  <tr key={log._id} className="dark:hover:bg-white/[0.02] hover:bg-gray-50/80 transition-colors duration-200 dark:text-zinc-300 text-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-sm">
                      {new Date(log.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.departmentId?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white/5 border dark:border-white/10 border-gray-200">
                        {log.activityType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="font-medium dark:text-zinc-100 text-gray-900">{log.rawAmount.toLocaleString()}</span>
                      <span className="dark:text-zinc-500 text-gray-500 text-xs ml-1.5">{log.rawUnit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="font-bold text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                        {log.carbonEquivalent.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
