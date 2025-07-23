import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { Plus, Edit, Search, AlertCircle, CheckCircle } from 'lucide-react';

// interface Subscription {
//   _id: string;
//   playerId: string;
//   month: string;
//   hasPaid: boolean;
//   paymentDate?: string;
//   amount: number;
//   player: {
//     id: string;
//     fullName: string;
//     birthYear: number;
//   };
//   createdAt: string;
// }
interface Subscription {
  _id: string;
  player: {
    _id: string;
    fullName: string;
    birthYear: number;
    parentPhone?: string;
    notes?: string;
  };
  month: string;
  hasPaid: boolean;
  paymentDate?: string;
  amount: number;
  createdAt: string;
}


const SubscriptionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [formData, setFormData] = useState({
    playerId: '',
    month: '',
    hasPaid: false,
    paymentDate: '',
    amount: '',
  });

  useEffect(() => {
    fetchSubscriptions();
    fetchPlayers();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/subscriptions');
      setSubscriptions(response.data);
      console.log('Fetched subscriptions:', response.data);
      
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
      console.log('Fetched players:', response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

        // console.log('players from to to:', players.map(player => player.fullName));

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.playerId || !formData.month || !formData.amount) {
    alert('Please fill in all required fields.');
    return;
  }

  try {
    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
      paymentDate: formData.paymentDate || null,
    };

    if (editingSubscription) {
      await api.put(`/subscriptions/${editingSubscription._id}`, data);
    } else {
      await api.post('/subscriptions', data);
    }

    fetchSubscriptions();
    setIsModalOpen(false);
    resetForm();
  } catch (error) {
    console.error('Error saving subscription:', error);
  }
};

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      playerId: subscription.player._id,
      month: subscription.month,
      hasPaid: subscription.hasPaid,
      paymentDate: subscription.paymentDate ? subscription.paymentDate.split('T')[0] : '',
      amount: subscription.amount.toString(),
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      playerId: '',
      month: '',
      hasPaid: false,
      paymentDate: '',
      amount: '',
    });
    setEditingSubscription(null);
  };

  const isOverdue = (subscription: Subscription) => {
    if (subscription.hasPaid) return false;
    const createdDate = new Date(subscription.createdAt);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return createdDate < thirtyDaysAgo;
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || 
                         (filterStatus === 'paid' && subscription.hasPaid) ||
                         (filterStatus === 'unpaid' && !subscription.hasPaid) ||
                         (filterStatus === 'overdue' && isOverdue(subscription));
    const matchesYear = filterYear === '' || subscription.player.birthYear.toString() === filterYear;
    return matchesSearch && matchesStatus && matchesYear;
  });

  const totalPaid = subscriptions
    .filter(sub => sub.hasPaid)
    .reduce((total, sub) => total + sub.amount, 0);

  const birthYearOptions = Array.from(new Set(subscriptions.map(s => s.player.birthYear)))
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString()} EGP</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unpaid</p>
              <p className="text-2xl font-bold text-red-600">
                {subscriptions.filter(s => !s.hasPaid).length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-yellow-600">
                {subscriptions.filter(s => isOverdue(s)).length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
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
              { value: 'overdue', label: 'Overdue' },
            ]}
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
            Add Subscription
          </Button>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-600">Player</th>
                <th className="text-left p-4 font-medium text-gray-600">Birth Year</th>
                <th className="text-left p-4 font-medium text-gray-600">Month</th>
                <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Payment Date</th>
                {user?.role === 'ADMIN' && (
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((player) => (
                <tr 
                  key={player._id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    isOverdue(player) ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="p-4 font-medium text-gray-800">{player.player.fullName}</td>
                  <td className="p-4 text-gray-600">{player.player.birthYear}</td>
                  <td className="p-4 text-gray-600">{player.month}</td>
                  <td className="p-4 text-gray-600">{player.amount.toLocaleString()} EGP</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      player.hasPaid 
                        ? 'bg-green-100 text-green-800' 
                        : isOverdue(player)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {player.hasPaid ? 'Paid' : isOverdue(player) ? 'Overdue' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {player.paymentDate 
                      ? new Date(player.paymentDate).toLocaleDateString()
                      : '-'
                    }
                  </td>
                  {user?.role === 'ADMIN' && (
                    <td className="p-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(player)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {user?.role === 'ADMIN' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
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
                {editingSubscription ? 'Update' : 'Add'} Subscription
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
            <Input
              label="Month"
              type="month"
              value={formData.month}
              onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
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
            {formData.hasPaid && (
              <Input
                label="Payment Date"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
              />
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SubscriptionsPage;