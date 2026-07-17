import React, { useState, useEffect, useRef } from "react";
import apiClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Pencil } from "lucide-react";
import { Select } from "../../components/ui/Select";

const getUnitForActivity = (activityType: string) => {
  switch (activityType) {
    case "Travel": return "miles";
    case "Utilities": return "kWh";
    case "Supply Chain": return "kg";
    default: return "unit";
  }
};

interface Props {
  onSuccess: () => void;
  editingLog?: any;
  onCancelEdit?: () => void;
}

export default function ManualEntryForm({ onSuccess, editingLog, onCancelEdit }: Props) {
  const { role, departmentId: clientDeptId } = useAuth();
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
  
  const defaultFormState = {
    date: new Date().toISOString().split('T')[0],
    departmentId: "",
    activityType: "Travel",
    rawAmount: "",
    rawUnit: "miles",
    source: ""
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await apiClient.get("/departments");
        setDepartments(res.data);
        if (!editingLog) {
          if (role === 'employee' && clientDeptId) {
            setFormData(prev => ({ ...prev, departmentId: clientDeptId }));
          } else if (res.data.length > 0) {
            setFormData(prev => ({ ...prev, departmentId: res.data[0]._id }));
          }
        }
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };
    fetchDepts();
  }, [role, clientDeptId, editingLog]);

  useEffect(() => {
    if (editingLog) {
      setFormData({
        date: new Date(editingLog.date).toISOString().split('T')[0],
        departmentId: editingLog.departmentId._id || editingLog.departmentId,
        activityType: editingLog.activityType,
        rawAmount: editingLog.rawAmount.toString(),
        rawUnit: getUnitForActivity(editingLog.activityType),
        source: editingLog.source || ""
      });
      // Smoothly scroll to the form when edit mode is triggered
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // Reset form if editing is cancelled or finished
      setFormData({
        ...defaultFormState,
        departmentId: role === 'employee' && clientDeptId ? clientDeptId : (departments.length > 0 ? departments[0]._id : "")
      });
    }
  }, [editingLog]);

  const handleActivityChange = (activityType: string) => {
    const rawUnit = getUnitForActivity(activityType);
    setFormData(prev => ({ ...prev, activityType, rawUnit }));
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        rawAmount: Number(formData.rawAmount)
      };

      if (editingLog) {
        await apiClient.put(`/logs/${editingLog._id}`, payload);
        toast('Log entry updated successfully!', 'success');
      } else {
        await apiClient.post("/logs", payload);
        toast('Log entry added successfully!', 'success');
      }
      
      setFormData(prev => ({ ...prev, rawAmount: "", source: "" }));
      onSuccess();
    } catch (error) {
      console.error("Error submitting log", error);
      toast(`Failed to ${editingLog ? 'update' : 'add'} log entry. Please try again.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!editingLog;

  return (
    <div 
      ref={formRef}
      className={`bg-white border rounded-2xl p-8 h-full flex flex-col transition-all duration-300 ${
        isEditing 
          ? "dark:bg-emerald-900/5 dark:border-emerald-500/30 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
          : "dark:bg-[#0f0f0f] dark:border-white/5 border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 mb-8">
        {isEditing && (
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <Pencil className="w-3.5 h-3.5" />
          </div>
        )}
        <h3 className="text-sm font-bold uppercase tracking-widest dark:text-zinc-100 text-gray-900">
          {isEditing ? "Edit Emission Log" : "Manual Log Entry"}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mb-8">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full dark:bg-zinc-900 bg-gray-50 border dark:border-white/10 border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Department</label>
            <Select
              value={formData.departmentId}
              onChange={value => setFormData({ ...formData, departmentId: value })}
              disabled={role === 'employee'}
              options={[
                { value: '', label: 'Select Department', disabled: true },
                ...departments.map(d => ({ value: d._id, label: d.name })),
                ...(role === 'employee' && !departments.find(d => d._id === clientDeptId) && clientDeptId ? [{ value: clientDeptId, label: 'Your Department' }] : [])
              ]}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Activity Type</label>
            <Select
              value={formData.activityType}
              onChange={handleActivityChange}
              options={[
                { value: 'Travel', label: 'Travel' },
                { value: 'Utilities', label: 'Utilities' },
                { value: 'Supply Chain', label: 'Supply Chain' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-grow space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.rawAmount}
                onChange={e => setFormData({ ...formData, rawAmount: e.target.value })}
                className="w-full dark:bg-zinc-900 bg-gray-50 border dark:border-white/10 border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="e.g. 500"
                required
              />
            </div>
            <div className="w-24 space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Unit</label>
              <input
                type="text"
                value={formData.rawUnit}
                readOnly
                disabled
                className="w-full dark:bg-zinc-900/50 bg-gray-100 border dark:border-white/5 border-gray-200 rounded-lg px-4 py-3 text-sm font-medium dark:text-zinc-500 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Source / Notes</label>
            <input
              type="text"
              value={formData.source}
              onChange={e => setFormData({ ...formData, source: e.target.value })}
              className="w-full dark:bg-zinc-900 bg-gray-50 border dark:border-white/10 border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder="e.g. Q1 Electricity Bill"
            />
          </div>
        </div>

        <div className="mt-auto pt-4 flex gap-3">
          <button
            type="submit"
            disabled={loading || !formData.departmentId}
            className={`flex-grow bg-emerald-500 hover:bg-emerald-400 disabled:dark:bg-zinc-800 bg-gray-200 disabled:dark:text-zinc-500 text-gray-500 text-black px-6 py-3.5 rounded-lg font-bold uppercase tracking-wide transition-all duration-300 text-sm shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] disabled:shadow-none`}
          >
            {loading ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update Entry" : "Save Entry")}
          </button>
          
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-3.5 rounded-lg font-bold uppercase tracking-wide transition-colors duration-300 text-sm dark:bg-zinc-900 bg-gray-100 dark:hover:bg-zinc-800 hover:bg-gray-200 dark:text-zinc-300 text-gray-700 border dark:border-white/10 border-transparent disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
