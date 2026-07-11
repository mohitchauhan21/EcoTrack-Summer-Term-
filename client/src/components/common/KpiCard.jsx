import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Reusable KPI stat card with icon, value, label, and optional trend indicator.
 *
 * @param {React.ReactNode} icon - Display icon
 * @param {string} label - Stat label
 * @param {string|number} value - Main stat value
 * @param {number} trend - Percentage trend (positive = up, negative = down)
 * @param {string} trendLabel - Label for the trend
 * @param {string} iconBg - Background color class for icon container
 * @param {string} iconColor - Text color class for icon
 */
const KpiCard = ({ icon, label, value, trend, trendLabel, iconBg = 'bg-primary-100', iconColor = 'text-primary-600' }) => {
  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="h-3.5 w-3.5" />;
    if (trend < 0) return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-danger-500 bg-danger-50';
    if (trend < 0) return 'text-primary-600 bg-primary-50';
    return 'text-secondary-500 bg-secondary-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-secondary-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
        {trend !== undefined && trend !== null && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getTrendColor()}`}>
            {getTrendIcon()}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-secondary-900 mb-0.5">{value}</p>
      <p className="text-sm text-secondary-500">{label}</p>
      {trendLabel && (
        <p className="text-xs text-secondary-400 mt-1">{trendLabel}</p>
      )}
    </motion.div>
  );
};

export default KpiCard;
