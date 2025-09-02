import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const grandTotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  // === CASE: JAB CART KHALI HO ===
  if (cartItems.length === 0) {
    return (
      <motion.div 
       className="flex flex-col items-center justify-center min-h-[calc(100vh-30px)] text-center px-4 mb-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FiShoppingCart className="text-emerald-400 text-7xl mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Your Cart feels light...</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Let's find something for you!</p>
        <Link 
          to="/" 
          className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105"
        >
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  // === CASE: JAB CART MEIN ITEMS HON ===
  return (
    <div className="container mx-auto px-4 py-12 ">
      <motion.h1 
        className="text-3xl font-bold mb-8 text-center lg:text-left"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Shopping Cart
      </motion.h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Cart Items List */}
        <motion.div 
          className="lg:col-span-2 space-y-4"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div 
                key={item._id} 
                className="flex flex-col sm:flex-row items-center bg-white p-4 border border-gray-200 rounded-lg shadow-sm"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 }
                }}
                exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
              >
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0" />
                <div className="flex-grow sm:ml-4 text-center sm:text-left">
                  <h2 className="font-bold text-lg">{item.name}</h2>
                  <p className="text-sm text-gray-500">Price: Rs. {item.price}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQuantity(item._id, item.qty - 1)} className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg">-</button>
                    <span className="px-4 py-1 font-semibold">{item.qty}</span>
                    <button onClick={() => updateQuantity(item._id, item.qty + 1)} className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg">+</button>
                  </div>
                  <p className="font-bold w-28 text-right">Rs. {item.price * item.qty}</p>
                  <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Right Side: Order Summary */}
        <motion.div 
          className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm h-fit sticky top-24 mb-20"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">Order Summary</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">Rs. {grandTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-500">250</span>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-xl text-gray-800">
            <span>Total</span>
            <span>Rs. {grandTotal}</span>
          </div>
          <Link to="/checkout" className="block text-center w-full mt-6 bg-emerald-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105">
            Proceed to Checkout
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;