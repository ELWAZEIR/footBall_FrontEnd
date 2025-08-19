import { Registration, PlayerWithRegistrationStatus } from '../types/registration';

export const filterRegistrations = (
  registrations: Registration[],
  searchTerm: string,
  filterStatus: string,
  filterYear: string
): Registration[] => {
  return registrations.filter(registration => {
    const matchesSearch = registration.player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || 
                         (filterStatus === 'paid' && registration.hasPaid) ||
                         (filterStatus === 'unpaid' && !registration.hasPaid) ||
                         (filterStatus === 'docs-submitted' && registration.hasSubmittedDocs) ||
                         (filterStatus === 'docs-pending' && !registration.hasSubmittedDocs) ||
                         (filterStatus === 'complete' && registration.hasPaid && registration.hasSubmittedDocs) ||
                         (filterStatus === 'incomplete' && (!registration.hasPaid || !registration.hasSubmittedDocs));
    const matchesYear = filterYear === '' || registration.player.birthYear.toString() === filterYear;
    return matchesSearch && matchesStatus && matchesYear;
  });
};

export const filterPlayers = (
  players: PlayerWithRegistrationStatus[],
  searchTerm: string,
  filterStatus: string,
  filterYear: string
): PlayerWithRegistrationStatus[] => {
  return players.filter(player => {
    const matchesSearch = player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || 
                         (filterStatus === 'registered' && player.registrationStatus === 'registered') ||
                         (filterStatus === 'not-registered' && player.registrationStatus === 'not-registered') ||
                         (filterStatus === 'incomplete' && player.registrationStatus === 'incomplete');
    const matchesYear = filterYear === '' || player.birthYear.toString() === filterYear;
    return matchesSearch && matchesStatus && matchesYear;
  });
};
