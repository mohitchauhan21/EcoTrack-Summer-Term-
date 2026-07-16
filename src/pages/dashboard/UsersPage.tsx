import React, { useEffect, useState } from 'react';
import { Plus, Trash2, UserCog } from 'lucide-react';
import apiClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  departmentId?: { _id: string; name: string };
}

interface Department {
  _id: string;
  name: string;
}

export default function UsersPage() {
  const { role } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string>('');
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee',
    departmentId: ''
  });
  const [adding, setAdding] = useState(false);

  const fetchCompanyId = async () => {
    try {
      const res = await apiClient.get('/company');
      setCompanyId(res.data._id);
    } catch (error) {
      console.error('Failed to fetch company', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await apiClient.get('/departments');
      setDepartments(res.data);
    } catch (error) {
      console.error('Failed to fetch departments', error);
    }
  };

  const fetchUsers = async (cId: string) => {
    try {
      const res = await apiClient.get(`/users?companyId=${cId}`);
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyId();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchUsers(companyId);
    }
  }, [companyId]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;
    setAdding(true);
    try {
      await apiClient.post('/users', { ...newUser, companyId });
      toast('User added successfully', 'success');
      setNewUser({ name: '', email: '', role: 'employee', departmentId: '' });
      await fetchUsers(companyId);
    } catch (error: any) {
      console.error('Failed to add user', error);
      toast(error.response?.data?.message || 'Failed to add user', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await apiClient.delete(`/users/${id}`);
      toast('User removed', 'success');
      await fetchUsers(companyId);
    } catch (error) {
      console.error('Failed to delete user', error);
      toast('Failed to delete user', 'error');
    }
  };

  const canManage = role === 'admin' || role === 'superadmin';

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-light text-zinc-100 mb-2">Users</h1>
        <p className="text-zinc-500 text-sm">
          Manage your organization's users and their roles.
        </p>
      </div>

      {canManage && (
        <form onSubmit={handleAddUser} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Name</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
            >
              <option value="employee">Employee</option>
              <option value="executive">Executive</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Department</label>
            <select
              value={newUser.departmentId}
              onChange={(e) => setNewUser({ ...newUser, departmentId: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
            >
              <option value="">None / Corporate</option>
              {departments.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={adding || !newUser.name || !newUser.email}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black px-4 py-3 rounded-lg font-bold uppercase tracking-wide transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </form>
      )}

      <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No users found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Name</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Email</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Role</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Department</th>
                {canManage && <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-sm text-zinc-300">
              {users.map((user) => (
                <tr key={user._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                      <UserCog className="w-4 h-4" />
                    </div>
                    {user.name}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-white/5 border border-white/10">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {user.departmentId ? user.departmentId.name : 'Corporate'}
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10 inline-flex items-center"
                        title="Delete User"
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
