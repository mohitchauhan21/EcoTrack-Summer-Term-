import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Plus, Trash2, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

/**
 * Company Setup page — manage company profile and departments.
 */
const CompanySetup = () => {
  const { user, loadUser } = useAuth();
  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newDept, setNewDept] = useState('');
  const [addingDept, setAddingDept] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load company and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, deptRes] = await Promise.all([
          api.get('/company'),
          api.get('/company/departments'),
        ]);
        const comp = companyRes.data.data.company;
        setCompany(comp);
        setDepartments(deptRes.data.data.departments);
        if (comp) {
          reset({ name: comp.name, region: comp.region });
        }
      } catch {
        toast.error('Failed to load company data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  // Save company
  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      if (company) {
        const { data } = await api.put('/company', formData);
        setCompany(data.data.company);
        toast.success('Company updated successfully');
      } else {
        const { data } = await api.post('/company', formData);
        setCompany(data.data.company);
        toast.success('Company created successfully');
        await loadUser();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  // Add department
  const handleAddDept = async () => {
    if (!newDept.trim()) return;
    setAddingDept(true);
    try {
      const { data } = await api.post('/company/departments', { name: newDept.trim() });
      setDepartments((prev) => [...prev, data.data.department]);
      setNewDept('');
      toast.success('Department added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add department');
    } finally {
      setAddingDept(false);
    }
  };

  // Delete department
  const handleDeleteDept = async (id) => {
    try {
      await api.delete(`/company/departments/${id}`);
      setDepartments((prev) => prev.filter((d) => d._id !== id));
      toast.success('Department removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete department');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
          <Building2 className="h-7 w-7 text-primary-600" />
          Company Setup
        </h1>
        <p className="text-secondary-500 mt-1">
          {company ? 'Manage your company profile and departments' : 'Set up your company to get started'}
        </p>
      </div>

      {/* Company Profile Form */}
      <Card title="Company Profile">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Company Name"
            placeholder="Acme Corp"
            icon={<Building2 className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name', { required: 'Company name is required' })}
          />
          <Input
            label="Region"
            placeholder="North America"
            icon={<MapPin className="h-4 w-4" />}
            error={errors.region?.message}
            {...register('region', { required: 'Region is required' })}
          />
          <div className="pt-2">
            <Button type="submit" variant="primary" isLoading={saving}>
              {company ? 'Update Company' : 'Create Company'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Departments — only show if company exists */}
      {company && (
        <Card title="Departments">
          {/* Add Department */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                placeholder="Department name..."
                className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2.5 text-sm text-secondary-900 placeholder:text-secondary-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-secondary-400"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDept())}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleAddDept}
              isLoading={addingDept}
              icon={<Plus className="h-4 w-4" />}
            >
              Add
            </Button>
          </div>

          {/* Department List */}
          {departments.length === 0 ? (
            <p className="text-sm text-secondary-400 py-4 text-center">
              No departments yet. Add your first department above.
            </p>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {departments.map((dept) => (
                  <motion.div
                    key={dept._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between px-4 py-3 bg-secondary-50 rounded-lg border border-secondary-100"
                  >
                    <span className="text-sm font-medium text-secondary-700">{dept.name}</span>
                    <button
                      onClick={() => handleDeleteDept(dept._id)}
                      className="p-1.5 rounded-lg text-secondary-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                      title="Delete department"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Card>
      )}
    </motion.div>
  );
};

export default CompanySetup;
