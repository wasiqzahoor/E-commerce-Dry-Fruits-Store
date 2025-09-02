import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Spinner from '../../components/Spinner';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiBox, FiUsers } from 'react-icons/fi';

// Chart.js ko register karna zaroori hai
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Reusable Stat Card component
const StatCard = ({ icon, title, value, colorClass }) => (
    // Yahan se width, min-width, aur flex-shrink-0 hata diya hai.
    <div className={`p-4 sm:p-6 ${colorClass} text-white rounded-xl shadow-lg`}>
        <div className="flex items-center gap-4">
            <div className="text-3xl bg-white/20 p-3 rounded-full">{icon}</div>
            <div>
                <p className="text-md sm:text-lg">{title}</p>
                <p className="text-2xl sm:text-3xl font-bold">{value}</p>
            </div>
        </div>
    </div>
);

// Helper function to get color class based on status
const getStatusClass = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await apiClient.get('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setStats(data);
            } catch (err) {
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        if (user?.token) {
            fetchStats();
        }
    }, [user?.token]);

    const chartData = {
        labels: stats?.dailySales.map(d => new Date(d._id).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })) || [],
        datasets: [{
            label: 'Daily Sales (Rs.)',
            data: stats?.dailySales.map(d => d.dailyTotal) || [],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.3,
            fill: true,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { ticks: { callback: value => `Rs. ${value / 1000}k` } }
        }
    };

    if (loading) return <div className="text-center p-10"><Spinner /></div>;
    if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div 
            className='space-y-8 mt-10'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl font-bold">Admin Dashboard</motion.h1>
            
            {/* --- Stat Cards (Mobile Responsive) --- */}
             <motion.div variants={itemVariants}>
                {/* Is container ko "grid" bana diya hai taake yeh fixed rahe */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard icon={<FiTrendingUp />} title="Total Sales" value={`Rs. ${stats.totalSales.toLocaleString()}`} colorClass="bg-emerald-500" />
                    <StatCard icon={<FiBox />} title="Total Orders" value={stats.totalOrders} colorClass="bg-sky-500" />
                    <StatCard icon={<FiUsers />} title="Total Users" value={stats.totalUsers} colorClass="bg-amber-500" />
                </div>
            </motion.div>

            {/* --- Sales Chart --- */}
            <motion.div variants={itemVariants} className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Sales Performance (Last 7 Days)</h2>
                <div className="h-72">
                    <Line options={chartOptions} data={chartData} />
                </div>
            </motion.div>

            {/* --- Recent Orders Table (Mobile Responsive) --- */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                    <h2 className="text-lg sm:text-xl font-bold">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-emerald-600 hover:underline font-semibold text-sm">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4 font-semibold">Order ID</th>
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Total</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats.recentOrders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono text-xs">{order._id.substring(order._id.length - 8)}</td>
                                    <td className="p-4 text-gray-700 whitespace-nowrap">{order.customerDetails.email}</td>
                                    <td className="p-4 font-semibold">Rs. {order.totalPrice}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboardPage;