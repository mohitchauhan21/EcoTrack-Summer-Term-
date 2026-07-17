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
    default: return <FileText className="w-4 h-4 dark:text-zinc-500 text-gray-500" />;
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
      <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/[0.06] border-gray-200 p-6 rounded-2xl h-80 flex items-center justify-center">
        <div className="animate-pulse flex flex-col space-y-5 w-full px-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-9 h-9 rounded-full dark:bg-zinc-800/60 bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 dark:bg-zinc-800/60 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-2 dark:bg-zinc-800/40 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/[0.06] border-gray-200 p-6 rounded-2xl flex flex-col h-full transition-all duration-300 hover:dark:border-white/[0.12] border-gray-200">
      <div className="flex justify-between items-center mb-5">
        <span className="text-[10px] dark:text-zinc-500 text-gray-500 uppercase tracking-[0.15em] font-semibold">Recent Activity</span>
        <Link to="/dashboard/logs" className="text-xs text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1.5 transition-colors">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-1">
        {activities.length === 0 ? (
          <div className="dark:text-zinc-500 text-gray-500 text-sm text-center py-8">No recent activity.</div>
        ) : (
          activities.map((log) => (
            <div key={log._id} className="group flex gap-3.5 p-2.5 -mx-2 rounded-xl transition-colors dark:hover:bg-white/[0.03] hover:bg-gray-50">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full dark:bg-zinc-900/80 bg-gray-50 border dark:border-white/[0.06] border-gray-200 flex items-center justify-center shrink-0 group-hover:dark:border-white/[0.15] border-gray-300 transition-colors">
                  {getIcon(log.activityType)}
                </div>
                <div className="w-px flex-1 bg-white/[0.04] my-1.5 group-last:hidden"></div>
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-medium dark:text-zinc-200 text-gray-800">{log.activityType}</span>
                  <span className="text-xs text-emerald-400/90 font-semibold">
                    +{typeof log.carbonEquivalent === 'number' && !isNaN(log.carbonEquivalent) ? log.carbonEquivalent.toFixed(2) : '0.00'} tCO₂e
                  </span>
                </div>
                <div className="text-[11px] dark:text-zinc-500 text-gray-500 mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="bg-white/[0.04] px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold tracking-wider dark:text-zinc-400 text-gray-600">
                    {log.departmentId?.name || "Unknown"}
                  </span>
                  <span className="dark:text-zinc-600 text-gray-400">•</span>
                  <span className="dark:text-zinc-500 text-gray-500">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
