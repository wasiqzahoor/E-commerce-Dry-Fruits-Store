import React, { useState, useEffect } from 'react';
import apiClient from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
const AdminPromotionsPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    
    // Form state for new promotion
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const fetchPromotions = async () => {
        try {
            const { data } = await apiClient.get('/api/admin/promotions', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setPromotions(data);
        } catch (error) {
            toast.error("Failed to fetch promotions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/api/admin/promotions', { title, videoUrl }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            toast.success("Promotion created successfully.");
            setTitle('');
            setVideoUrl('');
            fetchPromotions();
        } catch (error) {
            toast.error("Failed to create promotion.");
        }
    };

    const handleDelete = async (promoId) => {
        if (window.confirm("Are you sure?")) {
            try {
                await apiClient.delete(`/api/admin/promotions/${promoId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                toast.success("Promotion deleted.");
                fetchPromotions();
            } catch (error) {
                toast.error("Failed to delete.");
            }
        }
    };

    const handleToggle = async (promoId) => {
        try {
            await apiClient.put(`/api/admin/promotions/${promoId}/toggle`, {}, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            toast.success("Status updated.");
            fetchPromotions();
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Manage Promotions</h1>
            
            {/* Create Promotion Form */}
            <form onSubmit={handleCreate} className="mb-8 p-6 bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Promotion Title" required className="w-full p-2 border rounded col-span-1" />
                <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="YouTube URL or direct video link (.mp4)" required className="w-full p-2 border rounded col-span-1" />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 col-span-1">Add Promotion</button>
            </form>

            {/* Promotions List */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="p-4 border-b">Title</th>
                            <th className="p-4 border-b">Video URL</th>
                            <th className="p-4 border-b">Status</th>
                            <th className="p-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center">
                                    <Spinner />
                                </td>
                            </tr>
                        ) : promotions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500 h-32">
                                    No promotions found.
                                </td>
                            </tr>
                        ) : null}
                        {promotions.map(promo => (
                            <tr key={promo._id}>
                                <td className="p-4 border-b">{promo.title}</td>
                                <td className="p-4 border-b text-sm font-mono">{promo.videoUrl}</td>
                                <td className="p-4 border-b">
                                    <button onClick={() => handleToggle(promo._id)} title="Toggle Status">
                                        {promo.isActive ? <FaToggleOn size={24} className="text-green-500" /> : <FaToggleOff size={24} className="text-gray-400" />}
                                    </button>
                                </td>
                                <td className="p-4 border-b">
                                    <button onClick={() => handleDelete(promo._id)} className="text-red-500 p-2 rounded-full hover:bg-red-100">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminPromotionsPage;