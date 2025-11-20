import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Inventory = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-2">Total Products</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-2">Low Stock Items</h3>
            <p className="text-3xl font-bold text-yellow-400">0</p>
          </div>
          <div className="bg-[#232D3F] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#008170] mb-2">Out of Stock</h3>
            <p className="text-3xl font-bold text-red-400">0</p>
          </div>
        </div>

        <div className="bg-[#232D3F] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            {(user?.role === 'admin' || user?.role === 'chef') && (
              <button className="px-4 py-2 rounded-lg bg-[#008170] hover:bg-[#005B41] transition-colors">
                Add Product
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <p>No products found</p>
            <p className="text-sm mt-2">Add your first product to get started</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;

