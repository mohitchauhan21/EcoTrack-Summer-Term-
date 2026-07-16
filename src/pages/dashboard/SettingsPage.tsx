import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { 
  BarChart3, Moon, Sun, Bell, BellRing, Shield, Globe, Monitor, 
  Save, RotateCcw, Palette, Eye, EyeOff, UserCog,
  Activity, Clock, Mail, Smartphone, Laptop, Tablet
} from "lucide-react";

type Theme = "dark" | "light" | "system";
type AccentColor = "emerald" | "blue" | "purple" | "cyan" | "rose";

const accentColors: { value: AccentColor; label: string; class: string }[] = [
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { value: "blue", label: "Ocean", class: "bg-blue-500" },
  { value: "purple", label: "Cosmic", class: "bg-purple-500" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { value: "rose", label: "Rose", class: "bg-rose-500" },
];

export default function SettingsPage() {
  const { role } = useAuth();
  const { toast } = useToast();
  
  const [theme, setTheme] = useState<Theme>("dark");
  const [accentColor, setAccentColor] = useState<AccentColor>("emerald");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [anomalyAlerts, setAnomalyAlerts] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving
    await new Promise(r => setTimeout(r, 800));
    localStorage.setItem("ecotrack_settings", JSON.stringify({
      theme, accentColor, emailNotifications, pushNotifications,
      weeklyReports, anomalyAlerts, compactView, showCharts
    }));
    toast("Settings saved successfully!", "success");
    setSaving(false);
  };

  const handleReset = () => {
    setTheme("dark");
    setAccentColor("emerald");
    setEmailNotifications(true);
    setPushNotifications(true);
    setWeeklyReports(true);
    setAnomalyAlerts(true);
    setCompactView(false);
    setShowCharts(true);
    toast("Settings reset to defaults", "info");
  };

  const isAdmin = role === "admin" || role === "superadmin";

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-light text-zinc-100 mb-2">Settings</h1>
        <p className="text-zinc-500 text-sm">Customize your EcoTrack experience.</p>
      </div>

      {/* Appearance */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3 bg-[#0a0a0a]">
          <Palette className="w-5 h-5 text-emerald-500" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Appearance</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3">Theme</label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "dark" as Theme, icon: Moon, label: "Dark" },
                { value: "light" as Theme, icon: Sun, label: "Light" },
                { value: "system" as Theme, icon: Monitor, label: "System" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    theme === t.value
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "bg-zinc-900/50 border border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3">Accent Color</label>
            <div className="flex flex-wrap gap-3">
              {accentColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setAccentColor(c.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    accentColor === c.value
                      ? "bg-zinc-800 border border-white/20 text-zinc-200"
                      : "bg-zinc-900/50 border border-white/5 text-zinc-500 hover:bg-zinc-800"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${c.class} ${accentColor === c.value ? 'ring-2 ring-white/30 ring-offset-1 ring-offset-[#0f0f0f]' : ''}`} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3">Display</label>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-zinc-900/30 border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-300">Compact View</span>
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${compactView ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                  onClick={() => setCompactView(!compactView)}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${compactView ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                </div>
              </label>
              <label className="flex items-center justify-between p-3 bg-zinc-900/30 border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-300">Show Charts</span>
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${showCharts ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                  onClick={() => setShowCharts(!showCharts)}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${showCharts ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3 bg-[#0a0a0a]">
          <Bell className="w-5 h-5 text-emerald-500" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { id: "emailNotifications", icon: Mail, label: "Email Notifications", desc: "Receive updates and alerts via email", checked: emailNotifications, set: setEmailNotifications },
            { id: "pushNotifications", icon: BellRing, label: "Push Notifications", desc: "Get real-time notifications in your browser", checked: pushNotifications, set: setPushNotifications },
            { id: "weeklyReports", icon: Activity, label: "Weekly Report Digest", desc: "Weekly summary of your emissions data", checked: weeklyReports, set: setWeeklyReports },
            { id: "anomalyAlerts", icon: Shield, label: "Anomaly Alerts", d
