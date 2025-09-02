import React, { useState, useEffect } from 'react';
import apiClient from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import OrderDetailModal from '../../components/OrderDetailModal';
import { FiEye } from 'react-icons/fi';
const getStatusClass = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-200 text-yellow-800';
        case 'Shipped': return 'bg-blue-200 text-blue-800';
        case 'Delivered': return 'bg-green-200 text-green-800';
        case 'Cancelled': return 'bg-red-200 text-red-800';
        case 'Out of Stock': return 'bg-gray-200 text-gray-800';
        default: return 'bg-gray-100 text-gray-700';
    }
}

const AdminOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      // YAHAN TABDEELI HAI: Hum ab `status=active` bhej rahe hain
      const { data } = await apiClient.get('/api/orders?status=active', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch active orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Order status updated!");
      fetchOrders(); // List ko refresh karein
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };
  
 

  return (
    <div className="container mx-auto px-4 py-12 mt-6">
      <h1 className="text-3xl font-bold mb-8">Manage All Orders</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b">ID / USER</th>
              <th className="p-4 border-b">DATE</th>
              <th className="p-4 border-b">TOTAL</th>
              <th className="p-4 border-b">STATUS</th>
              <th className="p-4 border-b">CHANGE STATUS</th>
              <th className="p-4 border-b text-center">DETAILS</th>
            </tr>
          </thead>
         
          <tbody>
               {loading && (
      <tr>
        <td colSpan={5}>
          <div className="flex justify-center items-center py-8">
            <Spinner />
          </div>
        </td>
      </tr>
    )}
    {!loading && orders.length === 0 && (
      <tr>
        <td colSpan={5}>
          <p className="text-center text-gray-600 py-8">No active orders found.</p>
        </td>
      </tr>
    )}
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="p-4 border-b">
                    <p className="text-sm font-mono">{order._id}</p>
                    <p className="text-xs text-gray-600">{order.customerDetails.email}</p>
                </td>
                <td className="p-4 border-b text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 border-b font-semibold">Rs. {order.totalPrice}</td>
                <td className="p-4 border-b text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.orderStatus)}`}>
                        {order.orderStatus}
                    </span>
                </td>
                <td className="p-4 border-b">
                  <select 
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="p-1 border rounded"
                    // Admin har status ko badal sakta hai
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled by Admin</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </td>
                 <td className="p-4 border-b text-center">
                    <button 
                      onClick={() => setSelectedOrder(order)} 
                      className="text-emerald-600 hover:text-emerald-800"
                      title="View Order Details"
                    >
                      <FiEye size={20} />
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <OrderDetailModal 
        isOpen={!!selectedOrder} 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
    
  );
};

export default AdminOrderListPage;