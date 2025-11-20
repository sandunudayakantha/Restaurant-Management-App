import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { User } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {user && (
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}!</h2>
            <div className="space-y-2">
              <p>
                <span className="text-[#008170]">Email:</span> {user.email}
              </p>
              <p>
                <span className="text-[#008170]">Role:</span>{' '}
                <span className="capitalize">{user.role}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

