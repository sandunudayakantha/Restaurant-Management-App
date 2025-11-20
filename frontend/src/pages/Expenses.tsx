import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Expenses = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-8">Expenses Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-2">Today</h3>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-2">This Week</h3>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-2">This Month</h3>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-2">Unpaid</h3>
            <p className="text-2xl font-bold text-yellow-400">$0.00</p>
          </div>
        </div>

        <div className="bg-[#232D3F] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Expenses</h2>
            {(user?.role === 'admin' || user?.role === 'cashier') && (
              <button className="px-4 py-2 rounded-lg bg-[#008170] hover:bg-[#005B41] transition-colors">
                Add Expense
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
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p>No expenses recorded</p>
            <p className="text-sm mt-2">Start tracking your expenses</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Expenses;

