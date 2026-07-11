import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { emailValidation, passwordValidation, nameValidation, confirmPasswordValidation } from '../../utils/validators';

const RegisterForm = () => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        icon={<User className="h-4 w-4" />}
        error={errors.name?.message}
        {...register('name', nameValidation)}
      />

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
          placeholder="Create a password"
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

      <Input
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Confirm your password"
        icon={<Lock className="h-4 w-4" />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', confirmPasswordValidation(password))}
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
  );
};

export default RegisterForm;
