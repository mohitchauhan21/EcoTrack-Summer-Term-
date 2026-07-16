import React, { useState, useEffect } from "react";
import apiClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

interface Props {
  onSuccess: () => void;
}

export default function ManualEntryForm({ onSuccess }: Props) {
  const { role, departmentId: clientDeptId } = useAuth();
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    departmentId: "",
    activityType: "Travel",
    rawAmount: "",
    rawUnit: "miles",
    source: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await apiClient.get("/departments");
        setDepartments(res.data);
        if (role === 'employee' && clientDeptId) {
          setFormData(prev => ({ ...prev, departmentId: clientDeptId }));
        } else if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, departmentId: res.data[0]._id }));
        }
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };
    fetchDepts();
  }, [role, clientDeptId]);

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const activityType = e.target.value;
    let rawUnit = "unit";
    if (activityType === "Travel") rawUnit = "miles";
    else if (activityType === "Utilities") rawUnit = "kWh";
    else if (activityType === "Supply Chain") rawUnit = "kg";

    setFormData(prev => ({ ...prev, activityType, rawUnit }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/logs", {
        ...formData,
        rawAmount: Number(formData.rawAmount)
      });
      toast('Log entry added successfully!', 'success');
      setFormData(prev => ({ ...prev, rawAmount: "", source: "" })); // Reset some fields
      onSuccess();
    } catch (error) {
      console.error("Error submitting log", error);
      toast('Failed to add log entry. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100 mb-6">Manual Log Entry</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Department</label>
            <select
              value={formData.departmentId}
              onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
              disabled={role === 'employee'}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer disabled:opacity-50"
              required
            >
              <option value="" disabled>Select Department</option>
              {departments.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
              {role === 'employee' && !departments.find(d => d._id === clientDeptId) && clientDeptId && (
                <option value={clientDeptId}>Your Department</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Activity Type</label>
            <select
              value={formData.activityType}
              onChange={handleActivityChange}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
            >
              <option value="Travel">Travel</option>
              <option value="Utilities">Utilities</option>
              <option value="Supply Chain">Supply Chain</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-grow">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.rawAmount}
                onChange={e => setFormData({ ...formData, rawAmount: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="e.g. 500"
                required
              />
            </div>
            <div className="w-24">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Unit</label>
              <input
                type="text"
                value={formData.rawUnit}
                onChange={e => setFormData({ ...formData, rawUnit: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                required
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Source / Notes</label>
            <input
              type="text"
              value={formData.source}
              onChange={e => setFormData({ ...formData, source: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder="e.g. Q1 Electricity Bill"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !formData.departmentId}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wide transition-colors w-full sm:w-auto text-sm"
        >
          {loading ? "Saving..." : "Save Entry"}
        </button>
      </form>
    </div>
  );
}
