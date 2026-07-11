import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Leaf, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

/**
 * Register page — name, email, password, confirm password form.
 */
const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await registerUser(formData.name, formData.email, formData.password);
      navigate('/company-setup', { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User className="h-4 w-4" />}
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                maxLength: {
                  value: 50,
                  message: 'Name cannot exceed 50 characters',
                },
              })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email',
                },
              })}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              icon={<UserPlus className="h-5 w-5" />}
            >
              Create Account
            </Button>
          </form>

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
