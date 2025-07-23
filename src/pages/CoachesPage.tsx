import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { Plus, Edit, Trash2, Search, UserCheck } from 'lucide-react';

interface Coach {
  _id: string;
  name: string;
  email: string;
  role: string;
  salary?: number;
  responsibleYears?: number[];
  createdAt: string;
}

const CoachesPage: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'COACH',
    salary: '',
    responsibleYears: [] as number[],
  });

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await api.get('/users');
      setCoaches(response.data);
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
      };

      if (editingCoach) {
        await api.put(`/users/${editingCoach._id}`, data);
      } else {
        await api.post('/users', data);
      }

      fetchCoaches();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving coach:', error);
    }
  };

  const handleEdit = (coach: Coach) => {
    setEditingCoach(coach);
    setFormData({
      name: coach.name,
      email: coach.email,
      password: '',
      role: coach.role,
      salary: coach.salary?.toString() || '',
      responsibleYears: coach.responsibleYears || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coach?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchCoaches();
      } catch (error) {
        console.error('Error deleting coach:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'COACH',
      salary: '',
      responsibleYears: [],
    });
    setEditingCoach(null);
  };

  const handleYearToggle = (year: number) => {
    setFormData(prev => ({
      ...prev,
      responsibleYears: prev.responsibleYears.includes(year)
        ? prev.responsibleYears.filter(y => y !== year)
        : [...prev.responsibleYears, year]
    }));
  };

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalSalary = coaches
    .filter(coach => coach.salary && coach.role === 'COACH')
    .reduce((total, coach) => total + (coach.salary || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Coaches</p>
              <p className="text-2xl font-bold text-blue-600">
                {coaches.filter(c => c.role === 'COACH').length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Monthly Salary</p>
              <p className="text-2xl font-bold text-green-600">{totalSalary.toLocaleString()} EGP</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search coaches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Coach
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-600">Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Email</th>
                <th className="text-left p-4 font-medium text-gray-600">Role</th>
                <th className="text-left p-4 font-medium text-gray-600">Salary</th>
                <th className="text-left p-4 font-medium text-gray-600">Responsible Years</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoaches.map((coach) => (
                <tr key={coach._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{coach.name}</td>
                  <td className="p-4 text-gray-600">{coach.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      coach.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {coach.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {coach.salary ? `${coach.salary.toLocaleString()} EGP` : '-'}
                  </td>
                  <td className="p-4 text-gray-600">
                    {coach.responsibleYears?.length ? coach.responsibleYears.join(', ') : '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(coach)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(coach._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingCoach ? 'Edit User' : 'Add New User'}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingCoach ? 'Update' : 'Add'} User
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          {!editingCoach && (
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          )}
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            options={[
              { value: 'ADMIN', label: 'Admin' },
              { value: 'COACH', label: 'Coach' },
            ]}
            required
          />
          {formData.role === 'COACH' && (
            <>
              <Input
                label="Monthly Salary (EGP)"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsible Birth Years
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }, (_, i) => 2017 - i).map(year => (
                    <label key={year} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.responsibleYears.includes(year)}
                        onChange={() => handleYearToggle(year)}
                      />
                      <span className="text-sm">{year}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default CoachesPage;