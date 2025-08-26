import React from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { Search, Plus } from 'lucide-react';
import { Player, ViewMode } from '../types/registration';

interface RegistrationFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterYear: string;
  setFilterYear: (year: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  players: Player[];
  isAdmin: boolean;
  onAddRegistration: () => void;
}

const RegistrationFilters: React.FC<RegistrationFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterYear,
  setFilterYear,
  viewMode,
  setViewMode,
  players,
  isAdmin,
  onAddRegistration,
}) => {
  const birthYearOptions = Array.from(new Set(players.map(p => p.birthYear)))
    .sort((a, b) => b - a)
    .map(year => ({ value: year.toString(), label: year.toString() }));

  return (
    <>
      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === 'registrations' ? 'primary' : 'secondary'}
          onClick={() => setViewMode('registrations')}
        >
          Registrations View
        </Button>
        <Button
          variant={viewMode === 'all-players' ? 'primary' : 'secondary'}
          onClick={() => setViewMode('all-players')}
        >
          All Players View
        </Button>
      </div>

      {/* Filters and Search */}
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
            options={
              viewMode === 'registrations' ? [
                { value: '', label: 'All Status' },
                { value: 'complete', label: 'Complete' },
                { value: 'incomplete', label: 'Incomplete' },
                { value: 'paid', label: 'Paid' },
                { value: 'unpaid', label: 'Unpaid' },
                { value: 'docs-submitted', label: 'Docs Submitted' },
                { value: 'docs-pending', label: 'Docs Pending' },
              ] : [
                { value: '', label: 'All Status' },
                { value: 'registered', label: 'Fully Registered' },
                { value: 'incomplete', label: 'Incomplete Registration' },
                { value: 'not-registered', label: 'Not Registered' },
              ]
            }
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
        {isAdmin && (
          <Button
            onClick={onAddRegistration}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Registration
          </Button>
        )}
      </div>
    </>
  );
};

export default RegistrationFilters;

// import { Registration, PlayerWithRegistrationStatus } from '../types/registration';

// export const filterRegistrations = (
//   registrations: Registration[],
//   searchTerm: string,
//   filterStatus: string,
//   filterYear: string
// ) => {
//   return registrations.filter(registration => {
//     // Safety check - skip registrations with null/undefined player
//     if (!registration.player || !registration.player.fullName) {
//       return false;
//     }

//     const matchesSearch = registration.player.fullName
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
    
//     const matchesYear = !filterYear || 
//       registration.player.birthYear?.toString() === filterYear;

//     let matchesStatus = true;
//     if (filterStatus) {
//       switch (filterStatus) {
//         case 'complete':
//           matchesStatus = registration.hasPaid && registration.hasSubmittedDocs;
//           break;
//         case 'incomplete':
//           matchesStatus = !registration.hasPaid || !registration.hasSubmittedDocs;
//           break;
//         case 'paid':
//           matchesStatus = registration.hasPaid;
//           break;
//         case 'unpaid':
//           matchesStatus = !registration.hasPaid;
//           break;
//         case 'docs-submitted':
//           matchesStatus = registration.hasSubmittedDocs;
//           break;
//         case 'docs-pending':
//           matchesStatus = !registration.hasSubmittedDocs;
//           break;
//         default:
//           matchesStatus = true;
//       }
//     }

//     return matchesSearch && matchesYear && matchesStatus;
//   });
// };

// export const filterPlayers = (
//   players: PlayerWithRegistrationStatus[],
//   searchTerm: string,
//   filterStatus: string,
//   filterYear: string
// ) => {
//   return players.filter(player => {
//     // Safety check - ensure player has required properties
//     if (!player || !player.fullName) {
//       return false;
//     }

//     const matchesSearch = player.fullName
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
    
//     const matchesYear = !filterYear || 
//       player.birthYear?.toString() === filterYear;

//     let matchesStatus = true;
//     if (filterStatus) {
//       switch (filterStatus) {
//         case 'registered':
//           matchesStatus = player.registrationStatus === 'registered';
//           break;
//         case 'incomplete':
//           matchesStatus = player.registrationStatus === 'incomplete';
//           break;
//         case 'not-registered':
//           matchesStatus = player.registrationStatus === 'not-registered';
//           break;
//         default:
//           matchesStatus = true;
//       }
//     }

//     return matchesSearch && matchesYear && matchesStatus;
//   });
// };