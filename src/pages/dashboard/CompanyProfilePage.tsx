import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { COUNTRIES } from '../../constants/regions';
import { Building2, Users, Tags, FileSpreadsheet, Globe, Shield } from 'lucide-react';
import { Select } from '../../components/ui/Select';
import CompanyDepartmentsTab from '../../components/dashboard/CompanyDepartmentsTab';

interface OverviewStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export default function CompanyProfilePage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'departments'>('profile');
  const [formData, setFormData] = useState({ name: '', region: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Overview stats
  const [stats, setStats] = useState<{
    departments: number | null;
    users: number | null;
    logs: number | null;
    emissions: number | null;
  }>({ departments: null, users: null, logs: null, emissions: null });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await apiClient.get('/company');
        setFormData({ name: res.data.name || '', region: res.data.region || '' });
      } catch (error) {
        console.error('Failed to fetch company', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  // Fetch overview stats from existing endpoints
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [deptRes, userRes, summaryRes] = await Promise.allSettled([
          apiClient.get('/departments'),
          apiClient.get('/users'),
          apiClient.get('/analytics/summary'),
        ]);

        setStats({
          departments: deptRes.status === 'fulfilled' ? deptRes.value.data?.length ?? null : null,
          users: userRes.status === 'fulfilled' ? userRes.value.data?.length ?? null : null,
          logs: summaryRes.status === 'fulfilled' ? summaryRes.value.data?.logCount ?? null : null,
          emissions: summaryRes.status === 'fulfilled' ? summaryRes.value.data?.totalEmissions ?? null : null,
        });
      } catch {
        // silent — overview is non-critical
      }
    };
    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/company', formData);
      toast('Company profile updated successfully.', 'success');
    } catch (error) {
      toast('Failed to update company profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isEditable = role === 'admin' || role === 'superadmin';

  const overviewItems: OverviewStat[] = [
    {
      label: 'Total Users',
      value: stats.users !== null ? stats.users : '--',
      icon: <Users className="w-4 h-4 text-emerald-500" />,
    },
    {
      label: 'Departments',
      value: stats.departments !== null ? stats.departments : '--',
      icon: <Tags className="w-4 h-4 text-blue-500" />,
    },
    {
      label: 'Total Emissions',
      value: stats.emissions !== null ? `${stats.emissions.toLocaleString()} tCO₂e` : '--',
      icon: <Globe className="w-4 h-4 text-purple-500" />,
    },
    {
      label: 'Carbon Logs',
      value: stats.logs !== null ? stats.logs.toLocaleString() : '--',
      icon: <FileSpreadsheet className="w-4 h-4 text-amber-500" />,
    },
  ];

  // ── Loading skeleton ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 pb-12">
        <header className="mb-8">
          <div className="h-9 w-56 dark:bg-zinc-800/60 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-80 dark:bg-zinc-800/40 bg-gray-200 rounded mt-3 animate-pulse" />
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 h-64 animate-pulse" />
          <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  const inputClasses =
    'w-full dark:bg-zinc-900/80 bg-gray-50 border dark:border-white/[0.08] border-gray-200 rounded-2xl px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed';
  const labelClasses =
    'block text-[10px] uppercase tracking-[0.15em] font-semibold dark:text-zinc-500 text-gray-500 mb-2.5';

  return (
    <div className="flex-1 pb-12">
      {/* ── Page Header ────────────────────────────────────────── */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Building2 className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-light dark:text-zinc-50 text-gray-950 tracking-tight">Company Settings</h1>
        </div>
        <p className="dark:text-zinc-500 text-gray-500 text-sm ml-12 mb-8">
          Manage your organization's core details, departments, and geographical region.
        </p>

        {/* Custom Tabs */}
        <div className="ml-12 inline-flex dark:bg-zinc-900 bg-gray-100/50 p-1 rounded-2xl border dark:border-white/[0.06] border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-zinc-800 text-emerald-500 shadow-sm'
                : 'dark:text-zinc-400 text-gray-500 hover:text-gray-900 dark:hover:text-zinc-300'
            }`}
          >
            Company Profile
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'departments'
                ? 'bg-white dark:bg-zinc-800 text-emerald-500 shadow-sm'
                : 'dark:text-zinc-400 text-gray-500 hover:text-gray-900 dark:hover:text-zinc-300'
            }`}
          >
            Departments
          </button>
        </div>
      </header>

      <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'profile' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Section 1: Company Information (Form) ──────────── */}
        <form
          onSubmit={handleSubmit}
          className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 flex flex-col transition-all duration-300 hover:dark:border-white/[0.12] border-gray-200"
        >
          {/* Card header */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold dark:text-zinc-200 text-gray-800 tracking-tight">Company Information</h2>
            <p className="text-xs dark:text-zinc-500 text-gray-500 mt-1 leading-relaxed">
              These settings define your organization's basic profile and operating region.
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-5 flex-1">
            <div>
              <label className={labelClasses}>Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditable}
                className={inputClasses}
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  Country
                </span>
              </label>
              <Select
                value={formData.region}
                onChange={(value) => setFormData({ ...formData, region: value })}
                disabled={!isEditable}
                placeholder="Select Country"
                options={[
                  { value: '', label: 'Select Country', disabled: true },
                  ...COUNTRIES.map((country) => ({ value: country, label: country }))
                ]}
              />
            </div>
          </div>

          {/* Save button */}
          {isEditable && (
            <div className="pt-6 mt-4 border-t dark:border-white/[0.04] border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:dark:bg-zinc-800 bg-gray-200 disabled:dark:text-zinc-500 text-gray-500 text-black h-10 px-6 rounded-2xl font-bold uppercase tracking-wide transition-all text-sm w-full sm:w-auto hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-[0.98]"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>

        {/* ── Section 2: Company Overview (read-only) ────────── */}
        <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:dark:border-white/[0.12] border-gray-200 flex flex-col">
          {/* Card header */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold dark:text-zinc-200 text-gray-800 tracking-tight">Company Overview</h2>
            <p className="text-xs dark:text-zinc-500 text-gray-500 mt-1 leading-relaxed">
              A snapshot of your organization's current footprint.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            {overviewItems.map((item) => (
              <div
                key={item.label}
                className="dark:bg-zinc-900/40 bg-gray-50 border dark:border-white/[0.04] border-gray-100 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:dark:border-white/[0.1] border-gray-200 hover:dark:bg-zinc-900/60 bg-gray-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[10px] dark:text-zinc-500 text-gray-500 uppercase tracking-[0.12em] font-semibold">{item.label}</span>
                </div>
                <span className="text-2xl font-light dark:text-zinc-100 text-gray-900 tracking-tight">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
      ) : (
        <CompanyDepartmentsTab />
      )}
      </div>
    </div>
  );
}