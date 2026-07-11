import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';

/**
 * Register page — renders the layout and the RegisterForm component.
 */
const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-darker px-4 py-12 relative overflow-hidden">
      {/* Floating background elements for depth */}
      <div className="absolute top-10 left-20 w-64 h-64 bg-primary-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-accent-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-primary-500 pr-2">
            <motion.div
              whileHover={{ rotate: [0, -10, 15, 0], scale: 1.1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="bg-gradient-to-br from-primary-400 to-accent-600 p-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-shadow duration-300"
            >
              <Leaf className="h-7 w-7 text-white" />
            </motion.div>
            <span className="text-3xl font-extrabold text-secondary-900 tracking-tight">
              Eco<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Track</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-secondary-900 mb-1 tracking-tight">Create your account</h1>
          <p className="text-secondary-500">Start tracking your carbon emissions today</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8">
          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
