import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { emailValidation, passwordValidation } from '../../utils/validators';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email Address"
        type="email"
        placeholder="you@company.com"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register('email', emailValidation)}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register('password', passwordValidation)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-secondary-400 hover:text-secondary-600 transition-colors"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm text-secondary-600">
          <input
            type="checkbox"
            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            {...register('rememberMe')}
          />
          <span>Remember me</span>
        </label>
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        icon={<LogIn className="h-5 w-5" />}
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
