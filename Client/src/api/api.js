import axios from 'axios';

// Ek naya axios instance banayein
const apiClient = axios.create({
  // Backend ka base URL environment variable se uthayein
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default apiClient;