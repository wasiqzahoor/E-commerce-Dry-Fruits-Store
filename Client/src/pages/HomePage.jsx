import React, { useState, useEffect } from 'react';
import apiClient from '../api/api';
import ProductList from '../components/ProductList';
import HeroSlider from '../components/HeroSlider';
import TextMarquee from '../components/Marquee';
import FeaturesBar from '../components/FeaturesBar';

// Video URL se ID nikalne aur type pehchanne wala function
const getVideoInfo = (url) => {
    let videoId = '';
    let isShort = false;

    if (url.includes('/shorts/')) {
        videoId = url.split('/shorts/')[1].split('?')[0];
        isShort = true;
    } 
    else if (url.includes('watch?v=') || url.includes('youtu.be/') || url.includes('/embed/')) {
        if (url.includes('watch?v=')) videoId = url.split('watch?v=')[1].split('&')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
        else if (url.includes('/embed/')) videoId = url.split('/embed/')[1].split('?')[0];
    }

    if (videoId) {
        return {
            type: isShort ? 'youtube-short' : 'youtube-regular',
            url: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&autohide=1`
        };
    }

    return {
        type: 'direct',
        url: url
    };
};

// Ad Sidebar Component
const AdSidebar = ({ promotions }) => (
    <aside className="space-y-6">
        {promotions.map(promo => {
            const videoInfo = getVideoInfo(promo.videoUrl);
            const aspectRatioClass = videoInfo.type === 'youtube-short' 
                ? 'aspect-w-9 aspect-h-16'
                : 'aspect-w-16 aspect-h-9';

            return (
                <div 
                    key={promo._id} 
                    className={`${aspectRatioClass} rounded-lg overflow-hidden shadow-lg bg-black mx-auto max-w-sm`}
                >
                    {videoInfo.type.startsWith('youtube') ? (
                        <iframe 
                            src={videoInfo.url}
                            title={promo.title}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            // responsive video ke liye classes
                            className="w-full h-full object-cover"
                        ></iframe>
                    ) : (
                        <video
                            src={videoInfo.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            )
        })}
    </aside>
);

// === RESPONSIVE HOMEPAGE COMPONENT ===
const HomePage = () => {
    const [promotions, setPromotions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                const { data } = await apiClient.get('/api/homepage');
                setPromotions(data.promotions);
                setCategories(['All', ...data.categories]);
            } catch (err) {
                console.error("Failed to load homepage data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHomePageData();
    }, []);

    return (
        <div className="homepage bg-gradient-to-b from-amber-50 to-white p-0">
            <HeroSlider />
            <TextMarquee />

            {/* Section ki padding mobile ke liye kam ki gayi hai */}
            <section className="py-8 px-4 md:py-16 md:px-6 max-w-7xl mx-auto">
                {/* Heading ka size mobile ke liye adjust kiya gaya hai */}
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-800 relative pb-3">
                    Explore Our Premium Selection
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-amber-500 rounded-full"></span>
                </h2>
                {/* Paragraph ka margin mobile ke liye kam kiya gaya hai */}
                <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8 md:mb-10">
                    Discover the finest dry fruits sourced directly from the fertile valleys of Gilgit, packed with natural goodness and flavor.
                </p>
                
                {/* Category Filters, mobile ke liye margin adjust kiya hai */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
                    {categories.map(category => (
                        <button 
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            /* Button styling mobile ke liye thori compact ki gayi hai */
                            className={`px-4 py-2 md:px-5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${activeCategory === category 
                                ? 'bg-emerald-600 text-white shadow-lg scale-105' 
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                
                {/* Main Content Layout - Mobile par column, bari screen par row */}
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                    
                    {/* Products List (Main Area) - Mobile par poori width lega */}
                    {/* 'lg:w-3/4' class add ki gayi hai taake bari screen par 75% jagah le */}
                    <div className="w-full lg:w-3/4">
                        <ProductList filterCategory={activeCategory} />
                    </div>
                    
                    {/* === AD SIDEBAR - MOBILE PAR HIDE KAR DIYA GAYA HAI === */}
                    {/* 'hidden' se mobile par hide hoga aur 'lg:block' se bari screen par dikhega */}
                    <div className="w-full lg:w-1/4 hidden lg:block">
                        {!loading && <AdSidebar promotions={promotions} />}
                        {/* Ye images bhi Ad Sidebar ke sath hi hide ho jayengi */}
                        <img src="https://www.khandryfruit.com/cdn/shop/files/BANNER-ALMOND2_copy.webp?v=1712575854" alt="Almond Banner" className='h-auto w-full mt-10 rounded-lg shadow-md' />
                        <img src="https://www.khandryfruit.com/cdn/shop/files/untitled-design-2025-08-16t215814955-68a0b8c76cde1.webp?v=1755363617" alt="Promotional Banner" className='h-auto w-full mt-10 rounded-lg shadow-md' />
                    </div>
                </div>
            </section>
            
            {/* Features Bar Section */}
            <section className='mb-10 px-4'>
                <FeaturesBar />
            </section>
        </div>
    );
};

export default HomePage;