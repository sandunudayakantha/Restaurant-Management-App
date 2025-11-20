import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import Layout from '../components/Layout';
import { User, UserRole } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const restaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  default_currency: z.string().min(1, 'Currency is required'),
});

type PasswordFormData = z.infer<typeof passwordSchema>;
type RestaurantFormData = z.infer<typeof restaurantSchema>;

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [restaurantError, setRestaurantError] = useState('');
  const [restaurantSuccess, setRestaurantSuccess] = useState('');
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [restaurantData, setRestaurantData] = useState<any>(null);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const {
    register: registerRestaurant,
    handleSubmit: handleRestaurantSubmit,
    formState: { errors: restaurantErrors },
    setValue: setRestaurantValue,
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userResponse, restaurantResponse] = await Promise.all([
          axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/restaurant`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userResponse.data.user);
        setRestaurantData(restaurantResponse.data);
        
        // Set form values
        if (restaurantResponse.data) {
          setRestaurantValue('name', restaurantResponse.data.name || '');
          setRestaurantValue('address', restaurantResponse.data.address || '');
          setRestaurantValue('phone', restaurantResponse.data.contact?.phone || '');
          setRestaurantValue('email', restaurantResponse.data.contact?.email || '');
          setRestaurantValue('default_currency', restaurantResponse.data.default_currency || 'USD');
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, setRestaurantValue]);

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setPasswordError('');
      setPasswordSuccess('');

      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${API_URL}/auth/change-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordSuccess('Password changed successfully!');
      resetPassword();
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.error || 'Failed to change password'
      );
    }
  };

  const onRestaurantSubmit = async (data: RestaurantFormData) => {
    try {
      setRestaurantError('');
      setRestaurantSuccess('');
      setRestaurantLoading(true);

      const token = localStorage.getItem('accessToken');
      await axios.put(
        `${API_URL}/restaurant`,
        {
          name: data.name,
          address: data.address,
          contact: {
            phone: data.phone || '',
            email: data.email || '',
          },
          default_currency: data.default_currency,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRestaurantSuccess('Restaurant details updated successfully!');
    } catch (error: any) {
      setRestaurantError(
        error.response?.data?.error || 'Failed to update restaurant details'
      );
    } finally {
      setRestaurantLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <Layout user={user}>
      <div className="text-white max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Logout Section - All Users */}
        <div className="bg-[#232D3F] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Change Password Section - All Users */}
        <div className="bg-[#232D3F] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          {passwordError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30">
              <p className="text-red-200 text-sm">{passwordError}</p>
            </div>
          )}
          {passwordSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30">
              <p className="text-green-200 text-sm">{passwordSuccess}</p>
            </div>
          )}
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#008170] mb-2">
                Current Password
              </label>
              <input
                type="password"
                {...registerPassword('currentPassword')}
                className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
              />
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-300">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#008170] mb-2">
                New Password
              </label>
              <input
                type="password"
                {...registerPassword('newPassword')}
                className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-300">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#008170] mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                {...registerPassword('confirmPassword')}
                className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-300">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#008170] hover:bg-[#005B41] transition-colors"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Restaurant Details Section - Admin Only */}
        {isAdmin && (
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Restaurant Details</h2>
            {restaurantError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30">
                <p className="text-red-200 text-sm">{restaurantError}</p>
              </div>
            )}
            {restaurantSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30">
                <p className="text-green-200 text-sm">{restaurantSuccess}</p>
              </div>
            )}
            <form onSubmit={handleRestaurantSubmit(onRestaurantSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#008170] mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  {...registerRestaurant('name')}
                  className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                />
                {restaurantErrors.name && (
                  <p className="mt-1 text-sm text-red-300">
                    {restaurantErrors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#008170] mb-2">
                  Address
                </label>
                <textarea
                  {...registerRestaurant('address')}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                />
                {restaurantErrors.address && (
                  <p className="mt-1 text-sm text-red-300">
                    {restaurantErrors.address.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#008170] mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    {...registerRestaurant('phone')}
                    className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#008170] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    {...registerRestaurant('email')}
                    className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                  />
                  {restaurantErrors.email && (
                    <p className="mt-1 text-sm text-red-300">
                      {restaurantErrors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#008170] mb-2">
                  Default Currency
                </label>
                <select
                  {...registerRestaurant('default_currency')}
                  className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="LKR">LKR</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={restaurantLoading}
                className="px-6 py-2 rounded-lg bg-[#008170] hover:bg-[#005B41] transition-colors disabled:opacity-50"
              >
                {restaurantLoading ? 'Updating...' : 'Update Restaurant Details'}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Settings;

