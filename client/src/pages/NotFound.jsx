import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

/**
 * 404 Not Found page.
 */
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-warning-400/20 mb-6"
        >
          <AlertTriangle className="h-10 w-10 text-warning-500" />
        </motion.div>

        <h1 className="text-6xl font-extrabold text-secondary-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-secondary-700 mb-2">Page Not Found</h2>
        <p className="text-secondary-500 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <Link to="/">
          <Button variant="primary" size="lg" icon={<Home className="h-5 w-5" />}>
            Go Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
