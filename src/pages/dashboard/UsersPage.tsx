import React, { useEffect, useState } from 'react';
import { Plus, Trash2, UserCog } from 'lucide-react';
import { Select } from '../../components/ui/Select';
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

const getRoleRank = (r: string) => {
  switch (r) {
    case 'admin': return 1;
    case 'executive': return 2;
    case 'employee': return 3;
    default: return 99;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'executive': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
  }
};

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

  const canManage = role === 'admin';

  if (loading) {
    return <div className="dark:text-zinc-500 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-light dark:text-zinc-100 text-gray-900 mb-2">Users</h1>
        <p className="dark:text-zinc-500 text-gray-500 text-sm">
          Manage your organization's users and their roles.
        </p>
      </div>

      {canManage && (
        <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest dark:text-zinc-100 text-gray-900 mb-1">Add New User</h3>
            <p className="dark:text-zinc-500 text-gray-500 text-xs">Create a new member and assign their role and department.</p>
          </div>
          
          <form onSubmit={handleAddUser} className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full dark:bg-zinc-800 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full dark:bg-zinc-800 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Role</label>
                <Select
                  value={newUser.role}
                  onChange={(value) => setNewUser({ ...newUser, role: value })}
                  options={[
                    { value: 'employee', label: 'Employee' },
                    { value: 'executive', label: 'Executive' },
                    ...(role === 'admin' ? [
                      { value: 'admin', label: 'Admin' }
                    ] : [])
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Department</label>
                <Select
                  value={newUser.departmentId}
                  onChange={(value) => setNewUser({ ...newUser, departmentId: value })}
                  options={[
                    { value: '', label: 'None / Corporate' },
                    ...departments.map(d => ({ value: d._id, label: d.name }))
                  ]}
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t dark:border-white/[0.06] border-gray-100">
              <button
                type="submit"
                disabled={adding || !newUser.name || !newUser.email}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:dark:bg-zinc-800 bg-gray-200 disabled:dark:text-zinc-500 text-gray-500 text-black px-6 py-3.5 rounded-lg font-bold uppercase tracking-wide transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] disabled:shadow-none min-w-[160px]"
              >
                {adding ? (
                  "Adding User..."
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl overflow-hidden">
        {users.length === 0 ? (
          <div className="p-6 text-center dark:text-zinc-500 text-gray-500 text-sm">
            No users found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-white/[0.06] border-gray-200 dark:bg-zinc-800 bg-gray-50/80">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Name</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Email</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Role</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Department</th>
                {canManage && <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-sm dark:text-zinc-300 text-gray-700">
              {users.map((user) => {
                const isProtected = getRoleRank(role || '') >= getRoleRank(user.role);
                
                return (
                  <tr key={user._id} className="border-b dark:border-white/[0.06] border-gray-200 dark:hover:bg-white/[0.02] hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium dark:text-zinc-100 text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                        <UserCog className="w-4 h-4" />
                      </div>
                      {user.name}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-bold border ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        {isProtected && (
                          <span className="text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 flex items-center gap-1">
                            &bull; Protected
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 dark:text-zinc-400 text-gray-600">
                      {user.departmentId ? user.departmentId.name : 'Corporate'}
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            if (!isProtected) handleDelete(user._id);
                          }}
                          disabled={isProtected}
                          className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                            isProtected 
                              ? "text-gray-300 dark:text-zinc-700 cursor-not-allowed opacity-50" 
                              : "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          }`}
                          title={isProtected ? "Protected account. Insufficient permissions." : "Delete User"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
