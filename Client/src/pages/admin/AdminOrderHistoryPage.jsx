import React, { useState, useEffect } from 'react';
import apiClient from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';

// Helper function (aap isay ek utils file mein bhi rakh sakte hain)
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

const AdminOrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added for better error handling
    const { user } = useAuth();

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            // YAHAN TABDEELI HAI: Hum ab `status=history` bhej rahe hain
            const { data } = await apiClient.get('/api/orders?status=history', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch order history:", err);
            setError("Failed to fetch order history.");
            toast.error("Failed to fetch order history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchOrders();
        }
    }, [user]);

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Order History (Completed & Cancelled)</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 border-b">ID / USER</th>
                            <th className="p-4 border-b">DATE</th>
                            <th className="p-4 border-b">TOTAL</th>
                            <th className="p-4 border-b">FINAL STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4">
                                    <div className="flex justify-center items-center py-8">
                                        <Spinner />
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                             <tr>
                                <td colSpan="4">
                                    <p className="text-center text-red-500 py-8">{error}</p>
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="4">
                                    <p className="text-center text-gray-600 py-8">No historical orders found.</p>
                                </td>
                            </tr>
                        ) : (
                            orders.map(order => (
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrderHistoryPage;