import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
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

