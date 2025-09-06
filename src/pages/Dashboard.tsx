import React from "react";
import { Plus, AlertCircle, TrendingUp } from "lucide-react";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import PlayerForm from "../components/players/PlayerForm";
import { useAuthStore } from "../store/authStore";
import { useDashboard } from "../hooks/useDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const {
    data,
    isLoading,
    isModalOpen,
    openModal,
    closeModal,
    formData,
    setFormData,
    handleSubmit,
    isSubmitting,
    resetForm,
    stats,
    incomeBreakdown,
  } = useDashboard();

  const navigate = useNavigate();

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

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title}>
              <div
                className={`p-6 rounded-2xl shadow-lg bg-gradient-to-r ${stat.gradient} text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Income Breakdown + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div>
          <Card className="p-6 shadow-xl rounded-2xl hover:shadow-2xl transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              Income Breakdown
            </h3>
            <div className="space-y-4">
              {incomeBreakdown.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Icon className={`h-6 w-6 ${item.color} mr-3`} />
                      <span className="text-gray-700">{item.title}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="p-6 shadow-xl rounded-2xl hover:shadow-2xl transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Plus className="h-5 w-5 text-blue-600 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              {user?.role === "ADMIN" && (
                <button
                  onClick={openModal}
                  className="w-full flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700 font-medium"
                >
                  <Plus className="h-5 w-5 mr-2" /> Add New Player
                </button>
              )}
              <button
                onClick={() => navigate("/subscriptions")}
                className="w-full flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-green-700 font-medium"
              >
                Process Subscription Payment
              </button>
              <button
                onClick={() => navigate("/uniforms")}
                className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-purple-700 font-medium"
              >
                Update Uniform Status
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Attention Required */}
      {data.overdueSubscriptions > 0 && (
        <div>
          <Card className="p-6 bg-red-50 border-l-4 border-red-500 shadow-md">
            <div className="flex items-start">
              <div>
                <AlertCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Attention Required
                </h3>
                <p className="text-red-700 mt-1">
                  You have {data.overdueSubscriptions} overdue subscription
                  payments that need attention.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal */}
      {user?.role === "ADMIN" && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            closeModal();
            resetForm();
          }}
          title="Add New Player"
        >
          <PlayerForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
