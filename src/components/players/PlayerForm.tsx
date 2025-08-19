import React from 'react';
import { PlayerFormData } from '../../hooks/usePlayers';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface PlayerFormProps {
  formData: PlayerFormData;
  setFormData: (data: PlayerFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

const PlayerForm: React.FC<PlayerFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isSubmitting = false,
}) => {
  const handleInputChange = (field: keyof PlayerFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <Input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Enter full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Birth Year
        </label>
        <Input
          type="number"
          value={formData.birthYear}
          onChange={(e) => handleInputChange('birthYear', e.target.value)}
          placeholder="Enter birth year"
          min="1990"
          max="2024"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Parent Phone
        </label>
        <Input
          type="tel"
          value={formData.parentPhone}
          onChange={(e) => handleInputChange('parentPhone', e.target.value)}
          placeholder="Enter parent phone number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Enter any notes"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !formData.fullName || !formData.birthYear || !formData.parentPhone}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : 'Save Player'}
        </Button>
      </div>
    </form>
  );
};

export default PlayerForm;
