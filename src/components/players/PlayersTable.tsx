import React from 'react';

import { Edit, Plus } from 'lucide-react';
import { PlayerWithRegistrationStatus, Registration } from '../../types/registration';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface PlayersTableProps {
  players: PlayerWithRegistrationStatus[];
  isAdmin: boolean;
  onEdit: (registration: Registration) => void;
  onAddRegistration: (playerId: string) => void;
}

const PlayersTable: React.FC<PlayersTableProps> = ({
  players,
  isAdmin,
  onEdit,
  onAddRegistration,
}) => {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 font-medium text-gray-600">Player</th>
              <th className="text-left p-4 font-medium text-gray-600">Birth Year</th>
              <th className="text-left p-4 font-medium text-gray-600">Phone</th>
              <th className="text-left p-4 font-medium text-gray-600">Notes</th>
              <th className="text-left p-4 font-medium text-gray-600">Registration Status</th>
              <th className="text-left p-4 font-medium text-gray-600">Details</th>
              {isAdmin && (
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr 
                key={player._id} 
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  player.registrationStatus === 'not-registered' ? 'bg-red-50' : 
                  player.registrationStatus === 'incomplete' ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="p-4 font-medium text-gray-800">{player.fullName}</td>
                <td className="p-4 text-gray-600">{player.birthYear}</td>
                <td className="p-4 text-gray-600">{player.parentPhone || '-'}</td>
                <td className="p-4 text-gray-600">{player.notes || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    player.registrationStatus === 'registered' 
                      ? 'bg-green-100 text-green-800' 
                      : player.registrationStatus === 'incomplete'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {player.registrationStatus === 'registered' ? 'Fully Registered' : 
                     player.registrationStatus === 'incomplete' ? 'Incomplete' : 'Not Registered'}
                  </span>
                </td>
                <td className="p-4 text-gray-600">
                  {player.registrationData 
                    ? `Payment: ${player.registrationData.hasPaid ? 'Yes' : 'No'}, Docs: ${player.registrationData.hasSubmittedDocs ? 'Yes' : 'No'}`
                    : 'No registration data'
                  }
                </td>
                {isAdmin && (
                  <td className="p-4 space-x-2">
                    {player.registrationData && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(player.registrationData!)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {!player.registrationData && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAddRegistration(player._id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PlayersTable;
