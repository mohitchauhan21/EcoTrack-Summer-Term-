import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Building2 } from 'lucide-react';
import apiClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface Department {
  _id: string;
  name: string;
  companyId: string;
}

export default function CompanyDepartmentsTab() {
  const { role } = useAuth();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDeptName, setNewDeptName] = useState('');
  const [adding, setAdding] = useState(false);
  const [companyId, setCompanyId] = useState<string>('');

  const fetchDepartments = async () => {
    try {
      const res = await apiClient.get('/departments');
      setDepartments(res.data);
    } catch (error) {
      console.error('Failed to fetch departments', error);
      toast('Failed to fetch departments', 'error');
    }
  };

  const fetchCompanyId = async () => {
    try {
      const res = await apiClient.get('/company');
      setCompanyId(res.data._id);
    } catch (error) {
      console.error('Failed to fetch company', error);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchCompanyId(), fetchDepartments()]);
      setLoading(false);
    })();
  }, []);

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    if (!companyId) {
      toast('Company details are still loading. Please try again in a moment.', 'error');
      return;
    }

    setAdding(true);
    try {
      await apiClient.post('/departments', { name: newDeptName, companyId });
      toast('Department added successfully', 'success');
      setNewDeptName('');
      await fetchDepartments();
    } catch (error: any) {
      console.error('Failed to add department', error);
      toast(error?.response?.data?.message || 'Failed to add department', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await apiClient.delete(`/departments/${id}`);
      toast('Department removed', 'success');
      await fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department', error);
      toast('Failed to delete department', 'error');
    }
  };

  const canManage = role === 'admin' || role === 'superadmin';

  if (loading) {
    return (
      <div className="max-w-5xl flex items-center justify-center p-12">
        <p className="text-sm dark:text-zinc-500 text-gray-500">Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {canManage && (
        <form onSubmit={handleAddDepartment} className="dark:bg-[#0f0f0f] bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-end gap-4 shadow-sm">
          <div className="flex-1 w-full">
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2.5">Add New Department</label>
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="w-full dark:bg-zinc-900/80 bg-gray-50 border dark:border-white/[0.08] border-gray-200 rounded-xl px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              placeholder="e.g. Operations, Logistics, HR"
              required
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newDeptName.trim()}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:dark:bg-zinc-800 bg-gray-200 disabled:dark:text-zinc-500 text-gray-500 text-black px-8 py-3 rounded-xl font-bold uppercase tracking-wide transition-all text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>
      )}

      <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {departments.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full dark:bg-zinc-900 bg-gray-100 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 dark:text-zinc-700 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold dark:text-zinc-300 text-gray-700">No departments yet</h3>
            <p className="text-xs dark:text-zinc-500 text-gray-500 mt-1 max-w-xs">
              Add your first department above to start tracking localized carbon logs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 dark:bg-[#0a0a0a] bg-gray-50/80 backdrop-blur-md">
                <tr className="border-b dark:border-white/5 border-gray-200">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 whitespace-nowrap">Department Name</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 whitespace-nowrap">Department ID</th>
                  {canManage && <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 text-right whitespace-nowrap">Actions</th>}
                </tr>
              </thead>
              <tbody className="text-sm dark:text-zinc-300 text-gray-700">
                {departments.map((dept) => (
                  <tr key={dept._id} className="group border-b dark:border-white/5 border-gray-200 dark:hover:bg-white/[0.03] hover:bg-emerald-50/50 transition-colors">
                    <td className="px-6 py-4.5 font-medium dark:text-zinc-100 text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4.5 font-mono text-xs dark:text-zinc-500 text-gray-500">{dept._id}</td>
                    {canManage && (
                      <td className="px-6 py-4.5 text-right">
                        <button
                          onClick={() => handleDelete(dept._id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-xl hover:bg-red-500/10 inline-flex items-center opacity-70 hover:opacity-100"
                          title="Delete Department"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
