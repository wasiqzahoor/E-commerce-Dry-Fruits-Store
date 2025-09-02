import React, {useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate import karein
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext'; // Cart context import karein
import { useAuth } from '../context/AuthContext'; // Auth context import karein
import { toast } from 'react-toastify'; // Toast import karein
import { FaSearch, FaTrash, FaShoppingBag, FaEye, FaHeartBroken } from 'react-icons/fa';

// QuickViewModal component ko yahan import ya define karna hoga
// Main farz kar raha hoon ke yeh aapke components folder mein hai
// import QuickViewModal from '../components/QuickViewModal'; 

// === Placeholder for QuickViewModal agar alag file mein na ho ===
const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
    if (!isOpen || !product) return null;
    const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6" onClick={e => e.stopPropagation()}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-md" />
                <div>
                    <h2 className="text-3xl font-bold">{product.name}</h2>
                    <div className="my-4 flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-emerald-600">Rs. {product.price.toFixed(2)}</span>
                        {hasDiscount && <span className="ml-2 text-lg text-gray-500 line-through">Rs. {product.basePrice.toFixed(2)}</span>}
                    </div>
                    <p className="text-gray-600 mb-6">{product.description.slice(0, 100)}</p>
                    <button onClick={() => onAddToCart(product)} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};


// Side Banners (Inmein koi tabdeeli nahi)
const PrimaryAdBanner = () => ( <Link to="/" className="relative w-full max-w-[250px] mx-auto rounded-lg overflow-hidden block group"><img src='https://www.khandryfruit.com/cdn/shop/files/untitled-design-2025-08-16t213921501-68a0b45f2ed0a.webp?v=1755362428' alt="Special Offer" className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" /><div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5"><span className="w-full bg-red-600 text-white font-bold px-4 py-2 text-sm rounded-md hover:bg-red-700 transition-colors block text-center">Shop Now</span></div></Link> );
const SecondaryAdBanner = () => ( <Link to="/" className="relative w-full max-w-[250px] mx-auto rounded-lg overflow-hidden block group"><img src='https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg' alt="New Arrivals" className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" /><div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5"><span className="w-full bg-emerald-600 text-white font-bold px-4 py-2 text-sm rounded-md hover:bg-emerald-700 transition-colors block text-center">Discover More</span></div></Link> );


// Main Saved Items Page Component
const SavedItemsPage = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart(); // addToCart function hasil karein
  const { isAuthenticated } = useAuth(); // authentication state hasil karein
  const navigate = useNavigate(); // navigation ke liye

  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null); // Quick View ke liye state

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = wishlistItems.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === NAYE FUNCTIONS: Cart aur Quick View ke liye ===
  const handleAddToCart = (product, e) => {
    e.stopPropagation(); e.preventDefault();
    if (!isAuthenticated) { toast.info("Please log in to add items to your cart."); return navigate('/auth'); }
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (product, e) => {
    e.stopPropagation(); e.preventDefault();
    toggleWishlist(product);
  };
  
  const handleOpenQuickView = (product, e) => {
    e.stopPropagation(); e.preventDefault();
    setQuickViewProduct(product);
  };


  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-30px)]  px-4">
        <FaHeartBroken className="text-red-300 text-7xl mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Wishlist is Empty</h1>
        <p className="text-gray-600 mb-8 max-w-md">You haven't saved any items yet. Let's find something you'll love!</p>
        <Link to="/" className="bg-emerald-600 text-white px-8 py-3 rounded-md hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">Start Exploring</Link>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <aside className={`lg:col-span-3 hidden lg:flex flex-col items-center gap-8 transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <PrimaryAdBanner />
              <SecondaryAdBanner />
          </aside>

          <main className="lg:col-span-9">
            <header className={`mb-8 transition-all duration-500 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">My Saved Items</h1>
              <div className="relative max-w-lg">
                <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search in your saved items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-12 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"/>
              </div>
            </header>

            {/* === TABDEELI: Product Grid ab ProductList jaisi hai === */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((product, index) => {
                const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
                
                return (
                  // === TABDEELI: Card ka poora structure ab ProductList jaisa hai ===
                  <div 
                    key={product._id} 
                    className={`block relative group bg-white border rounded-lg shadow-sm overflow-hidden transition-all duration-500 ease-out hover:shadow-xl ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Discount Badge */}
                    {hasDiscount && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                          -{product.discountPercentage}%
                      </div>
                    )}

                    <div className="relative overflow-hidden">
                      <Link to={`/product/${product._id}`}>
                        <img src={product.imageUrl} alt={product.name} className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
                      </Link>
                      
                      {/* === NAYA FEATURE: Overlay buttons bilkul ProductList jaisa === */}
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {/* Remove button (Trash Icon) */}
                          <button onClick={(e) => handleToggleWishlist(product, e)} title="Remove from Wishlist" className="bg-white rounded-full p-2 sm:p-3 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><FaTrash /></button>
                          {/* Add to Cart button */}
                          <button onClick={(e) => handleAddToCart(product, e)} title="Add to Cart" className="bg-white rounded-full p-2 sm:p-3 text-gray-700 hover:bg-emerald-500 hover:text-white transition-colors"><FaShoppingBag /></button>
                          {/* Quick View button */}
                          <button onClick={(e) => handleOpenQuickView(product, e)} title="Quick View" className="bg-white rounded-full p-2 sm:p-3 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"><FaEye /></button>
                      </div>
                    </div>
                    
                    <Link to={`/product/${product._id}`} className="p-2 sm:p-3 text-center block">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 h-10 flex items-center justify-center" title={product.name}>
                          {product.name.length > 30 ? product.name.slice(0, 30) + '...' : product.name}
                        </h3>
                        {/* === NAYA FEATURE: Dono prices ab show hongi === */}
                        <div className="mt-1 flex flex-col sm:flex-row justify-center items-baseline gap-1">
                            <span className="text-sm sm:text-base font-bold text-emerald-600">Rs.{product.price.toFixed(0)}</span>
                            {hasDiscount && <span className="text-xs text-gray-500 line-through">Rs.{product.basePrice.toFixed(0)}</span>}
                        </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && searchTerm && (
                <div className="text-center py-20"><p className="text-gray-600 text-lg">No saved items found for "{searchTerm}"</p></div>
            )}
          </main>
        </div>
      </div>
      
      {/* Quick View Modal ka component */}
      <QuickViewModal 
          product={quickViewProduct} 
          isOpen={!!quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
          onAddToCart={(product) => {
              if (!isAuthenticated) { toast.info("Please log in to add items to your cart."); setQuickViewProduct(null); return navigate('/auth'); }
              addToCart(product, 1); setQuickViewProduct(null); toast.success(`${product.name} added to cart!`);
          }}
      />
    </>
  );
};

export default SavedItemsPage;