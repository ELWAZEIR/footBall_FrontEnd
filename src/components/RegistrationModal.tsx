import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Select from './ui/Select';
import { Player, Registration, RegistrationFormData } from '../types/registration';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: RegistrationFormData;
  setFormData: (data: RegistrationFormData) => void;
  players: Player[];
  editingRegistration: Registration | null;
  isSubmitting?: boolean;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  players,
  editingRegistration,
  isSubmitting = false,
}) => {
  const resetForm = () => {
    setFormData({
      playerId: '',
      hasPaid: false,
      hasSubmittedDocs: false,
      paymentDate: undefined,
    });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingRegistration ? 'Edit Registration' : 'Add New Registration'}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (editingRegistration ? 'Update' : 'Add')} Registration
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Select
          label="Player"
          value={formData.playerId}
          onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, hasPaid: e.target.checked })}
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
            onChange={(e) => setFormData({ ...formData, hasSubmittedDocs: e.target.checked })}
          />
          <label htmlFor="hasSubmittedDocs" className="text-sm text-gray-700">
            Required documents submitted
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default RegistrationModal;
