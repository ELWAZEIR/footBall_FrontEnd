import { useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface Player {
  _id: string;
  fullName: string;
  birthYear: number;
  parentPhone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface UsePlayersReturn {
  players: Player[];
  loading: boolean;
  error: string | null;
  createPlayer: (data: Omit<Player, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePlayer: (id: string, data: Partial<Player>) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  refreshPlayers: () => Promise<void>;
}

export const usePlayers = (): UsePlayersReturn => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/players');
      setPlayers(response.data.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'فشل في تحميل اللاعبين';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createPlayer = async (data: Omit<Player, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await api.post('/players', data);
      const newPlayer = response.data.data;
      setPlayers(prev => [newPlayer, ...prev]);
      toast.success(response.data.message || 'تم إضافة اللاعب بنجاح');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'فشل في إضافة اللاعب';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePlayer = async (id: string, data: Partial<Player>) => {
    try {
      setLoading(true);
      const response = await api.put(`/players/${id}`, data);
      const updatedPlayer = response.data.data;
      setPlayers(prev => 
        prev.map(player => 
          player._id === id ? updatedPlayer : player
        )
      );
      toast.success(response.data.message || 'تم تحديث اللاعب بنجاح');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'فشل في تحديث اللاعب';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/players/${id}`);
      setPlayers(prev => prev.filter(player => player._id !== id));
      toast.success('تم حذف اللاعب بنجاح');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'فشل في حذف اللاعب';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshPlayers = async () => {
    await fetchPlayers();
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return {
    players,
    loading,
    error,
    createPlayer,
    updatePlayer,
    deletePlayer,
    refreshPlayers,
  };
};
