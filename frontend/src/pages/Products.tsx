import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  unit_type: z.enum(['kg', 'litre', 'piece', 'bottle', 'packet']),
  cost_per_unit: z.number().min(0, 'Cost must be positive'),
  current_volume: z.number().min(0, 'Volume cannot be negative'),
  reorder_level: z.number().min(0, 'Reorder level cannot be negative'),
  suppliers: z.array(z.string()).optional(),
  image_url: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  _id: string;
  name: string;
  unit_type: string;
  cost_per_unit: number;
  current_volume: number;
  reorder_level: number;
  suppliers: any[];
  image_url?: string;
}

interface Supplier {
  _id: string;
  name: string;
}

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      unit_type: 'kg',
      cost_per_unit: 0,
      current_volume: 0,
      reorder_level: 0,
      suppliers: [],
    },
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, [searchTerm, showLowStock]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (showLowStock) params.append('lowStock', 'true');

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error: any) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setError('');
      setSuccess('');

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        setSuccess('Product updated successfully!');
      } else {
        await api.post('/products', data);
        setSuccess('Product created successfully!');
      }

      reset();
      setShowModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('unit_type', product.unit_type as any);
    setValue('cost_per_unit', product.cost_per_unit);
    setValue('current_volume', product.current_volume);
    setValue('reorder_level', product.reorder_level);
    setValue('suppliers', product.suppliers.map((s: any) => s._id || s));
    setValue('image_url', product.image_url || '');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      setSuccess('Product deleted successfully!');
      fetchProducts();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    reset();
  };

  const isLowStock = (product: Product) => product.current_volume <= product.reorder_level;

  const isAdmin = user?.role === 'admin';

  return (
    <Layout>
      <div className="text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Products Management</h1>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-[#008170] hover:bg-[#005B41] transition-colors"
            >
              Add Product
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30">
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        )}

        <div className="bg-[#232D3F] rounded-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
            />
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="w-4 h-4 text-[#008170] bg-[#0F0F0F] border-[#005B41] rounded focus:ring-[#008170]"
              />
              <span>Show Low Stock Only</span>
            </label>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#005B41]">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Unit</th>
                    <th className="text-left py-3 px-4">Cost/Unit</th>
                    <th className="text-left py-3 px-4">Current Volume</th>
                    <th className="text-left py-3 px-4">Reorder Level</th>
                    <th className="text-left py-3 px-4">Status</th>
                    {isAdmin && <th className="text-left py-3 px-4">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-[#005B41] border-opacity-30">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4 capitalize">{product.unit_type}</td>
                      <td className="py-3 px-4">${product.cost_per_unit.toFixed(2)}</td>
                      <td className="py-3 px-4">{product.current_volume}</td>
                      <td className="py-3 px-4">{product.reorder_level}</td>
                      <td className="py-3 px-4">
                        {isLowStock(product) ? (
                          <span className="px-2 py-1 rounded bg-yellow-500 bg-opacity-20 text-yellow-400 text-sm">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-green-500 bg-opacity-20 text-green-400 text-sm">
                            In Stock
                          </span>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#232D3F] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#008170] mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-300">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#008170] mb-2">
                      Unit Type
                    </label>
                    <select
                      {...register('unit_type')}
                      className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="litre">Litre</option>
                      <option value="piece">Piece</option>
                      <option value="bottle">Bottle</option>
                      <option value="packet">Packet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#008170] mb-2">
                      Cost per Unit
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('cost_per_unit', { valueAsNumber: true })}
                      className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                    />
                    {errors.cost_per_unit && (
                      <p className="mt-1 text-sm text-red-300">
                        {errors.cost_per_unit.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#008170] mb-2">
                      Current Volume
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('current_volume', { valueAsNumber: true })}
                      className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                    />
                    {errors.current_volume && (
                      <p className="mt-1 text-sm text-red-300">
                        {errors.current_volume.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#008170] mb-2">
                      Reorder Level
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('reorder_level', { valueAsNumber: true })}
                      className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                    />
                    {errors.reorder_level && (
                      <p className="mt-1 text-sm text-red-300">
                        {errors.reorder_level.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#008170] mb-2">
                    Suppliers
                  </label>
                  <select
                    multiple
                    {...register('suppliers')}
                    className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                  >
                    {suppliers.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#008170] mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    {...register('image_url')}
                    className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#008170] hover:bg-[#005B41] transition-colors"
                  >
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;

