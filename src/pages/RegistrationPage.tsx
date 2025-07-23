import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { Plus, Edit, Search, CheckCircle, XCircle, FileText, User } from 'lucide-react';

interface Registration {
  _id: string;
  playerId: string;
  hasPaid: boolean;
  hasSubmittedDocs: boolean;
  amount: number;
  paymentDate?: string;
  player: {
    _id: string;
    fullName: string;
    birthYear: number;
    parentPhone?: string;
    notes?: string;
  };
  createdAt: string;
}

interface Player {
  _id: string;
  fullName: string;
  birthYear: number;
  parentPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PlayerWithRegistrationStatus extends Player {
  hasRegistration: boolean;
  registrationData?: Registration;
  registrationStatus: 'registered' | 'not-registered' | 'incomplete';
}

const RegistrationPage: React.FC = () => {
  const { user } = useAuthStore();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersWithStatus, setPlayersWithStatus] = useState<PlayerWithRegistrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [viewMode, setViewMode] = useState<'registrations' | 'all-players'>('registrations');
  const [formData, setFormData] = useState({
    playerId: '',
    hasPaid: false,
    hasSubmittedDocs: false,
  });

  useEffect(() => {
    fetchRegistrations();
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      generatePlayersWithStatus();
    }
  }, [players, registrations]);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/registrations');
      setRegistrations(response.data);
      console.log('Fetched registrations:', response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
      console.log('Fetched players:', response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePlayersWithStatus = () => {
    const playersWithStatusData: PlayerWithRegistrationStatus[] = players.map(player => {
      // العثور على تسجيل هذا اللاعب
      const playerRegistration = registrations.find(reg => reg.player._id === player._id || reg.playerId === player._id);
      
      let registrationStatus: 'registered' | 'not-registered' | 'incomplete' = 'not-registered';
      let hasRegistration = false;

      if (playerRegistration) {
        hasRegistration = true;
        
        if (playerRegistration.hasPaid && playerRegistration.hasSubmittedDocs) {
          registrationStatus = 'registered';
        } else {
          registrationStatus = 'incomplete';
        }
      }

      return {
        ...player,
        hasRegistration,
        registrationData: playerRegistration,
        registrationStatus
      };
    });

    setPlayersWithStatus(playersWithStatusData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.playerId) {
      alert('Please select a player.');
      return;
    }

    try {
      const data = {
        ...formData,
        amount: 500, // Fixed registration fee
      };

      if (editingRegistration) {
        await api.put(`/registrations/${editingRegistration._id}`, data);
      } else {
        await api.post('/registrations', data);
      }

      fetchRegistrations();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Error saving registration. Please try again.');
    }
  };

  const handleEdit = (registration: Registration) => {
    setEditingRegistration(registration);
    setFormData({
      playerId: registration.playerId,
      hasPaid: registration.hasPaid,
      hasSubmittedDocs: registration.hasSubmittedDocs,
    });
    setIsModalOpen(true);
  };

  const handleAddRegistrationForPlayer = (playerId: string) => {
    setFormData({
      playerId: playerId,
      hasPaid: false,
      hasSubmittedDocs: false,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      playerId: '',
      hasPaid: false,
      hasSubmittedDocs: false,
    });
    setEditingRegistration(null);
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || 
                         (filterStatus === 'paid' && registration.hasPaid) ||
                         (filterStatus === 'unpaid' && !registration.hasPaid) ||
                         (filterStatus === 'docs-submitted' && registration.hasSubmittedDocs) ||
                         (filterStatus === 'docs-pending' && !registration.hasSubmittedDocs) ||
                         (filterStatus === 'complete' && registration.hasPaid && registration.hasSubmittedDocs) ||
                         (filterStatus === 'incomplete' && (!registration.hasPaid || !registration.hasSubmittedDocs));
    const matchesYear = filterYear === '' || registration.player.birthYear.toString() === filterYear;
    return matchesSearch && matchesStatus && matchesYear;
  });

  const filteredPlayers = playersWithStatus.filter(player => {
    const matchesSearch = player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || 
                         (filterStatus === 'registered' && player.registrationStatus === 'registered') ||
                         (filterStatus === 'not-registered' && player.registrationStatus === 'not-registered') ||
                         (filterStatus === 'incomplete' && player.registrationStatus === 'incomplete');
    const matchesYear = filterYear === '' || player.birthYear.toString() === filterYear;
    return matchesSearch && matchesStatus && matchesYear;
  });

  const totalIncome = registrations
    .filter(reg => reg.hasPaid)
    .reduce((total, reg) => total + reg.amount, 0);

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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Players</p>
              <p className="text-2xl font-bold text-blue-600">{players.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{totalIncome.toLocaleString()} EGP</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payment</p>
              <p className="text-2xl font-bold text-red-600">
                {registrations.filter(r => !r.hasPaid).length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Docs Submitted</p>
              <p className="text-2xl font-bold text-blue-600">
                {registrations.filter(r => r.hasSubmittedDocs).length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Docs</p>
              <p className="text-2xl font-bold text-yellow-600">
                {registrations.filter(r => !r.hasSubmittedDocs).length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === 'registrations' ? 'primary' : 'secondary'}
          onClick={() => setViewMode('registrations')}
        >
          Registrations View
        </Button>
        <Button
          variant={viewMode === 'all-players' ? 'primary' : 'secondary'}
          onClick={() => setViewMode('all-players')}
        >
          All Players View
        </Button>
      </div>

      {/* Filters and Search */}
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={
              viewMode === 'registrations' ? [
                { value: '', label: 'All Status' },
                { value: 'complete', label: 'Complete' },
                { value: 'incomplete', label: 'Incomplete' },
                { value: 'paid', label: 'Paid' },
                { value: 'unpaid', label: 'Unpaid' },
                { value: 'docs-submitted', label: 'Docs Submitted' },
                { value: 'docs-pending', label: 'Docs Pending' },
              ] : [
                { value: '', label: 'All Status' },
                { value: 'registered', label: 'Fully Registered' },
                { value: 'incomplete', label: 'Incomplete Registration' },
                { value: 'not-registered', label: 'Not Registered' },
              ]
            }
          />
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            options={[
              { value: '', label: 'All Years' },
              ...birthYearOptions,
            ]}
          />
        </div>
        {user?.role === 'ADMIN' && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Registration
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-600">Player</th>
                <th className="text-left p-4 font-medium text-gray-600">Birth Year</th>
                <th className="text-left p-4 font-medium text-gray-600">Phone</th>
                <th className="text-left p-4 font-medium text-gray-600">Notes</th>
                {viewMode === 'registrations' ? (
                  <>
                    <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-600">Payment</th>
                    <th className="text-left p-4 font-medium text-gray-600">Documents</th>
                    <th className="text-left p-4 font-medium text-gray-600">Payment Date</th>
                  </>
                ) : (
                  <>
                    <th className="text-left p-4 font-medium text-gray-600">Registration Status</th>
                    <th className="text-left p-4 font-medium text-gray-600">Details</th>
                  </>
                )}
                {user?.role === 'ADMIN' && (
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {viewMode === 'registrations' ? (
                // Registrations View
                filteredRegistrations.map((registration) => (
                  <tr 
                    key={registration._id} 
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium text-gray-800">{registration.player.fullName}</td>
                    <td className="p-4 text-gray-600">{registration.player.birthYear}</td>
                    <td className="p-4 text-gray-600">{registration.player.parentPhone || '-'}</td>
                    <td className="p-4 text-gray-600">{registration.player.notes || '-'}</td>
                    <td className="p-4 text-gray-600">{registration.amount.toLocaleString()} EGP</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        registration.hasPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {registration.hasPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        registration.hasSubmittedDocs 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {registration.hasSubmittedDocs ? 'Submitted' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {registration.paymentDate 
                        ? new Date(registration.paymentDate).toLocaleDateString()
                        : '-'
                      }
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td className="p-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(registration)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                // All Players View
                filteredPlayers.map((player) => (
                  <tr 
                    key={player._id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      player.registrationStatus === 'not-registered' ? 'bg-red-50' : 
                      player.registrationStatus === 'incomplete' ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="p-4 font-medium text-gray-800">{player.fullName}</td>
                    <td className="p-4 text-gray-600">{player.birthYear}</td>
                    <td className="p-4 text-gray-600">{player.parentPhone || '-'}</td>
                    <td className="p-4 text-gray-600">{player.notes || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        player.registrationStatus === 'registered' 
                          ? 'bg-green-100 text-green-800' 
                          : player.registrationStatus === 'incomplete'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {player.registrationStatus === 'registered' ? 'Fully Registered' : 
                         player.registrationStatus === 'incomplete' ? 'Incomplete' : 'Not Registered'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {player.registrationData 
                        ? `Payment: ${player.registrationData.hasPaid ? 'Yes' : 'No'}, Docs: ${player.registrationData.hasSubmittedDocs ? 'Yes' : 'No'}`
                        : 'No registration data'
                      }
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td className="p-4 space-x-2">
                        {player.registrationData && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(player.registrationData!)}
                            className="mr-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {!player.registrationData && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddRegistrationForPlayer(player._id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal for Adding/Editing Registrations */}
      {user?.role === 'ADMIN' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingRegistration ? 'Edit Registration' : 'Add New Registration'}
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
                {editingRegistration ? 'Update' : 'Add'} Registration
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Player"
              value={formData.playerId}
              onChange={(e) => setFormData(prev => ({ ...prev, playerId: e.target.value }))}
              options={[
                { value: '', label: 'Select Player' },
                ...players.map(player => ({
                  value: player._id,
                  label: `${player.fullName} (${player.birthYear})`,
                })),
              ]}
              required
            />
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Registration Fee: <span className="font-medium">500 EGP</span></p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasPaid"
                checked={formData.hasPaid}
                onChange={(e) => setFormData(prev => ({ ...prev, hasPaid: e.target.checked }))}
              />
              <label htmlFor="hasPaid" className="text-sm text-gray-700">
                Payment received
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasSubmittedDocs"
                checked={formData.hasSubmittedDocs}
                onChange={(e) => setFormData(prev => ({ ...prev, hasSubmittedDocs: e.target.checked }))}
              />
              <label htmlFor="hasSubmittedDocs" className="text-sm text-gray-700">
                Required documents submitted
              </label>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RegistrationPage;