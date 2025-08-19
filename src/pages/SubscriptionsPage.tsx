import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useModal } from '../hooks/useModal';
import { useFilters } from '../hooks/useFilters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import SubscriptionForm from '../components/subscriptions/SubscriptionForm';
import { Plus, Edit, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { SubscriptionFormData } from '../components/subscriptions/SubscriptionForm'; 

const SubscriptionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    subscriptions,
    loading,
    error,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    totalIncome,
    overdueSubscriptions,
    isOverdue,
    players,
  } = useSubscriptions();

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { filters, updateFilter } = useFilters();

  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SubscriptionFormData>({
  playerId: '',
  month: '',
  hasPaid: false,
  paymentDate: undefined,   // 👈 undefined بدل string فاضية
  amount: 0,                // 👈 number بدل string
});

  // ========== submit form ==========
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.playerId || !formData.month || !formData.amount) {
  //     alert('Please fill in all required fields.');
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     if (editingSubscription) {
  //       await updateSubscription(editingSubscription._id, {
  //         ...formData,
  //         amount: Number(formData.amount),
  //       });
  //     } else {
  //       await createSubscription({
  //         ...formData,
  //         amount: Number(formData.amount),
  //       });
  //     }
  //     closeModal();
  //     resetForm();
  //   } catch (error) {
  //     console.error('Error saving subscription:', error);
  //     alert('Error saving subscription. Please try again.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.playerId || !formData.month || !formData.amount) {
    alert('Please fill in all required fields.');
    return;
  }

  setIsSubmitting(true);
  try {
    const payload = {
      ...formData,
      playerId: typeof formData.playerId === "object" 
        ? formData.playerId  // 👈 لو object رجعه id
        : formData.playerId,
      amount: Number(formData.amount),
    };

    if (editingSubscription) {
      await updateSubscription(editingSubscription._id, payload);
    } else {
      await createSubscription(payload);
    }
    closeModal();
    resetForm();
  } catch (error) {
    console.error('Error saving subscription:', error);
    alert('Error saving subscription. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  // ========== edit ==========
  const handleEdit = (subscription: any) => {
    setEditingSubscription(subscription);
    setFormData({
  playerId: subscription.playerId._id,
  month: subscription.month,
  hasPaid: subscription.hasPaid,
  paymentDate: subscription.paymentDate, 
  amount: subscription.amount,           
});

    openModal();
  };

  // ========== delete ==========
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteSubscription(id);
      } catch (error) {
        console.error('Error deleting subscription:', error);
        alert('Error deleting subscription. Please try again.');
      }
    }
  };

  // ========== reset form ==========
  const resetForm = () => {
    setFormData({
  playerId: '',
  month: '',
  hasPaid: false,
  paymentDate: undefined,  // 👈 زي ما معرف في SubscriptionFormData
  amount: 0,               // 👈 رقم
});

    setEditingSubscription(null);
  };

  const handleModalClose = () => {
    closeModal();
    resetForm();
  };

  // ========== filter subscriptions ==========
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch = subscription.playerId.fullName
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    const matchesStatus =
      !filters.filterStatus ||
      (filters.filterStatus === 'paid' && subscription.hasPaid) ||
      (filters.filterStatus === 'unpaid' && !subscription.hasPaid);
    const matchesYear =
      !filters.filterYear ||
      subscription.playerId.birthYear.toString() === filters.filterYear;

    return matchesSearch && matchesStatus && matchesYear;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscriptions.length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalIncome.toFixed(2)} EGP
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {overdueSubscriptions.length}
              </p>
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
            value={filters.filterStatus}
            onChange={(e) => updateFilter('filterStatus', e.target.value)}
            options={[
              { value: '', label: 'All Status' },
              { value: 'paid', label: 'Paid' },
              { value: 'unpaid', label: 'Unpaid' },
            ]}
          />
          <Select
            value={filters.filterYear}
            onChange={(e) => updateFilter('filterYear', e.target.value)}
            options={[
              { value: '', label: 'All Years' },
              { value: '2024', label: '2024' },
              { value: '2023', label: '2023' },
              { value: '2022', label: '2022' },
            ]}
          />
          {user?.role === 'ADMIN' && (
            <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          )}
        </div>
      </Card>

      {/* Subscriptions Table */}
      {filteredSubscriptions.length === 0 ? (
        <EmptyState
          title="No subscriptions found"
          description="Try adjusting your search or add a new subscription."
          action={
            user?.role === 'ADMIN' && (
              <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Subscription
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
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                  {user?.role === 'ADMIN' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => (
                  <tr
                    key={subscription._id}
                    className={isOverdue(subscription) ? 'bg-red-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.playerId.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subscription.playerId.birthYear}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(subscription.month).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscription.amount} EGP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscription.hasPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {subscription.hasPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscription.paymentDate
                        ? new Date(subscription.paymentDate).toLocaleDateString()
                        : '-'}
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(subscription)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDelete(subscription._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
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

      {/* Modal for Adding/Editing Subscriptions */}
      {user?.role === 'ADMIN' && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
        >
          <SubscriptionForm
            formData={formData}
            setFormData={setFormData}
            players={players}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
};

export default SubscriptionsPage;
