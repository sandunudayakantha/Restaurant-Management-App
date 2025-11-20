import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
  }),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface Supplier {
  _id: string;
  name: string;
  contact: {
    phone?: string;
    email?: string;
  };
  address?: string;
  notes?: string;
}

const Suppliers = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      contact: {
        phone: '',
        email: '',
      },
    },
  });

  useEffect(() => {
    fetchSuppliers();
  }, [searchTerm]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/suppliers?${params.toString()}`);
      setSuppliers(response.data);
    } catch (error: any) {
      setError('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SupplierFormData) => {
    try {
      setError('');
      setSuccess('');

      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier._id}`, data);
        setSuccess('Supplier updated successfully!');
      } else {
        await api.post('/suppliers', data);
        setSuccess('Supplier created successfully!');
      }

      reset();
      setShowModal(false);
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to save supplier');
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setValue('name', supplier.name);
    setValue('contact.phone', supplier.contact?.phone || '');
    setValue('contact.email', supplier.contact?.email || '');
    setValue('address', supplier.address || '');
    setValue('notes', supplier.notes || '');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      await api.delete(`/suppliers/${id}`);
      setSuccess('Supplier deleted successfully!');
      fetchSuppliers();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete supplier');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
    reset();
  };

  const isAdmin = user?.role === 'admin';

  return (
    <Layout>
      <div className="text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Suppliers Management</h1>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-[#008170] hover:bg-[#005B41] transition-colors"
            >
              Add Supplier
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
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No suppliers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map((supplier) => (
                <div
                  key={supplier._id}
                  className="bg-[#0F0F0F] rounded-lg p-4 border border-[#005B41] border-opacity-30"
                >
                  <h3 className="text-lg font-semibold mb-2">{supplier.name}</h3>
                  {supplier.contact?.phone && (
                    <p className="text-sm text-gray-300 mb-1">
                      📞 {supplier.contact.phone}
                    </p>
                  )}
                  {supplier.contact?.email && (
                    <p className="text-sm text-gray-300 mb-1">
                      ✉️ {supplier.contact.email}
                    </p>
                  )}
                  {supplier.address && (
                    <p className="text-sm text-gray-300 mb-1">📍 {supplier.address}</p>
                  )}
                  {supplier.notes && (
                    <p className="text-sm text-gray-400 mt-2 italic">{supplier.notes}</p>
                  )}
                  {isAdmin && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="flex-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(supplier._id)}
                        className="flex-1 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#232D3F] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#008170] mb-2">
                    Supplier Name
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
                      Phone
                    </label>
                    <input
                      type="tel"
                      {...register('contact.phone')}
                      className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#008170] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('contact.email')}
                      className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                    />
                    {errors.contact?.email && (
                      <p className="mt-1 text-sm text-red-300">
                        {errors.contact.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#008170] mb-2">
                    Address
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#005B41] text-white focus:outline-none focus:ring-2 focus:ring-[#008170]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#008170] mb-2">
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
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
                    {editingSupplier ? 'Update' : 'Create'}
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

export default Suppliers;

