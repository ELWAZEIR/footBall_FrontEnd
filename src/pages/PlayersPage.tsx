import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePlayers } from '../hooks/usePlayers';
import { useModal } from '../hooks/useModal';
import { useFilters } from '../hooks/useFilters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import PlayerForm from '../components/players/PlayerForm';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const PlayersPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    players,
    isLoading,
    savePlayer,
    deletePlayer,
  } = usePlayers();

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { filters, updateFilter } = useFilters();
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    birthYear: '',
    parentPhone: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await savePlayer(formData, editingPlayer);
      closeModal();
      resetForm();
    } catch (error) {
      console.error('Error saving player:', error);
      alert('Error saving player. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (player: any) => {
    setEditingPlayer(player);
    setFormData({
      fullName: player.fullName,
      birthYear: player.birthYear.toString(),
      parentPhone: player.parentPhone,
      notes: player.notes || '',
    });
    openModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await deletePlayer(id);
      } catch (error) {
        console.error('Error deleting player:', error);
        alert('Error deleting player. Please try again.');
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

  const handleModalClose = () => {
    closeModal();
    resetForm();
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.fullName.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesYear = !filters.filterYear || player.birthYear.toString() === filters.filterYear;
    
    return matchesSearch && matchesYear;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Players</p>
              <p className="text-2xl font-bold text-gray-900">{players.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Edit className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Players</p>
              <p className="text-2xl font-bold text-gray-900">{players.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by player name..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filters.filterYear}
            onChange={(e) => updateFilter('filterYear', e.target.value)}
            options={[
              { value: '', label: 'All Years' },
              { value: '2020', label: '2020' },
              { value: '2021', label: '2021' },
              { value: '2022', label: '2022' },
              { value: '2010', label: '2010' },
              { value: '2011', label: '2011' },
              { value: '2012', label: '2012' },
              { value: '2013', label: '2013' },
              { value: '2014', label: '2014' },
              { value: '2015', label: '2015' },
              { value: '2016', label: '2016' },
              { value: '2017', label: '2017' },
              { value: '2018', label: '2018' },
              { value: '2019', label: '2019' },
            ]}
          />
          {user?.role === 'ADMIN' && (
            <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          )}
        </div>
      </Card>

      {/* Players Table */}
      {filteredPlayers.length === 0 ? (
        <EmptyState
          title="No players found"
          description="Try adjusting your search or add a new player."
          action={
            user?.role === 'ADMIN' && (
              <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            )
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Birth Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  {user?.role === 'ADMIN' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers.map((player) => (
                  <tr key={player._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {player.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {player.birthYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {player.parentPhone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {player.notes || '-'}
                      </div>
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(player)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                                                     <Button
                             variant="secondary"
                             size="sm"
                             onClick={() => handleDelete(player._id!)}
                             className="text-red-600 hover:text-red-700"
                           >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal for Adding/Editing Players */}
      {user?.role === 'ADMIN' && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingPlayer ? 'Edit Player' : 'Add New Player'}
        >
          <PlayerForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
};

export default PlayersPage;