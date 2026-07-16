import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Shield, Sparkles, Sliders } from 'lucide-react';

export default function CompanyProfilePage() {
  const { role, updateCompanyName } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    carbonTarget: 1000,
    reportingFrequency: 'monthly',
    anomalyThreshold: 50
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await apiClient.get('/company');
        setFormData({
          name: res.data.name || '',
          region: res.data.region || '',
          carbonTarget: res.data.carbonTarget !== undefined ? res.data.carbonTarget : 1000,
          reportingFrequency: res.data.reportingFrequency || 'monthly',
          anomalyThreshold: res.data.anomalyThreshold !== undefined ? res.data.anomalyThreshold : 50
        });
      } catch (error) {
        console.error('Failed to fetch company', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/company', formData);
      updateCompanyName(formData.name);
      toast('Company profile and settings updated successfully.', 'success');
    } catch (error) {
      toast('Failed to update company profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isEditable = role === 'admin' || role === 'superadmin';

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-zinc-100 mb-2">Company Configuration</h1>
        <p className="text-zinc-500 text-sm">
          Manage your organization's boundaries, compliance goals, and carbon analytics behavior.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-8 space-x-8">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-4 text-sm font-medium tracking-wide transition-all border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          General Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`pb-4 text-sm font-medium tracking-wide transition-all border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Sustainability Settings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 shadow-xl">
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditable}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Primary Operating Region</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                disabled={!isEditable}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50 cursor-pointer"
                required
              >
                <option value="" disabled>Select Region</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="Latin America">Latin America</option>
                <option value="Middle East & Africa">Middle East & Africa</option>
                <option value="Mumbai/India">Mumbai/India</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">
                  Annual Carbon Target (tCO2e)
                </label>
                <input
                  type="number"
                  value={formData.carbonTarget}
                  onChange={(e) => setFormData({ ...formData, carbonTarget: Number(e.target.value) })}
                  disabled={!isEditable}
                  min="0"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                  required
                />
                <p className="text-zinc-500 text-xs mt-1.5">Desired carbon cap target for your organization per year.</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">
                  Reporting Cycle
                </label>
                <select
                  value={formData.reportingFrequency}
                  onChange={(e) => setFormData({ ...formData, reportingFrequency: e.target.value })}
                  disabled={!isEditable}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50 cursor-pointer"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
                <p className="text-zinc-500 text-xs mt-1.5">Define your organizational sustainability reporting periods.</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">
                Anomaly Notification Threshold (%)
              </label>
              <input
                type="number"
                value={formData.anomalyThreshold}
                onChange={(e) => setFormData({ ...formData, anomalyThreshold: Number(e.target.value) })}
                disabled={!isEditable}
                min="1"
                max="1000"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                required
              />
              <p className="text-zinc-500 text-xs mt-1.5">Triggers warning system when an emission entry exceeds historical average by this percentage.</p>
            </div>
          </div>
        )}

        {isEditable && (
          <div className="pt-4 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wide transition-colors text-sm w-full sm:w-auto"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
