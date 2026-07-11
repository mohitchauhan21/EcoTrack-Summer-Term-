import React, { useState, useEffect } from 'react';
import { Save, Bell, Moon, Sun, Monitor } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    emailNotifications: true,
    weeklyReports: false,
    anomalyAlerts: true,
  });

  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem('ecotrack_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate network delay
    setTimeout(() => {
      localStorage.setItem('ecotrack_settings', JSON.stringify(settings));
      setSaving(false);
      toast('Settings saved successfully.', 'success');
    }, 500);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-light text-zinc-100 mb-2">Settings</h1>
        <p className="text-zinc-500 text-sm">
          Manage your personal preferences and application settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Appearance Settings */}
        <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-medium text-zinc-200">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-900 border border-white/5 rounded-xl">
              <div>
                <p className="text-zinc-200 font-medium text-sm">Theme Preference</p>
                <p className="text-zinc-500 text-xs mt-1">Select your preferred color interface.</p>
              </div>
              <div className="flex bg-black border border-white/10 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${settings.theme === 'light' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Sun className="w-3 h-3" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${settings.theme === 'dark' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Moon className="w-3 h-3" /> Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-medium text-zinc-200">Notifications</h2>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-zinc-900 border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <div>
                <p className="text-zinc-200 font-medium text-sm">Email Notifications</p>
                <p className="text-zinc-500 text-xs mt-1">Receive alerts when significant emissions are logged.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 bg-black border-white/10 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-zinc-900 border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <div>
                <p className="text-zinc-200 font-medium text-sm">Weekly Reports</p>
                <p className="text-zinc-500 text-xs mt-1">Get an automated CSV report of your department's logs every Monday.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyReports}
                onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 bg-black border-white/10 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-zinc-900 border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <div>
                <p className="text-zinc-200 font-medium text-sm">Anomaly Alerts</p>
                <p className="text-zinc-500 text-xs mt-1">Notify me when an entry is 50% higher than average.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.anomalyAlerts}
                onChange={(e) => setSettings({ ...settings, anomalyAlerts: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 bg-black border-white/10 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wide transition-colors text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
