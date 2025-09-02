import React from 'react';
// Hum react-icons se zaroori icons import kareinge
import { FaShippingFast, FaUndoAlt, FaHeadset, FaEnvelopeOpenText, FaBoxOpen } from 'react-icons/fa';

// Data ko ek array mein rakhne se code saaf rehta hai aur isay badalna aasan hota hai
const features = [
  {
    icon: <FaShippingFast />,
    title: 'Fast Shipping',
    subtitle: 'Shipped in 1-3 Days',
  },
  {
    icon: <FaUndoAlt />,
    title: 'Free Returns',
    subtitle: '7-Day Money Back',
  },
  {
    icon: <FaHeadset />,
    title: 'Help & Support',
    subtitle: '24/7 Phone & Email',
  },
  {
    icon: <FaEnvelopeOpenText />,
    title: 'Join Newsletter',
    subtitle: 'Get The Latest Offers',
  },
  {
    icon: <FaBoxOpen />,
    title: 'Free Delivery',
    subtitle: 'On Orders Over Rs. 2,500',
  },
];

const FeaturesBar = () => {
  return (
    <div className="bg-stone-100 border-y border-gray-200">
      <div className="container mx-auto px-6 py-8">
        {/* Hum Grid layout istemal kareinge taake ye responsive rahe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center md:text-left">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center md:justify-start gap-4">
              <div className="text-4xl text-emerald-600">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesBar;