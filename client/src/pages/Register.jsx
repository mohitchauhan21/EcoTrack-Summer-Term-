import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

/**
 * Register page — placeholder.
 */
const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-100 mb-4">
          <UserPlus className="h-7 w-7 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">Register</h1>
        <p className="text-secondary-500">This page is under development.</p>
      </motion.div>
    </div>
  );
};

export default Register;
