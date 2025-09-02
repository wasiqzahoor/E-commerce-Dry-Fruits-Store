import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/api.js';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingBag, FaEye } from 'react-icons/fa';
import Spinner from './Spinner';

// QuickViewModal component (Is mein koi tabdeeli nahi ki gayi)
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
                    <p className="text-gray-600 mb-6">{product.description.slice(0,100)}</p>
                    <button onClick={() => onAddToCart(product)} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

// === RESPONSIVE PRODUCTLIST COMPONENT ===
const ProductList = ({ filterCategory }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('new');
    const [showSavedOnly, setShowSavedOnly] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 25; // Mobile par behtar experience ke liye products per page kam kar diye hain

    const { wishlistItems, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const savedProductIds = useMemo(() => new Set(wishlistItems.map(item => item._id)), [wishlistItems]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            const fetchProducts = async () => {
                setLoading(true);
                try {
                    const { data } = await apiClient.get(`/api/products?keyword=${searchTerm}`);
                    setAllProducts(data);
                    setError(null);
                } catch (err) {
                    setError('Failed to fetch products.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }, 500);

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const handleAddToCart = (product, e) => {
        e.stopPropagation(); e.preventDefault();
        if (!isAuthenticated) {
            toast.info("Please log in to add items to your cart.");
            return navigate('/auth');
        }
        addToCart(product, 1);
        toast.success(` ${product.name} added to cart!`);
    };

    const handleToggleWishlist = (product, e) => {
        e.stopPropagation(); e.preventDefault();
        if (!isAuthenticated) {
            toast.info("Please log in to save items to your wishlist.");
            return navigate('/auth');
        }
        toggleWishlist(product);
    };

    const handleOpenQuickView = (product, e) => {
        e.stopPropagation(); e.preventDefault();
        setQuickViewProduct(product);
    };
    
    const filteredProducts = useMemo(() => {
        let products = [...allProducts];

        if (filterCategory && filterCategory !== 'All') {
            products = products.filter(p => p.category === filterCategory);
        }
        if (showSavedOnly) {
            products = products.filter(p => savedProductIds.has(p._id));
        }
        if (sortBy === 'new') {
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'old') {
            products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        return products;
    }, [allProducts, sortBy, showSavedOnly, savedProductIds, filterCategory]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
        <div className="container mx-auto mt-8 pt-6 px-2 sm:px-4 mb-10 bg-gradient-to-b from-amber-50 to-white"> {/* Mobile ke liye horizontal padding kam ki */}
                
                {/* === RESPONSIVE FILTER CONTROLS === */}
                {/* `md:flex` se ye bari screen par flex hoga, `gap-2` se items ke beech thora fasla aayega */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6 md:mb-8 p-3 md:p-4 bg-gray-100 rounded-lg">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="p-2 border rounded-md w-full" /* `w-full` se ye poori width lega */
                    />
                    
                    {/* === SORT AUR SAVED WALE BUTTONS AB SIRF BARI SCREEN PAR NAZAR AAYENGE === */}
                    {/* `hidden md:flex` ka istemal kiya gaya hai */}
                    <div className="hidden md:flex items-center gap-4">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded-md">
                            <option value="new">Sort by Newest</option>
                            <option value="old">Sort by Oldest</option>
                        </select>
                        <label className="flex items-center gap-2 p-2 bg-white border rounded-md cursor-pointer">
                            <input type="checkbox" checked={showSavedOnly} onChange={(e) => setShowSavedOnly(e.target.checked)} className="h-5 w-5"/>
                            <span className='whitespace-nowrap'>Show Saved ❤️</span>
                        </label>
                    </div>
                </div>

                {loading ? (
                    <Spinner />
                ) : error ? (
                    <div className="text-center text-xl text-red-500 p-10">Error: {error}</div>
                ) : (
                    <>
                        {/* === RESPONSIVE PRODUCT GRID === */}
                        {/* Mobile par 2 column (`grid-cols-2`), bari screens par 3, 4, aur 5 columns */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                            {currentProducts.map((product) => {
                                const isSaved = savedProductIds.has(product._id);
                                const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
                                
                                return (
                                    <Link key={product._id} to={`/product/${product._id}`} className="block relative group bg-gradient-to-b from-amber-50 to-white border rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl">
                                        {hasDiscount && (
                                            <div className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-md z-10">
                                                -{product.discountPercentage}%
                                            </div>
                                        )}
                                        <div className="relative overflow-hidden">
                                            {/* Mobile par image height kam ki hai (`h-32`) */}
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
                                            {/* Mobile par icons ko thora chota kiya hai (`p-2`) */}
                                            <div className="absolute inset-0 bg-black bg-opacity-20 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button onClick={(e) => handleToggleWishlist(product, e)} title="Save to Wishlist" className="bg-white rounded-full p-2 text-gray-700 hover:bg-red-500 hover:text-white transition-colors"><FaHeart className={isSaved ? 'text-red-500' : ''} /></button>
                                                <button onClick={(e) => handleAddToCart(product, e)} title="Add to Cart" className="bg-white rounded-full p-2 text-gray-700 hover:bg-emerald-500 hover:text-white transition-colors"><FaShoppingBag /></button>
                                                <button onClick={(e) => handleOpenQuickView(product, e)} title="Quick View" className="bg-white rounded-full p-2 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"><FaEye /></button>
                                            </div>
                                        </div>
                                        {/* === RESPONSIVE CARD CONTENT === */}
                                        <div className="p-2 text-center">
                                            {/* Product name ka font size aur height adjust ki gayi hai */}
                                            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 h-10 flex items-center justify-center">{product.name.length > 30 ? product.name.slice(0, 30) + '...' : product.name}</h3>
                                            {/* Price ka font size aur margin adjust kiya gaya hai */}
                                            <div className="mt-1 flex flex-col sm:flex-row justify-center items-center gap-1">
                                                <span className="text-sm sm:text-base font-bold text-emerald-600">Rs.{product.price.toFixed(0)}</span>
                                                {hasDiscount && <span className="text-xs text-gray-500 line-through">Rs.{product.basePrice.toFixed(0)}</span>}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {currentProducts.length === 0 && <p className="text-center mt-8 text-gray-500">No products found.</p>}

                        {/* Pagination (Is mein koi tabdeeli nahi ki) */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center flex-wrap gap-2">
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-100">Previous</button>
                                {[...Array(totalPages).keys()].map(number => (
                                    <button key={number + 1} onClick={() => paginate(number + 1)} className={`px-4 py-2 border rounded ${currentPage === number + 1 ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-gray-100'}`}>
                                        {number + 1}
                                    </button>
                                ))}
                                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-100">Next</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <QuickViewModal 
                product={quickViewProduct} 
                isOpen={!!quickViewProduct} 
                onClose={() => setQuickViewProduct(null)} 
                onAddToCart={(product) => {
                    if (!isAuthenticated) {
                        toast.info("Please log in to add items to your cart.");
                        setQuickViewProduct(null);
                        return navigate('/auth');
                    }
                    addToCart(product, 1);
                    setQuickViewProduct(null);
                    toast.success(`${product.name} added to cart!`);
                }}
            />
        </>
    );
};

export default ProductList;