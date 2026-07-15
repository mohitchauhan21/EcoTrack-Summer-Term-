import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { COUNTRIES } from '../../constants/regions';

export default function CompanyProfilePage() {
  const { role } = useAuth();
  const [formData, setFormData] = useState({ name: '', region: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

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

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-light text-zinc-100 mb-2">Company Profile</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Manage your organization's core details and geographical region.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
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
          <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Country</label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            disabled={!isEditable}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50 cursor-pointer"
            required
          >
            <option value="" disabled>Select Country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {isEditable && (
          <div className="pt-4">
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