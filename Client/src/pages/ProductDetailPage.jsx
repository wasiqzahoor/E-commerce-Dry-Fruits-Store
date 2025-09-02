import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { FaHeart, FaShoppingBag, FaWhatsapp, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

// Components for Banners, WhatsApp, Tabs, etc. (Inmein koi tabdeeli nahi hai)
const FloatingWhatsAppButton = ({ phoneNumber }) => {
    const message = "Hello! I have a question about your products.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    return ( <a href={url} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-105"> <FaWhatsapp size={24} /> <span className="font-semibold hidden sm:block">Chat with Us</span> </a> );
};
const PrimaryAdBanner = () => {
    return ( <Link to="/" className="relative w-full max-w-[250px] mx-auto rounded-lg overflow-hidden block group"> <img src='https://www.khandryfruit.com/cdn/shop/files/untitled-design-2025-08-16t213921501-68a0b45f2ed0a.webp?v=1755362428' alt="Special Offer" className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" /> <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5"> <span className="w-full bg-red-600 text-white font-bold px-4 py-2 text-sm rounded-md hover:bg-red-700 transition-colors block text-center"> Shop Now </span> </div> </Link> );
};
const ThirdAdBanner = () => {
    return ( <Link to="/" className="relative w-full max-w-[250px] mx-auto rounded-lg overflow-hidden block group"> <img src='https://images.pexels.com/photos/2386158/pexels-photo-2386158.jpeg' alt="New Arrivals" className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" /> <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5"> <span className="w-full bg-emerald-600 text-white font-bold px-4 py-2 text-sm rounded-md hover:bg-emerald-700 transition-colors block text-center"> Explore More Products </span> </div> </Link> );
};
const FourthAdBanner = () => {
    return ( <Link to="/" className="relative w-full max-w-[250px] mx-auto rounded-lg overflow-hidden block group"> <img src='https://images.pexels.com/photos/3872416/pexels-photo-3872416.jpeg' alt="New Arrivals" className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" /> <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5"> <span className="w-full bg-emerald-600 text-white font-bold px-4 py-2 text-sm rounded-md hover:bg-emerald-700 transition-colors block text-center"> New Arrivals</span> </div> </Link> );
};
const SecondaryAdBanner = () => {
    return ( <Link to="/" className="relative w-full max-w-[250px] mx-auto rounded-lg overflow-hidden block group"> <img src='https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg' alt="New Arrivals" className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" /> <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5"> <span className="w-full bg-emerald-600 text-white font-bold px-4 py-2 text-sm rounded-md hover:bg-emerald-700 transition-colors block text-center"> Discover More </span> </div> </Link> );
};
const StarRating = ({ rating, onRatingChange }) => {
    const [hover, setHover] = useState(0);
    return ( <div className="flex"> {[...Array(5)].map((star, index) => { const ratingValue = index + 1; return ( <label key={index}> <input type="radio" name="rating" value={ratingValue} onClick={() => onRatingChange(ratingValue)} className="hidden" /> <FaStar className="cursor-pointer" color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} size={20} onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(0)} /> </label> ); })} </div> );
};
const FacebookComments = ({ url }) => {
    useEffect(() => { if (window.FB) { window.FB.XFBML.parse(); } }, [url]);
    return (<div className="fb-comments" data-href={url} data-width="100%" data-numposts="5"></div>);
};
const ProductTabs = ({ product, onReviewSubmit }) => {
    const [activeTab, setActiveTab] = useState('description'); const [rating, setRating] = useState(0); const [comment, setComment] = useState(''); const { isAuthenticated } = useAuth(); const pageUrl = window.location.href;
    const handleReviewSubmit = (e) => { e.preventDefault(); if (rating === 0) return toast.error("Please provide a star rating."); onReviewSubmit({ rating, comment }); setRating(0); setComment(''); };
    return ( <div className="mt-12 w-full"> <div className="border-b"> <nav className="flex flex-wrap gap-4 sm:gap-6"> <button onClick={() => setActiveTab('description')} className={`py-2 border-b-2 text-sm font-semibold ${activeTab === 'description' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}>DESCRIPTION</button> <button onClick={() => setActiveTab('reviews')} className={`py-2 border-b-2 text-sm font-semibold ${activeTab === 'reviews' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}>REVIEWS ({product.numReviews})</button> <button onClick={() => setActiveTab('comments')} className={`py-2 border-b-2 text-sm font-semibold ${activeTab === 'comments' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}>COMMENTS</button> </nav> </div> <div className="py-6"> {activeTab === 'description' && (<div><h3 className="text-xl font-bold mb-4">Description</h3><p className="text-gray-600 whitespace-pre-wrap">{product.description}</p></div>)} {activeTab === 'reviews' && (<div><h3 className="text-xl font-bold mb-4">Customer Reviews</h3>{product.reviews.length === 0 && <p>No reviews yet.</p>}<div className="space-y-4 mb-6">{product.reviews.map(review => (<div key={review._id} className="border-b pb-2"><p className="font-semibold">{review.name}</p><p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p><p className="mt-1">{review.comment}</p></div>))}</div>{isAuthenticated ? (<form onSubmit={handleReviewSubmit}><h4 className="font-semibold mb-2">Write a review</h4><div className="mb-2"><p className="font-medium text-sm mb-1">Your Rating:</p><StarRating rating={rating} onRatingChange={setRating} /></div><textarea value={comment} onChange={e => setComment(e.target.value)} required rows="3" className="w-full p-2 border rounded" placeholder="Your review..."></textarea><div className="flex items-center justify-end mt-2"><button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Submit</button></div></form>) : (<p>Please <Link to="/auth" className="text-blue-600">log in</Link> to write a review.</p>)}</div>)} {activeTab === 'comments' && (<div><h3 className="text-xl font-bold mb-4">Comments</h3><FacebookComments url={pageUrl} /></div>)} </div> </div> );
};


// ====================================================================
// Main Product Detail Page Component
// ====================================================================
const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { wishlistItems, toggleWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    
    const [isMounted, setIsMounted] = useState(false);

    const isSaved = wishlistItems.some(item => item._id === id);

    const fetchProduct = async () => {
        try { setLoading(true); const { data } = await apiClient.get(`/api/products/${id}`); setProduct(data); } 
        catch (err) { setError('Product not found or failed to load.'); } 
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchProduct();
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, [id]);

    const handleAddToCart = () => { if (!isAuthenticated) return navigate('/auth'); if (product) addToCart(product, quantity); };
    const handleBuyNow = () => { if (!isAuthenticated) return navigate('/auth'); if (product) { addToCart(product, quantity); navigate('/checkout'); } };
    const handleReviewSubmit = async ({ rating, comment }) => { try { await apiClient.post(`/api/products/${id}/reviews`, { rating, comment }, { headers: { Authorization: `Bearer ${user.token}` }}); toast.success("Review submitted!"); fetchProduct(); } catch (error) { toast.error(error.response?.data?.message || "Failed to submit review."); } };

    if (loading) return <div className="flex justify-center items-center min-h-screen text-xl"> <Spinner/> </div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">Error: {error}</div>;
    if (!product) return null;

    const whatsappOrderMessage = `Hello, I want to order: ${quantity} KG of ${product.name} (SKU: ${product.sku}).`;
    
    // === FIX #1: Hardcoded number ko .env variable se replace kiya gaya hai ===
    const whatsappOrderUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappOrderMessage)}`;

    return (
        <>
            <div className="container mx-auto px-4 pt-6 mt-10 pb-16 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div className="lg:col-span-3 hidden lg:flex flex-col items-center gap-8 pt-1">
                        <PrimaryAdBanner />
                        <SecondaryAdBanner />
                        <ThirdAdBanner />
                        <FourthAdBanner />
                    </div>

                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            
                            <div className={`w-full bg-white p-2 sm:p-4 rounded-lg flex justify-center items-center border transition-all duration-700 ease-out transform ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                                <img src={product.imageUrl} alt={product.name} className="w-full max-w-md h-auto object-contain rounded-md transition-transform duration-300 hover:scale-105" />
                            </div>
                            
                            <div className={`flex flex-col gap-4 transition-all duration-700 ease-out transform delay-200 ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{product.name}</h1>
                                <p><span className="font-semibold">Availability:</span> <span className={`ml-2 font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
                                <p className="text-3xl font-bold text-gray-900">Rs. {product.price.toLocaleString()}</p>
                                
                                <div>
                                    <p className="font-semibold mb-2">Quantity:</p>
                                    <div className="flex items-center border rounded-md w-fit">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-1 text-xl font-bold hover:bg-gray-100 rounded-l-md">-</button>
                                        <span className="px-5 py-1 text-lg font-semibold">{quantity} KG</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-1 text-xl font-bold hover:bg-gray-100 rounded-r-md">+</button>
                                    </div>
                                </div>
                                
                                <div className="flex items-stretch gap-2">
                                    <button onClick={() => toggleWishlist(product)} title="Save to Wishlist" className="flex-shrink-0 flex items-center justify-center p-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all duration-300 transform hover:scale-110">
                                        <FaHeart size={24} className={`transition-colors ${isSaved ? 'text-red-500' : 'text-gray-500'}`}/>
                                    </button>
                                    <button onClick={handleAddToCart} className="flex-grow flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                        <FaShoppingBag /> Add To Cart
                                    </button>
                                </div>
                                <button onClick={handleBuyNow} className="w-full bg-green-700 text-white font-bold py-3 px-4 rounded-md hover:bg-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                    Buy Now
                                </button>
                                
                                <p className="text-sm text-gray-600"><span className="font-semibold">SKU:</span> {product.sku}</p>
                                <div>
                                    <p className="font-semibold mb-2">Need Help? Order Directly:</p>
                                    <a href={whatsappOrderUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600">
                                        <FaWhatsapp size={20} /> Order On WhatsApp
                                    </a>
                                </div>
                                <div className="mt-2 p-3 border rounded-lg bg-gray-50 text-center">
                                    <p className="font-semibold text-gray-600 text-sm">Guaranteed Safe And Secure Checkout</p>
                                </div>
                            </div>
                        </div>
                        
                        {product && <ProductTabs product={product} onReviewSubmit={handleReviewSubmit} />}
                    </div>
                </div>
            </div>
            
            {/* === FIX #2: Hardcoded number ko .env variable se replace kiya gaya hai === */}
            <FloatingWhatsAppButton phoneNumber={import.meta.env.VITE_WHATSAPP_NUMBER} />
        </>
    );
};

export default ProductDetailPage;