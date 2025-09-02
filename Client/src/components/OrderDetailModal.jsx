import React from 'react';
import { FiX, FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

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

const OrderDetailModal = ({ isOpen, order, onClose }) => {
    if (!isOpen || !order) return null;

    return (
        // Overlay
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                    <h2 className="text-xl font-bold">Order Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Order Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Order ID</p>
                            <p className="font-mono font-semibold">{order._id}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Total Price</p>
                            <p className="font-semibold">Rs. {order.totalPrice.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Status</p>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.orderStatus)}`}>
                                {order.orderStatus}
                            </span>
                        </div>
                    </div>

                    <hr />

                    {/* Customer Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Customer Details</h3>
                        <div className="space-y-2 text-gray-700">
                            <p className="flex items-center gap-2"><FiUser className="text-emerald-600"/> <strong>Name:</strong> {order.customerDetails.name}</p>
                            <p className="flex items-center gap-2"><FiMail className="text-emerald-600"/> <strong>Email:</strong> {order.customerDetails.email}</p>
                            <p className="flex items-center gap-2"><FiPhone className="text-emerald-600"/> <strong>Phone:</strong> {order.customerDetails.phone}</p>
                            <p className="flex items-start gap-2"><FiMapPin className="text-emerald-600 mt-1"/> <strong>Address:</strong> {order.customerDetails.address}</p>
                        </div>
                    </div>

                    <hr />

                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                        <div className="space-y-3">
                            {order.orderItems.map(item => (
                                <div key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.qty} KG</p>
                                    </div>
                                    <p className="font-semibold">Rs. {(item.price * item.qty).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;