import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Animation variants for the container (stagger effect)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Har child ke darmiyan 0.2s ka delay
    },
  },
};

// Animation variants for individual items (fade in from bottom)
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-gray-300 overflow-hidden">
      <motion.div 
        className="container mx-auto px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Animation tab trigger ho jab 30% footer view mein ho
      >
        {/* === TABDEELI YAHAN KI GAI HAI === */}
        {/* Grid ab mobile par 2 columns ka hai */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          
          {/* Column 1: Brand & About */}
          {/* Isko mobile aur tablet par poori width di gai hai (col-span-2) */}
          <motion.div variants={itemVariants} className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="https://i.ibb.co/ksN5ztJX/Gilgit-Dry-Fruits-Logo-Design.png" alt="Logo" className="w-12 h-12 rounded-full" />
              <span className="text-xl font-bold text-white">Gilgit Dry Fruits</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Sourced directly from the pristine valleys of Gilgit, we bring you the finest quality, 100% organic dry fruits, packed with nature's goodness.
            </p>
          </motion.div>

          {/* Column 2: Quick Links */}
          {/* Yeh mobile par 1 column lega */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-amber-400 transition-colors duration-300">Home</Link></li>
              <li><Link to="/cart" className="hover:text-amber-400 transition-colors duration-300">Your Cart</Link></li>
              <li><Link to="/my-orders" className="hover:text-amber-400 transition-colors duration-300">My Orders</Link></li>
              <li><Link to="/saved-items" className="hover:text-amber-400 transition-colors duration-300">Wishlist</Link></li>
            </ul>
          </motion.div>

          {/* Column 3: Help & Support */}
          {/* Yeh mobile par 1 column lega */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="hover:text-amber-400 transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-amber-400 transition-colors duration-300">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-amber-400 transition-colors duration-300">Shipping Information</Link></li>
            </ul>
          </motion.div>

          {/* Column 4: Contact Us */}
          {/* Isko bhi mobile aur tablet par poori width di gai hai (col-span-2) */}
          <motion.div variants={itemVariants} className="col-span-2 lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-amber-400 flex-shrink-0" />
                <span>Main Bazaar, Gilgit City, Gilgit-Baltistan, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-amber-400" />
                <a href="tel:+923049996000" className="hover:text-amber-400 transition-colors duration-300">+92 304 9996000</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-400" />
                <a href="mailto:support@gilgitdryfruits.com" className="hover:text-amber-400 transition-colors duration-300">support@gilgitdryfruits.com</a>
              </li>
            </ul>
            {/* Social Media Icons */}
            <div className="flex gap-4 mt-6">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-amber-400 transition-transform hover:scale-110 duration-300"><FaFacebookF /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-amber-400 transition-transform hover:scale-110 duration-300"><FaInstagram /></a>
              <a href="https://wa.me/923049996000" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-amber-400 transition-transform hover:scale-110 duration-300"><FaWhatsapp /></a>
            </div>
          </motion.div>
          
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="bg-emerald-950 py-4">
        <div className="container mx-auto px-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Gilgit Dry Fruits. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;