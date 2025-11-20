import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Reports = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-8">Monthly Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-4">Current Month Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Income:</span>
                <span className="font-semibold text-green-400">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Expenses:</span>
                <span className="font-semibold text-red-400">$0.00</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#005B41]">
                <span className="text-gray-300 font-semibold">Net Profit:</span>
                <span className="font-bold text-xl">$0.00</span>
              </div>
            </div>
          </div>

          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-4">Expense Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Cost of Sales:</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cost of Operations:</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Payroll:</span>
                <span className="font-semibold">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#232D3F] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Monthly Reports</h2>
            {user?.role === 'admin' && (
              <button className="px-4 py-2 rounded-lg bg-[#008170] hover:bg-[#005B41] transition-colors">
                Create New Report
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
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>No monthly reports available</p>
            <p className="text-sm mt-2">Create a monthly report to view financial summaries</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;

