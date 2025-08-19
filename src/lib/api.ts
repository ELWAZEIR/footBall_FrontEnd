import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000, // 10 seconds timeout
});

// ➕ أضف التوكين إلى كل الطلبات
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-storage');
  if (raw) {
    try {
      const { state } = JSON.parse(raw);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (err) {
      console.error('Token parse error:', err);
    }
  }
  return config;
});

// تحسين error handling مع toast notifications
api.interceptors.response.use(
  (response) => {
    // إظهار toast للنجاح في العمليات المهمة
    if (response.config.method !== 'get' && response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.error || 'حدث خطأ ما';
    
    // إظهار toast للخطأ
    toast.error(message);
    
    // إعادة توجيه للـ login في حالة 401
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
