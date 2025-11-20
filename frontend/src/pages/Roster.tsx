import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Roster = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-8">Roster Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-2">This Week</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-400 mt-1">Shifts Scheduled</p>
          </div>
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-2">Upcoming</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-400 mt-1">Shifts This Week</p>
          </div>
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-2">Total Hours</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-400 mt-1">This Month</p>
          </div>
        </div>

        <div className="bg-[#232D3F] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Schedule</h2>
            {user?.role === 'admin' && (
              <button className="px-4 py-2 rounded-lg bg-[#008170] hover:bg-[#005B41] transition-colors">
                Create Shift
              </button>
            )}
          </div>
          <div className="text-center py-12 text-gray-400">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>No shifts scheduled</p>
            <p className="text-sm mt-2">
              {user?.role === 'admin'
                ? 'Create shifts to manage your team schedule'
                : 'Your upcoming shifts will appear here'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Roster;

