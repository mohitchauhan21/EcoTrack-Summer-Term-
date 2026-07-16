import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import apiClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface Department {
  _id: string;
  name: string;
  companyId: string;
}

export default function DepartmentsPage() {
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
    if (!window.confirm('Are you sure you want to deactivate this department?')) return;
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
    return <div className="dark:text-zinc-500 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-light dark:text-zinc-100 text-gray-900 mb-2">Departments</h1>
      <p className="dark:text-zinc-500 text-gray-500 text-sm mb-8">
        View and manage organizational departments.
      </p>

      {canManage && (
        <form onSubmit={handleAddDepartment} className="dark:bg-[#0f0f0f] bg-white border dark:border-white/5 border-gray-200 rounded-2xl p-6 mb-8 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">New Department Name</label>
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="w-full dark:bg-zinc-900 bg-gray-50 border dark:border-white/10 border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder="e.g. Operations, Logistics, HR"
              required
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newDeptName.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:dark:bg-zinc-800 bg-gray-200 disabled:dark:text-zinc-500 text-gray-500 text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wide transition-colors text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>
      )}

      <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/5 border-gray-200 rounded-2xl overflow-hidden">
        {departments.length === 0 ? (
          <div className="p-8 text-center dark:text-zinc-500 text-gray-500 text-sm">
            No departments found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-white/5 border-gray-200 dark:bg-[#0a0a0a] bg-gray-50/80">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Department Name</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">ID</th>
                {canManage && <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-sm dark:text-zinc-300 text-gray-700">
              {departments.map((dept) => (
                <tr key={dept._id} className="border-b dark:border-white/5 border-gray-200 dark:hover:bg-white/[0.02] hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium dark:text-zinc-100 text-gray-900">{dept.name}</td>
                  <td className="px-6 py-4 font-mono text-xs dark:text-zinc-500 text-gray-500">{dept._id}</td>
                  {canManage && (
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(dept._id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10 inline-flex items-center"
                        title="Delete Department"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
