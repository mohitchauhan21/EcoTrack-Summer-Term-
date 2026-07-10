import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

/**
 * Landing page — public entry point.
 */
const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-400/10 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-lg"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-6"
        >
          <Leaf className="h-8 w-8 text-primary-600" />
        </motion.div>

        <h1 className="text-4xl font-bold text-secondary-900 mb-3">
          Eco<span className="text-primary-600">Track</span>
        </h1>

        <p className="text-secondary-500 mb-8">This page is under development.</p>

        <Link to="/dashboard">
          <Button variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
            Go to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Landing;
