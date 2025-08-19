import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Registration, Player, PlayerWithRegistrationStatus, RegistrationFormData } from '../types/registration';

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersWithStatus, setPlayersWithStatus] = useState<PlayerWithRegistrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const saveRegistration = async (formData: RegistrationFormData, editingRegistration?: Registration | null) => {
    try {
      const data = {
        ...formData,
        amount: 500, // Fixed registration fee
      };

      // Set payment date if payment is marked as paid
      if (formData.hasPaid) {
        data.paymentDate = new Date().toISOString();
      } else {
        data.paymentDate = undefined;
      }

      if (editingRegistration) {
        await api.put(`/registrations/${editingRegistration._id}`, data);
      } else {
        await api.post('/registrations', data);
      }

      await fetchRegistrations();
      return true;
    } catch (error) {
      console.error('Error saving registration:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      generatePlayersWithStatus();
    }
  }, [players, registrations]);

  const totalIncome = registrations
    .filter(reg => reg.hasPaid)
    .reduce((total, reg) => total + reg.amount, 0);

  return {
    registrations,
    players,
    playersWithStatus,
    isLoading,
    fetchRegistrations,
    saveRegistration,
    totalIncome,
  };
};
