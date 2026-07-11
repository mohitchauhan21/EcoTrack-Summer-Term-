import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Search, Filter, Edit3, Trash2,
  ChevronLeft, ChevronRight, Loader2, X,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const ACTIVITY_TYPES = ['electricity', 'transport', 'waste', 'water', 'fuel', 'other'];
const ACTIVITY_COLORS = {
  electricity: 'bg-yellow-100 text-yellow-700',
  transport: 'bg-blue-100 text-blue-700',
  waste: 'bg-orange-100 text-orange-700',
  water: 'bg-cyan-100 text-cyan-700',
  fuel: 'bg-red-100 text-red-700',
  other: 'bg-gray-100 text-gray-700',
};

/**
 * Carbon Logs page — full CRUD with search, filters, pagination, and modal form.
 */
const CarbonLogs = () => {
  const [logs, setLogs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (filterType) params.append('activityType', filterType);
      if (filterDept) params.append('departmentId', filterDept);

      const { data } = await api.get(`/logs?${params}`);
      setLogs(data.data.logs);
      setTotalPages(data.data.totalPages);
      setTotal(data.data.total);
    } catch {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterType, filterDept]);

  // Fetch departments for dropdown
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const { data } = await api.get('/company/departments');
        setDepartments(data.data.departments);
      } catch {
        // silent
      }
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Open modal for add/edit
  const openAddModal = () => {
    setEditingLog(null);
    reset({
      date: new Date().toISOString().split('T')[0],
      departmentId: '',
      activityType: '',
      amount: '',
      unit: '',
      carbonEquivalent: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (log) => {
    setEditingLog(log);
    reset({
      date: new Date(log.date).toISOString().split('T')[0],
      departmentId: log.departmentId?._id || log.departmentId,
      activityType: log.activityType,
      amount: log.amount,
      unit: log.unit,
      carbonEquivalent: log.carbonEquivalent,
    });
    setModalOpen(true);
  };

  // Save log
  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingLog) {
        await api.put(`/logs/${editingLog._id}`, formData);
        toast.success('Log updated');
      } else {
        await api.post('/logs', formData);
        toast.success('Log created');
      }
      setModalOpen(false);
      fetchLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save log');
    } finally {
      setSaving(false);
    }
  };

  // Delete log
  const handleDelete = async (id) => {
    try {
      await api.delete(`/logs/${id}`);
      toast.success('Log deleted');
      setDeleteConfirm(null);
      fetchLogs();
    } catch {
      toast.error('Failed to delete log');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary-600" />
            Carbon Logs
          </h1>
          <p className="text-secondary-500 mt-1">{total} total records</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={openAddModal}>
          Add Log
        </Button>
      </div>

      {/* Filters */}
      <Card noPadding>
        <div className="flex flex-col sm:flex-row gap-3 p-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          {/* Activity Type */}
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="px-3 py-2.5 text-sm rounded-lg border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white capitalize"
          >
            <option value="">All Activities</option>
            {ACTIVITY_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>
          {/* Department */}
          <select
            value={filterDept}
            onChange={(e) => { setFilterDept(e.target.value); setPage(1); }}
            className="px-3 py-2.5 text-sm rounded-lg border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card noPadding>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">No carbon logs found.</p>
            <p className="text-secondary-400 text-sm mt-1">Add your first log to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-secondary-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary-600">Activity</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary-600">Department</th>
                  <th className="text-right px-4 py-3 font-semibold text-secondary-600">Amount</th>
                  <th className="text-right px-4 py-3 font-semibold text-secondary-600">CO₂e (kg)</th>
                  <th className="text-right px-4 py-3 font-semibold text-secondary-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <motion.tr
                    key={log._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-secondary-100 hover:bg-secondary-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-secondary-700">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ACTIVITY_COLORS[log.activityType] || ACTIVITY_COLORS.other}`}>
                        {log.activityType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary-700">
                      {log.departmentId?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-700">
                      {log.amount} {log.unit}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-secondary-900">
                      {log.carbonEquivalent.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(log)}
                          className="p-1.5 rounded-lg text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(log._id)}
                          className="p-1.5 rounded-lg text-secondary-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-100">
            <p className="text-sm text-secondary-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Prev
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                icon={<ChevronRight className="h-4 w-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingLog ? 'Edit Carbon Log' : 'Add Carbon Log'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              error={errors.date?.message}
              {...register('date', { required: 'Date is required' })}
            />
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Department</label>
              <select
                {...register('departmentId', { required: 'Department is required' })}
                className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
              {errors.departmentId && <p className="mt-1.5 text-sm text-danger-500">{errors.departmentId.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">Activity Type</label>
            <select
              {...register('activityType', { required: 'Activity type is required' })}
              className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 capitalize"
            >
              <option value="">Select activity</option>
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">{t}</option>
              ))}
            </select>
            {errors.activityType && <p className="mt-1.5 text-sm text-danger-500">{errors.activityType.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Amount"
              type="number"
              step="any"
              placeholder="0"
              error={errors.amount?.message}
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0, message: 'Must be positive' },
              })}
            />
            <Input
              label="Unit"
              type="text"
              placeholder="kWh, liters, kg..."
              error={errors.unit?.message}
              {...register('unit', { required: 'Unit is required' })}
            />
            <Input
              label="CO₂ Equivalent (kg)"
              type="number"
              step="any"
              placeholder="0"
              error={errors.carbonEquivalent?.message}
              {...register('carbonEquivalent', {
                required: 'CO₂e is required',
                min: { value: 0, message: 'Must be positive' },
              })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={saving}>
              {editingLog ? 'Update Log' : 'Add Log'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Carbon Log"
        size="sm"
      >
        <p className="text-secondary-600 mb-4">
          Are you sure you want to delete this log? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>
            Delete
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default CarbonLogs;
