import React, { useState, useEffect } from 'react';
import apiClient from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for individual items (order cards)
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      const { data } = await apiClient.get('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // Orders ko naye se puranay ki tarteeb mein sort karein
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
        fetchOrders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await apiClient.put(`/api/orders/${orderId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        toast.success("Order cancelled successfully.");
        fetchOrders(); // List ko refresh karein
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel order.");
      }
    }
  };

  const OrderCard = ({ order }) => {
    // 2 ghantay (in milliseconds)
    const isCancellable = order.orderStatus === 'Pending' && (new Date() - new Date(order.createdAt)) < 2 * 60 * 60 * 1000;

    const getStatusClass = (status) => {
      switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Delivered': return 'bg-green-100 text-green-800 border-green-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
      }
    };

    return (
      <motion.div variants={itemVariants} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 transition-shadow duration-300 hover:shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <p className="font-bold text-gray-800">Order ID: #{order._id.substring(order._id.length - 6)}</p>
            <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span className={`px-3 py-1 mt-2 sm:mt-0 text-sm font-semibold rounded-full border ${getStatusClass(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
        </div>
        <hr />
        <div className="my-4 space-y-2">
          {order.orderItems.map(item => (
            <div key={item.product} className="flex justify-between items-center text-sm text-gray-700">
              <span className="flex-1 pr-4">{item.name} <span className="text-gray-500">x{item.qty}</span></span>
              <span className="font-medium">Rs. {item.price * item.qty}</span>
            </div>
          ))}
        </div>
        <hr />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
          <p className="font-bold text-lg text-gray-800">Total: Rs. {order.totalPrice}</p>
          {isCancellable && (
            <button 
              onClick={() => handleCancelOrder(order._id)} 
              className="bg-red-500 text-white font-semibold px-4 py-2 mt-3 sm:mt-0 text-sm rounded-md hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Cancel Order
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Spinner/>
      </div>
    );
  }

  // === EMPTY ORDERS STATE ===
  if (orders.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[calc(100vh-30px)] text-center px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FiPackage className="text-emerald-400 text-7xl mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">You haven't placed any orders yet.</h1>
        <p className="text-gray-500 mb-8 max-w-sm">All your future orders will be shown here. Let's get started!</p>
        <Link 
          to="/" 
          className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105"
        >
          Start Shopping
        </Link>
      </motion.div>
    );
  }

  const activeOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Shipped');
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled');

  // === ORDERS LIST VIEW ===
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-8 text-center sm:text-left"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Orders
      </motion.h1>
      
      <motion.div
        className="space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activeOrders.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-20">Active Orders</h2>
            <div className="space-y-6">
              {activeOrders.map(order => <OrderCard key={order._id} order={order} />)}
            </div>
          </motion.section>
        )}
        
        {completedOrders.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Completed & Cancelled</h2>
            <div className="space-y-6">
              {completedOrders.map(order => <OrderCard key={order._id} order={order} />)}
            </div>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
};

export default MyOrdersPage;