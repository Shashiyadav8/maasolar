import axios from 'axios';

// In production (when hosted on Render together), the frontend and backend are on the same domain
// In development, we use Vite's proxy or hardcode localhost.
const api = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api',
});

export default api;
