import React from 'react';
import Card from '../ui/Card';
import { CheckCircle, XCircle, FileText, User } from 'lucide-react';
import { Registration } from '../../types/registration';

interface RegistrationStatsProps {
  registrations: Registration[];
  totalPlayers: number;
  totalIncome: number;
}

const RegistrationStats: React.FC<RegistrationStatsProps> = ({
  registrations,
  totalPlayers,
  totalIncome,
}) => {
  const pendingPayment = registrations.filter(r => !r.hasPaid).length;
  const docsSubmitted = registrations.filter(r => r.hasSubmittedDocs).length;
  const pendingDocs = registrations.filter(r => !r.hasSubmittedDocs).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Players</p>
            <p className="text-2xl font-bold text-blue-600">{totalPlayers}</p>
          </div>
          <User className="h-8 w-8 text-blue-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-green-600">{totalIncome.toLocaleString()} EGP</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Payment</p>
            <p className="text-2xl font-bold text-red-600">{pendingPayment}</p>
          </div>
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Docs Submitted</p>
            <p className="text-2xl font-bold text-blue-600">{docsSubmitted}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Docs</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingDocs}</p>
          </div>
          <FileText className="h-8 w-8 text-yellow-500" />
        </div>
      </Card>
    </div>
  );
};

export default RegistrationStats;
