import React from 'react';
// import { SubscriptionFormData } from '../../hooks/useSubscriptions';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

export interface SubscriptionFormData {
  playerId: string;
  month: string;
  amount: number;
  hasPaid: boolean;
  paymentDate?: string;
}

interface SubscriptionFormProps {
  formData: SubscriptionFormData;
  setFormData: (data: SubscriptionFormData) => void;
  players: any[];
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  formData,
  setFormData,
  players,
  onSubmit,
  isSubmitting = false,
}) => {
  const handleInputChange = (field: keyof SubscriptionFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const months = [
    { value: '2024-01', label: 'January 2024' },
    { value: '2024-02', label: 'February 2024' },
    { value: '2024-03', label: 'March 2024' },
    { value: '2024-04', label: 'April 2024' },
    { value: '2024-05', label: 'May 2024' },
    { value: '2024-06', label: 'June 2024' },
    { value: '2024-07', label: 'July 2024' },
    { value: '2024-08', label: 'August 2024' },
    { value: '2024-09', label: 'September 2024' },
    { value: '2024-10', label: 'October 2024' },
    { value: '2024-11', label: 'November 2024' },
    { value: '2024-12', label: 'December 2024' },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Player
        </label>
        <Select
          value={formData.playerId}
          onChange={(value) => handleInputChange('playerId', value)}
          options={players.map(player => ({
            value: player._id,
            label: `${player.fullName} (${player.birthYear})`,
          }))}
          placeholder="Select a player"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Month
        </label>
        <Select
          value={formData.month}
          onChange={(value) => handleInputChange('month', value)}
          options={months}
          placeholder="Select month"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          placeholder="Enter amount"
          step="0.01"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="hasPaid"
          checked={formData.hasPaid}
          onChange={(e) => handleInputChange('hasPaid', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="hasPaid" className="ml-2 block text-sm text-gray-900">
          Has Paid
        </label>
      </div>

      {formData.hasPaid && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Date
          </label>
          <Input
            type="date"
            value={formData.paymentDate}
            onChange={(e) => handleInputChange('paymentDate', e.target.value)}
          />
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !formData.playerId || !formData.month || !formData.amount}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : 'Save Subscription'}
        </Button>
      </div>
    </form>
  );
};

export default SubscriptionForm;
