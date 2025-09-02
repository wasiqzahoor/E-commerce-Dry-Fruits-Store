import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiChevronDown, FiShoppingCart, FiLoader } from 'react-icons/fi';

const FormField = ({ name, placeholder, value, onChange, required = false, type = "text" }) => (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <input
                type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
        </motion.div>
    );

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', address: '', city: '', postalCode: '', phone: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('Easypaisa');
    const [isLoading, setIsLoading] = useState(false);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    useEffect(() => {
        // Yeh check zaroori hai
        if (!user) {
            toast.info("Please log in to continue to checkout.");
            navigate('/auth'); // Agar user nahi hai to login page par bhej dein
        } else {
            const nameParts = user.name.split(' ');
            setFormData(prev => ({ ...prev, firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '' }));
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePlaceOrder = async (e) => {
    e.preventDefault();
    // ... validation ...
     if (!user || !user._id) {
            toast.error("User information is missing. Please log in again.");
            return; // Function ko yahin rok dein
        }
        
        if (!formData.firstName || !formData.phone || !formData.address || !formData.city) {
            return toast.error("Please fill in all the required delivery details.");
        }
    setIsLoading(true);

    const orderData = {
        customerDetails: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: user?.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}, ${formData.postalCode || ''}`.trim(),
        },
        // orderItems ab simple hain
        orderItems: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            qty: item.qty,
            price: item.price,
        })),
        paymentMethod: paymentMethod, // Payment method yahan alag se hai
        totalPrice: grandTotal, // Total price bhi bhejein
        // user field backend par automatically token se le li jayegi
    };
    console.log("Order data being sent:", orderData); 
    try {
        await apiClient.post('/api/orders', orderData, { headers: { Authorization: `Bearer ${user.token}` } });
        toast.success("Order placed successfully! Please send payment confirmation on WhatsApp.");
        clearCart();
        navigate('/my-orders');
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to place order.");
    } finally {
        setIsLoading(false);
    }
};

    const subTotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
    const shippingCharges = 250;
    const grandTotal = subTotal + shippingCharges;

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center px-4">
                <FiShoppingCart className="text-emerald-400 text-7xl mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty.</h1>
                <p className="text-gray-500 mb-8">Add items to your cart to proceed to checkout.</p>
                <Link to="/" className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-emerald-600 transition-colors">Go Shopping</Link>
            </div>
        );
    }
    
    

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto flex flex-col-reverse lg:flex-row">

                {/* Left Side: Form (Scrollable) */}
                <motion.div 
                    className="w-full lg:w-3/5 py-8 px-4 sm:px-8 lg:px-12"
                    variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                    initial="hidden" animate="visible"
                >
                    <h1 className="text-3xl font-bold mb-6">Gilgit Dry Fruits</h1>
                    <form onSubmit={handlePlaceOrder} className="space-y-8">
                        {/* Contact */}
                        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-medium">Contact</h2>
                                <button type="button" onClick={logout} className="text-sm text-emerald-600 hover:underline">Log out</button>
                            </div>
                            <p className="p-3 border rounded-md bg-gray-50 text-sm">{user?.email}</p>
                        </motion.div>

                        {/* Delivery */}
                        <div>
                            <h2 className="text-lg font-medium mb-3">Delivery Address</h2>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <FormField name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
                                    <FormField name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
                                </div>
                                <FormField name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <FormField name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                                    <FormField name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal code (optional)" />
                                </div>
                                <FormField name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone (e.g., 03123456789)" required type="tel" />
                            </div>
                        </div>

                        {/* Payment */}
                        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                            <h2 className="text-lg font-medium mb-3">Payment</h2>
                            <p className="text-sm text-gray-600 mb-2">All transactions are secure and encrypted.</p>
                            <div className="space-y-2 border border-gray-300 rounded-md">
                                {['Easypaisa', 'JazzCash', 'COD'].map(method => (
                                    <div key={method} className="border-b last:border-b-0">
                                        <label className={`flex items-center p-4 cursor-pointer transition-colors ${paymentMethod === method ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}>
                                            <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                                            {method === 'COD' ? 'Cash on Delivery' : method}
                                        </label>
                                        {paymentMethod === method && method !== 'COD' && (
                                            <div className="p-4 border-t bg-gray-50 text-sm text-gray-700">
                                                <p className="font-semibold">Please transfer Rs. {grandTotal.toFixed(2)} to the following account:</p>
                                                <p className="mt-2"><strong>Account Title:</strong> Chaudhary Wasiq Zahoor</p>
                                                <p><strong>Account Number:</strong> {method === 'Easypaisa' ? '03415287464' : '03029464542'}</p>
                                                <hr className="my-2" />
                                                <p className="font-bold text-red-600">After payment, send screenshot to our WhatsApp: +92 3029464542</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-emerald-600 text-white font-bold py-4 rounded-md hover:bg-emerald-700 disabled:bg-gray-400 transition-colors duration-300">
                                {isLoading ? <FiLoader className="animate-spin text-2xl" /> : `Complete Order (Rs. ${grandTotal.toFixed(2)})`}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>

                {/* Right Side: Order Summary (Sticky) */}
                <div className="w-full lg:w-2/5 lg:border-l bg-gray-50 mt-10 pt-10">
                    <div className="lg:sticky lg:top-8 py-8 px-4 sm:px-8 lg:px-12">
                        <div onClick={() => setIsSummaryOpen(!isSummaryOpen)} className="lg:hidden flex justify-between items-center cursor-pointer mb-4">
                            <div className="flex items-center gap-2 text-emerald-600">
                                <FiShoppingCart />
                                <span className="font-semibold">Show order summary</span>
                                <FiChevronDown className={`transition-transform ${isSummaryOpen ? 'rotate-180' : ''}`} />
                            </div>
                            <span className="text-lg font-bold">Rs. {grandTotal.toFixed(2)}</span>
                        </div>
                        
                        <motion.div 
                            className={`${isSummaryOpen ? 'block' : 'hidden'} lg:block`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: isSummaryOpen || window.innerWidth >= 1024 ? 'auto' : 0, opacity: isSummaryOpen || window.innerWidth >= 1024 ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                                                <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.qty}</span>
                                            </div>
                                            <span className="font-semibold text-gray-800">{item.name}</span>
                                        </div>
                                        <span className="text-gray-700 font-medium">Rs. {(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <hr className="my-6" />
                            <div className="space-y-2 text-gray-700">
                                <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">Rs. {subTotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span className="font-medium">Rs. {shippingCharges.toFixed(2)}</span></div>
                            </div>
                            <hr className="my-6" />
                            <div className="flex justify-between items-center font-bold text-xl">
                                <span>Total</span><span>Rs. {grandTotal.toFixed(2)}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;