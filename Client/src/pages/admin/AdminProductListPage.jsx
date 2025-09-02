import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
// ====================================================================
// Component 1: Upgraded Product Form Modal
// ====================================================================
const ProductFormModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    discountPercentage: '',
    description: '',
    imageUrl: '',
    category: '',
    countInStock: '',
    sku: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        basePrice: product.basePrice || '',
        discountPercentage: product.discountPercentage || 0,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        category: product.category || '',
        countInStock: product.countInStock || '',
        sku: product.sku || '',
      });
    } else {
      setFormData({
        name: '', basePrice: '', discountPercentage: '', description: '',
        imageUrl: '', category: '', countInStock: '', sku: ''
      });
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Create New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="w-full p-2 border rounded" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} placeholder="Base Price (Rs.)" required className="w-full p-2 border rounded" />
            <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} placeholder="Discount (%)" min="0" max="100" className="w-full p-2 border rounded" />
          </div>

          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required rows="4" className="w-full p-2 border rounded"></textarea>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required className="w-full p-2 border rounded" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g., Nuts, Dates)" required className="w-full p-2 border rounded" />
            <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} placeholder="Stock Quantity" required className="w-full p-2 border rounded" />
          </div>
          
          <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU (e.g., DF-001)" className="w-full p-2 border rounded" />

          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ====================================================================
// Component 2: Confirmation Modal 
// ====================================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// Component 3: Main Page Component
// ====================================================================
const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
 const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/api/products?keyword=${searchTerm}`);
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProducts(sortedData);
    } catch (error) {
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

   useEffect(() => {
    setCurrentPage(1); // Har nayi search par page 1 par jao
    const timerId = setTimeout(() => {
      fetchProducts(); // Bas yahan par upar wale function ko call karein
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, fetchProducts]);

  // Modal Control Functions
  const handleOpenCreateModal = () => {
    setCurrentProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsConfirmModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsConfirmModalOpen(false);
    setCurrentProduct(null);
    setProductToDelete(null);
  };

  // API Call Functions
  const handleSaveProduct = async (formData) => {
    const apiCall = currentProduct
      ? apiClient.put(`/api/products/${currentProduct._id}`, formData, { headers: { Authorization: `Bearer ${user.token}` } })
      : apiClient.post('/api/products', formData, { headers: { Authorization: `Bearer ${user.token}` } });

    try {
      await apiCall;
      toast.success(`Product ${currentProduct ? 'updated' : 'created'} successfully!`);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to save product.");
    } finally {
      handleCloseModals();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await apiClient.delete(`/api/products/${productToDelete._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Product deleted successfully.");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product.");
    } finally {
      handleCloseModals();
    }
  };
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Page badalne ke liye function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        {/* Ye hissa ab hamesha nazar aayega */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <div className="w-full md:w-1/3">
            <input 
              type="text"
              placeholder="Search by name, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button onClick={handleOpenCreateModal} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full md:w-auto">
            + Create Product
          </button>
        </div>

        {/* Ab content, loading state ke hisab se render hoga */}
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border-b">PRODUCT</th>
                    <th className="p-4 border-b">SKU</th>
                    <th className="p-4 border-b">CATEGORY</th>
                    <th className="p-4 border-b">PRICE</th>
                    <th className="p-4 border-b">STOCK</th>
                    <th className="p-4 border-b">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map(product => {
                    const hasDiscount = product.discountPercentage > 0;
                    const finalPrice = product.price;

                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="p-2 border-b">
                          <div className="flex items-center gap-3">
                            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                            <span className="font-semibold">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-4 border-b text-sm font-mono">{product.sku}</td>
                        <td className="p-4 border-b text-sm">{product.category}</td>
                        <td className="p-4 border-b">
                          {hasDiscount ? (
                            <div>
                              <p className="font-semibold text-green-600">Rs. {finalPrice.toFixed(0)}</p>
                              <p className="text-xs text-gray-500 line-through">Rs. {product.basePrice}</p>
                            </div>
                          ) : (
                            <p className="font-semibold">Rs. {product.basePrice}</p>
                          )}
                        </td>
                        <td className="p-4 border-b">{product.countInStock}</td>
                        <td className="p-4 border-b">
                          <div className="flex gap-5">
                            <button onClick={() => handleOpenEditModal(product)} title="Edit Product" className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100">
                              <FaPencilAlt size={16} />
                            </button>
                            <button onClick={() => handleOpenDeleteModal(product)} title="Delete Product" className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100">
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {currentProducts.length === 0 && (
                <p className="text-center p-6 text-gray-500">No products found.</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center flex-wrap gap-2">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-100">Previous</button>
                {[...Array(totalPages).keys()].map(number => (
                  <button key={number + 1} onClick={() => paginate(number + 1)} className={`px-4 py-2 border rounded ${currentPage === number + 1 ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}>{number + 1}</button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-100">Next</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ProductFormModal isOpen={isFormModalOpen} onClose={handleCloseModals} onSave={handleSaveProduct} product={currentProduct} />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={handleCloseModals} onConfirm={handleDeleteConfirm} title="Delete Product" message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`} />
    </>
  );
};

export default AdminProductListPage;