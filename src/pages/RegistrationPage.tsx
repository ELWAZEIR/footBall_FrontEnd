import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRegistrations } from '../hooks/useRegistrations';
import { useModal } from '../hooks/useModal';
import { useFilters } from '../hooks/useFilters';
import { filterRegistrations, filterPlayers } from '../utils/registrationFilters';
import RegistrationStats from '../components/RegistrationStats';
import RegistrationFilters from '../components/RegistrationFilters';
import RegistrationsTable from '../components/RegistrationsTable';
import PlayersTable from '../components/PlayersTable';
import RegistrationModal from '../components/RegistrationModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Registration, RegistrationFormData, ViewMode } from '../types/registration';

const RegistrationPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    registrations,
    players,
    playersWithStatus,
    isLoading,
    saveRegistration,
    totalIncome,
  } = useRegistrations();

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { filters, updateFilter } = useFilters();
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('registrations');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    playerId: '',
    hasPaid: false,
    hasSubmittedDocs: false,
    paymentDate: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.playerId) {
      alert('Please select a player.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveRegistration(formData, editingRegistration);
      closeModal();
      resetForm();
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Error saving registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (registration: Registration) => {
    setEditingRegistration(registration);
    setFormData({
      playerId: registration.player._id,
      hasPaid: registration.hasPaid,
      hasSubmittedDocs: registration.hasSubmittedDocs,
      paymentDate: registration.paymentDate,
    });
    openModal();
  };

  const handleAddRegistrationForPlayer = (playerId: string) => {
    setFormData({
      playerId: playerId,
      hasPaid: false,
      hasSubmittedDocs: false,
      paymentDate: undefined,
    });
    openModal();
  };

  const resetForm = () => {
    setFormData({
      playerId: '',
      hasPaid: false,
      hasSubmittedDocs: false,
      paymentDate: undefined,
    });
    setEditingRegistration(null);
  };

  const handleModalClose = () => {
    closeModal();
    resetForm();
  };

  const filteredRegistrations = filterRegistrations(
    registrations,
    filters.searchTerm,
    filters.filterStatus,
    filters.filterYear
  );

  const filteredPlayers = filterPlayers(
    playersWithStatus,
    filters.searchTerm,
    filters.filterStatus,
    filters.filterYear
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <RegistrationStats
        registrations={registrations}
        totalPlayers={players.length}
        totalIncome={totalIncome}
      />

      {/* Filters */}
      <RegistrationFilters
        searchTerm={filters.searchTerm}
        setSearchTerm={(value) => updateFilter('searchTerm', value)}
        filterStatus={filters.filterStatus}
        setFilterStatus={(value) => updateFilter('filterStatus', value)}
        filterYear={filters.filterYear}
        setFilterYear={(value) => updateFilter('filterYear', value)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        players={players}
        isAdmin={user?.role === 'ADMIN'}
        onAddRegistration={openModal}
      />

      {/* Table */}
      {viewMode === 'registrations' ? (
        <RegistrationsTable
          registrations={filteredRegistrations}
          isAdmin={user?.role === 'ADMIN'}
          onEdit={handleEdit}
        />
      ) : (
        <PlayersTable
          players={filteredPlayers}
          isAdmin={user?.role === 'ADMIN'}
          onEdit={handleEdit}
          onAddRegistration={handleAddRegistrationForPlayer}
        />
      )}

      {/* Modal for Adding/Editing Registrations */}
      {user?.role === 'ADMIN' && (
        <RegistrationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          players={players}
          editingRegistration={editingRegistration}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default RegistrationPage;