import { useState, useEffect, useMemo } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface Player {
  _id: string;
  fullName: string;
  birthYear: number;
  parentPhone: string;
}

interface Subscription {
  _id: string;
  playerId: Player; 
  month: string;
  hasPaid: boolean;
  paymentDate?: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface UseSubscriptionsReturn {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  createSubscription: (
    data: Omit<Subscription, '_id' | 'playerId' | 'createdAt' | 'updatedAt'> & { playerId: string }
  ) => Promise<void>;
  updateSubscription: (
    id: string,
    data: Partial<Omit<Subscription, 'playerId'>> & { playerId?: string }
  ) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  refreshSubscriptions: () => Promise<void>;
  totalIncome: number;
  overdueSubscriptions: Subscription[];
  isOverdue: (subscription: Subscription) => boolean;
  players: Player[];
}

export const useSubscriptions = (): UseSubscriptionsReturn => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/subscriptions');
      setSubscriptions(response.data.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'فشل في تحميل الاشتراكات';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data.data || []);
    } catch (err: any) {
      toast.error('فشل في تحميل اللاعبين');
    }
  };

  const createSubscription = async (
    data: Omit<Subscription, '_id' | 'playerId' | 'createdAt' | 'updatedAt'> & { playerId: string }
  ) => {
    try {
      setLoading(true);
      const response = await api.post('/subscriptions', data);
      const newSubscription = response.data.data;
      setSubscriptions(prev => [newSubscription, ...prev]);
      toast.success(response.data.message || 'تم إضافة الاشتراك بنجاح');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'فشل في إضافة الاشتراك';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (
    id: string,
    data: Partial<Omit<Subscription, 'playerId'>> & { playerId?: string }
  ) => {
    try {
      setLoading(true);
      const response = await api.put(`/subscriptions/${id}`, data);
      const updatedSubscription = response.data.data;
      setSubscriptions(prev =>
        prev.map(subscription =>
          subscription._id === id ? updatedSubscription : subscription
        )
      );
      toast.success(response.data.message || 'تم تحديث الاشتراك بنجاح');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'فشل في تحديث الاشتراك';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/subscriptions/${id}`);
      setSubscriptions(prev => prev.filter(subscription => subscription._id !== id));
      toast.success('تم حذف الاشتراك بنجاح');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'فشل في حذف الاشتراك';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscriptions = async () => {
    await fetchSubscriptions();
  };

  const isOverdue = (subscription: Subscription) => {
    if (subscription.hasPaid) return false;
    const today = new Date();
    const monthDate = new Date(subscription.month);
    return monthDate < today;
  };

  const totalIncome = useMemo(() => {
    return subscriptions
      .filter(sub => sub.hasPaid)
      .reduce((sum, sub) => sum + sub.amount, 0);
  }, [subscriptions]);

  const overdueSubscriptions = useMemo(() => {
    return subscriptions.filter(isOverdue);
  }, [subscriptions]);

  useEffect(() => {
    fetchSubscriptions();
    fetchPlayers();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    refreshSubscriptions,
    totalIncome,
    overdueSubscriptions,
    isOverdue,
    players,
  };
};
