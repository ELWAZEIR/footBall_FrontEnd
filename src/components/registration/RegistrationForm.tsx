import React from 'react';
import { RegistrationFormData } from '../../types/registration';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface RegistrationFormProps {
  formData: RegistrationFormData;
  setFormData: (data: RegistrationFormData) => void;
  players: any[];
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  setFormData,
  players,
  onSubmit,
  isSubmitting = false,
}) => {
  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

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
        />
      </div>

      <div className="flex space-x-4">
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasSubmittedDocs"
            checked={formData.hasSubmittedDocs}
            onChange={(e) => handleInputChange('hasSubmittedDocs', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hasSubmittedDocs" className="ml-2 block text-sm text-gray-900">
            Has Submitted Documents
          </label>
        </div>
      </div>

      {formData.hasPaid && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Date
          </label>
          <Input
            type="date"
            value={formData.paymentDate || ''}
            onChange={(e) => handleInputChange('paymentDate', e.target.value)}
          />
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !formData.playerId}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : 'Save Registration'}
        </Button>
      </div>
    </form>
  );
};

export default RegistrationForm;
