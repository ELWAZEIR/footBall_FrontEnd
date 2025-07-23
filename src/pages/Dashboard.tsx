import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import Card from '../components/ui/Card';
import { 
  Users, 
  DollarSign, 
  Shirt, 
  ClipboardList, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface DashboardData {
  totalPlayers: number;
  subscriptionIncome: number;
  uniformIncome: number;
  registrationIncome: number;
  unpaidSubscriptions: number;
  overdueSubscriptions: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const totalIncome = data.subscriptionIncome + data.uniformIncome + data.registrationIncome;

  const stats = [
    {
      title: 'Total Players',
      value: data.totalPlayers.toString(),
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Income',
      value: `${totalIncome.toLocaleString()} EGP`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Unpaid Subscriptions',
      value: data.unpaidSubscriptions.toString(),
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Overdue Payments',
      value: data.overdueSubscriptions.toString(),
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
      bgColor: 'bg-red-50'
    },
  ];

  const incomeBreakdown = [
    {
      title: 'Subscription Income',
      value: `${data.subscriptionIncome.toLocaleString()} EGP`,
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Uniform Income',
      value: `${data.uniformIncome.toLocaleString()} EGP`,
      icon: Shirt,
      color: 'text-purple-600'
    },
    {
      title: 'Registration Income',
      value: `${data.registrationIncome.toLocaleString()} EGP`,
      icon: ClipboardList,
      color: 'text-green-600'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`p-6 ${stat.bgColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Breakdown</h3>
          <div className="space-y-4">
            {incomeBreakdown.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className={`h-5 w-5 ${item.color} mr-3`} />
                    <span className="text-gray-700">{item.title}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.value}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="text-blue-700 font-medium">Add New Player</span>
            </button>
            <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <span className="text-green-700 font-medium">Process Subscription Payment</span>
            </button>
            <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <span className="text-purple-700 font-medium">Update Uniform Status</span>
            </button>
          </div>
        </Card>
      </div>

      {data.overdueSubscriptions > 0 && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Attention Required</h3>
              <p className="text-red-700 mt-1">
                You have {data.overdueSubscriptions} overdue subscription payments that need attention.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;