import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Users } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      console.log('FormData:', formData);
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;
      
      login(token, user);
      
      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/subscriptions');
      }
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.error || 'Login failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Football Academy</h1>
          <p className="text-gray-600 mt-2">Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="Enter your password"
          />

          {errors.submit && (
            <div className="text-red-600 text-sm text-center">
              {errors.submit}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center">
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p>Admin: admin@academy.com / admin123</p>
            <p>Coach: coach@academy.com / coach123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;