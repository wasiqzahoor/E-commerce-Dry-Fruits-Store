import React, { useState, useEffect } from 'react';
import apiClient from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added an error state
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Ensure loading is true before fetch
      setError(null); // Clear any previous errors
      try {
        const { data } = await apiClient.get('/api/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user.token]); // Added user.token to the dependency array

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b">ID</th>
              <th className="p-4 border-b">NAME</th>
              <th className="p-4 border-b">EMAIL</th>
              <th className="p-4 border-b">ROLE</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-10">
                  <Spinner />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center p-10 text-red-500">
                  {error}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-10">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-4 border-b text-sm">{u._id}</td>
                  <td className="p-4 border-b">{u.name}</td>
                  <td className="p-4 border-b">{u.email}</td>
                  <td className="p-4 border-b">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.role === 'admin' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserListPage;