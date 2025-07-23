import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { Plus, Edit, Search, CheckCircle, XCircle } from 'lucide-react';

interface Uniform {
  _id: string;
  playerId: string;
  hasPaid: boolean;
  hasReceived: boolean;
  size: string;
  amount: number;
  player: {
    id: string;
    fullName: string;
    birthYear: number;
  };
  createdAt: string;
}

const UniformsPage: React.FC = () => {
  const [uniforms, setUniforms] = useState<Uniform[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUniform, setEditingUniform] = useState<Uniform | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    playerId: '',
    hasPaid: false,
    hasReceived: false,
    size: '',
    amount: '',
  });

  useEffect(() => {
    fetchUniforms();
    fetchPlayers();
  }, []);

  const fetchUniforms = async () => {
    try {
      const response = await api.get('/uniforms');
      setUniforms(response.data);
    } catch (error) {
      console.error('Error fetching uniforms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        size: formData.size.replace('SIZE_', ''),
      };

      if (editingUniform) {
        await api.put(`/uniforms/${editingUniform._id}`, data);
      } else {
        await api.post('/uniforms', data);
      }

      fetchUniforms();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving uniform:', error);
    }
  };

  const handleEdit = (uniform: Uniform) => {
    setEditingUniform(uniform);
    setFormData({
      playerId: uniform.playerId,
      hasPaid: uniform.hasPaid,
      hasReceived: uniform.hasReceived,
      size: uniform.size,
      amount: uniform.amount.toString(),
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      playerId: '',
      hasPaid: false,
      hasReceived: false,
      size: '',
      amount: '',
    });
    setEditingUniform(null);
  };

  const filteredUniforms = uniforms.filter(uniform => {
    const matchesSearch = uniform.player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || 
                         (filterStatus === 'paid' && uniform.hasPaid) ||
                         (filterStatus === 'unpaid' && !uniform.hasPaid) ||
                         (filterStatus === 'received' && uniform.hasReceived) ||
                         (filterStatus === 'pending' && !uniform.hasReceived);
    return matchesSearch && matchesStatus;
  });

  const totalIncome = uniforms
    .filter(uniform => uniform.hasPaid)
    .reduce((total, uniform) => total + uniform.amount, 0);

  const sizeOptions = [
    { value: '', label: 'Select Size' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'SIZE_6', label: '6' },
    { value: 'SIZE_8', label: '8' },
    { value: 'SIZE_10', label: '10' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {uniforms.filter(u => !u.hasPaid).length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Delivery</p>
              <p className="text-2xl font-bold text-yellow-600">
                {uniforms.filter(u => !u.hasReceived).length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

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
            options={[
              { value: '', label: 'All Status' },
              { value: 'paid', label: 'Paid' },
              { value: 'unpaid', label: 'Unpaid' },
              { value: 'received', label: 'Received' },
              { value: 'pending', label: 'Pending Delivery' },
            ]}
          />
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Uniform
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-600">Player</th>
                <th className="text-left p-4 font-medium text-gray-600">Birth Year</th>
                <th className="text-left p-4 font-medium text-gray-600">Size</th>
                <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                <th className="text-left p-4 font-medium text-gray-600">Payment</th>
                <th className="text-left p-4 font-medium text-gray-600">Delivery</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUniforms.map((uniform) => (
                <tr key={uniform._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{uniform.player.fullName}</td>
                  <td className="p-4 text-gray-600">{uniform.player.birthYear}</td>
                  <td className="p-4 text-gray-600">{uniform.size.replace('SIZE_', '')}</td>
                  <td className="p-4 text-gray-600">{uniform.amount.toLocaleString()} EGP</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      uniform.hasPaid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {uniform.hasPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      uniform.hasReceived 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {uniform.hasReceived ? 'Received' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(uniform)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
        title={editingUniform ? 'Edit Uniform' : 'Add New Uniform'}
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
              {editingUniform ? 'Update' : 'Add'} Uniform
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
          <Select
            label="Size"
            value={formData.size}
            onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
            options={sizeOptions}
            required
          />
          <Input
            label="Amount (EGP)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            required
          />
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
              id="hasReceived"
              checked={formData.hasReceived}
              onChange={(e) => setFormData(prev => ({ ...prev, hasReceived: e.target.checked }))}
            />
            <label htmlFor="hasReceived" className="text-sm text-gray-700">
              Uniform delivered
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UniformsPage;