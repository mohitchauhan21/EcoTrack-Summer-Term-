import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Download, Loader2, Shield } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

/**
 * Profile page — view/edit profile, change password, export data.
 */
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [exporting, setExporting] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassword = watch('newPassword');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        const u = data.data.user;
        resetProfile({ name: u.name, email: u.email });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [resetProfile]);

  const onProfileSubmit = async (formData) => {
    setSavingProfile(true);
    try {
      const { data } = await api.put('/profile', formData);
      updateUser(data.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (formData) => {
    setChangingPassword(true);
    try {
      await api.put('/profile/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await api.get('/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EcoTrack_Report_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    } catch (error) {
      const message = error.response?.status === 404
        ? 'No logs to export'
        : 'Export failed';
      toast.error(message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
          <User className="h-7 w-7 text-primary-600" />
          Profile
        </h1>
        <p className="text-secondary-500 mt-1">Manage your account settings</p>
      </div>

      {/* User Avatar */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">{user?.name}</h2>
            <p className="text-sm text-secondary-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </Card>

      {/* Edit Profile */}
      <Card title="Edit Profile">
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            icon={<User className="h-4 w-4" />}
            error={profileErrors.name?.message}
            {...registerProfile('name', { required: 'Name is required' })}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="h-4 w-4" />}
            error={profileErrors.email?.message}
            {...registerProfile('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Please enter a valid email',
              },
            })}
          />
          <div className="pt-2">
            <Button type="submit" variant="primary" isLoading={savingProfile}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password */}
      <Card title="Change Password">
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            icon={<Lock className="h-4 w-4" />}
            error={passwordErrors.currentPassword?.message}
            {...registerPassword('currentPassword', { required: 'Current password is required' })}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            icon={<Shield className="h-4 w-4" />}
            error={passwordErrors.newPassword?.message}
            {...registerPassword('newPassword', {
              required: 'New password is required',
              minLength: { value: 6, message: 'Must be at least 6 characters' },
            })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            icon={<Shield className="h-4 w-4" />}
            error={passwordErrors.confirmNewPassword?.message}
            {...registerPassword('confirmNewPassword', {
              required: 'Please confirm new password',
              validate: (value) => value === newPassword || 'Passwords do not match',
            })}
          />
          <div className="pt-2">
            <Button type="submit" variant="primary" isLoading={changingPassword}>
              Change Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Export Report */}
      <Card title="Export Data">
        <p className="text-sm text-secondary-600 mb-4">
          Download all your carbon logs as an Excel spreadsheet.
        </p>
        <Button
          variant="outline"
          onClick={handleExport}
          isLoading={exporting}
          icon={<Download className="h-4 w-4" />}
        >
          Download Excel Report
        </Button>
      </Card>
    </motion.div>
  );
};

export default Profile;
