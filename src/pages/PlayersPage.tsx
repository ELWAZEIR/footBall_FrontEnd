import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface Player {
    _id?: string;
  fullName: string;
  birthYear: number;
  parentPhone: string;
  notes?: string;
  createdAt: string;
}

const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    birthYear: '',
    parentPhone: '',
    notes: '',
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        birthYear: parseInt(formData.birthYear),
      };

      if (editingPlayer) {
        // await api.put(`/players/${editingPlayer._id}`, data);
        await api.put(`/players/${(editingPlayer as any)._id}`, data);
      } else {
        await api.post('/players', data);
      }

      fetchPlayers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      fullName: player.fullName,
      birthYear: player.birthYear.toString(),
      parentPhone: player.parentPhone,
      notes: player.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await api.delete(`/players/${id}`);
        fetchPlayers();
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      birthYear: '',
      parentPhone: '',
      notes: '',
    });
    setEditingPlayer(null);
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.parentPhone.includes(searchTerm);
    const matchesYear = filterYear === '' || player.birthYear.toString() === filterYear;
    return matchesSearch && matchesYear;
  });

  const birthYearOptions = Array.from(new Set(players.map(p => p.birthYear)))
    .sort((a, b) => b - a)
    .map(year => ({ value: year.toString(), label: year.toString() }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            options={[
              { value: '', label: 'All Years' },
              ...birthYearOptions,
            ]}
          />
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Player
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-600">Full Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Birth Year</th>
                <th className="text-left p-4 font-medium text-gray-600">Parent Phone</th>
                <th className="text-left p-4 font-medium text-gray-600">Notes</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr key={player._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{player.fullName}</td>
                  <td className="p-4 text-gray-600">{player.birthYear}</td>
                  <td className="p-4 text-gray-600">{player.parentPhone}</td>
                  <td className="p-4 text-gray-600">{player.notes || '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(player)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(player._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingPlayer ? 'Edit Player' : 'Add New Player'}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingPlayer ? 'Update' : 'Add'} Player
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            required
          />
          <Select
            label="Birth Year"
            value={formData.birthYear}
            onChange={(e) => setFormData(prev => ({ ...prev, birthYear: e.target.value }))}
            options={[
              { value: '', label: 'Select Year' },
              ...Array.from({ length: 8 }, (_, i) => ({
                value: (2017 - i).toString(),
                label: (2017 - i).toString(),
              })),
            ]}
            required
          />
          <Input
            label="Parent Phone"
            value={formData.parentPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
            required
          />
          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Optional notes about the player"
          />
        </form>
      </Modal>
    </div>
  );
};

export default PlayersPage;