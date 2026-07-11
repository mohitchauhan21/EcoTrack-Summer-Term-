import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Zap, Plane, Truck, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import apiClient from "../../api/axiosClient";

const getIcon = (type: string) => {
  switch (type) {
    case "Utilities": return <Zap className="w-4 h-4 text-yellow-500" />;
    case "Travel": return <Plane className="w-4 h-4 text-blue-500" />;
    case "Supply Chain": return <Truck className="w-4 h-4 text-purple-500" />;
    default: return <FileText className="w-4 h-4 text-zinc-500" />;
  }
};

export default function RecentActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch the most recent 5 logs
        const res = await apiClient.get('/logs?limit=5');
        setActivities(res.data.logs || []);
      } catch (error) {
        console.error("Error fetching recent activities", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0f0f0f] border border-white/5 p-5 rounded-2xl h-80 flex items-center justify-center">
        <div className="animate-pulse flex flex-col space-y-4 w-full px-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-2 bg-zinc-800 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f0f] border border-white/5 p-5 rounded-2xl flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Recent Activity</span>
        <Link to="/dashboard/logs" className="text-xs text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {activities.length === 0 ? (
          <div className="text-zinc-500 text-sm text-center py-8">No recent activity.</div>
        ) : (
          activities.map((log) => (
            <div key={log._id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-white/20 transition-colors">
                  {getIcon(log.activityType)}
                </div>
                <div className="w-px h-full bg-white/5 my-1 group-last:hidden"></div>
              </div>
              <div className="pb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-zinc-200">{log.activityType}</span>
                  <span className="text-xs text-emerald-400 font-bold">+{log.carbonEquivalent.toFixed(2)} tCO2e</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                  <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{log.departmentId?.name || "Unknown"}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
