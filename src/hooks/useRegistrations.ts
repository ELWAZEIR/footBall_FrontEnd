import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Registration, Player, PlayerWithRegistrationStatus, RegistrationFormData } from '../types/registration';
import toast from 'react-hot-toast';

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersWithStatus, setPlayersWithStatus] = useState<PlayerWithRegistrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
const [isConfirmOpen, setIsConfirmOpen] = useState(false);
const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/registrations');
      const rawRegistrations = Array.isArray(response.data) ? response.data : [];
      
      // Filter out registrations with null/invalid player data
      const validRegistrations = rawRegistrations.filter((reg: any) => 
        reg && reg.player && reg.player._id && reg.player.fullName
      );

      // Log invalid registrations for debugging
      const invalidRegistrations = rawRegistrations.filter((reg: any) => 
        !reg || !reg.player || !reg.player._id || !reg.player.fullName
      );

      if (invalidRegistrations.length > 0) {
        console.log("invalidRegistrations ", invalidRegistrations);

        console.warn(`Found ${invalidRegistrations.length} registrations with invalid player data:`, invalidRegistrations);
        toast.error(`Warning: ${invalidRegistrations.length} registrations have missing player data`, {
          duration: 5000
        });
      }

      setRegistrations(validRegistrations);
      console.log('Valid registrations:', validRegistrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Error fetching registrations');
      setRegistrations([]);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      const playersData = Array.isArray(response.data?.data) ? response.data.data : [];
      
      // Filter out invalid player data
      const validPlayers = playersData.filter((player: any) => 
        player && player._id && player.fullName
      );

      setPlayers(validPlayers);
      console.log('Valid players:', validPlayers);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Error fetching players');
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePlayersWithStatus = () => {
    const playersWithStatusData: PlayerWithRegistrationStatus[] = players.map(player => {
      // Only look for registrations with valid player data
      const playerRegistration = registrations.find(reg => 
        reg.player && reg.player._id && 
        (reg.player._id === player._id || reg.playerId === player._id)
      );

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
        toast.success('Registration updated successfully');
      } else {
        await api.post('/registrations', data);
        toast.success('Registration created successfully');
      }

      await fetchRegistrations();
      return true;
    } catch (error) {
      console.error('Error saving registration:', error);
      toast.error('Error saving registration');
      throw error;
    }
  };

  
const handleDelete = (id: string) => {
  setDeleteId(id);
  setIsConfirmOpen(true);
};

const confirmDelete = async () => {
  if (!deleteId) return;
  try {
    await api.delete(`/registrations/${deleteId}`);
    fetchRegistrations();
  } catch (error) {
    console.error("Error deleting registration:", error);
  } finally {
    setIsConfirmOpen(false);
    setDeleteId(null);
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

  // Calculate total income only from valid registrations
  const totalIncome = registrations
    .filter(reg => reg && reg.hasPaid && typeof reg.amount === 'number')
    .reduce((total, reg) => total + reg.amount, 0);

  return {
    registrations,
    players,
    playersWithStatus,
    isLoading,
    fetchRegistrations,
    saveRegistration,
    totalIncome,
    isConfirmOpen,
    handleDelete,
    confirmDelete,
    setIsConfirmOpen
  };
};