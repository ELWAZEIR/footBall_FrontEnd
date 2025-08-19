import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Edit } from 'lucide-react';
import { Registration } from '../types/registration';

interface RegistrationsTableProps {
  registrations: Registration[];
  isAdmin: boolean;
  onEdit: (registration: Registration) => void;
}

const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  registrations,
  isAdmin,
  onEdit,
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
              <th className="text-left p-4 font-medium text-gray-600">Amount</th>
              <th className="text-left p-4 font-medium text-gray-600">Payment</th>
              <th className="text-left p-4 font-medium text-gray-600">Documents</th>
              <th className="text-left p-4 font-medium text-gray-600">Payment Date</th>
              {isAdmin && (
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr 
                key={registration._id} 
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-4 font-medium text-gray-800">{registration.player.fullName}</td>
                <td className="p-4 text-gray-600">{registration.player.birthYear}</td>
                <td className="p-4 text-gray-600">{registration.player.parentPhone || '-'}</td>
                <td className="p-4 text-gray-600">{registration.player.notes || '-'}</td>
                <td className="p-4 text-gray-600">{registration.amount.toLocaleString()} EGP</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    registration.hasPaid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {registration.hasPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    registration.hasSubmittedDocs 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {registration.hasSubmittedDocs ? 'Submitted' : 'Pending'}
                  </span>
                </td>
                <td className="p-4 text-gray-600">
                  {registration.paymentDate 
                    ? new Date(registration.paymentDate).toLocaleDateString()
                    : '-'
                  }
                </td>
                {isAdmin && (
                  <td className="p-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(registration)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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

export default RegistrationsTable;
