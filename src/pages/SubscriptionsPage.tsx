import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { useModal } from "../hooks/useModal";
import { useFilters } from "../hooks/useFilters";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import SubscriptionForm from "../components/subscriptions/SubscriptionForm";
import { Plus, Edit, Search, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "../components/common/ConfirmDelete";
import toast from "react-hot-toast";

const SubscriptionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    subscriptions,
    loading,
    error,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    totalIncome,
    overdueSubscriptions,
    isOverdue,
    players,
  } = useSubscriptions();

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { filters, updateFilter } = useFilters();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<any>(null);

  // فتح مودال التعديل
  const handleEdit = (subscription: any) => {
    setEditingSubscription(subscription);
    openModal();
  };

  // فتح مودال الإضافة
  const handleAdd = () => {
    setEditingSubscription(null);
    openModal();
  };

  // حفظ (إضافة/تعديل)
  const handleSave = async (formData: any) => {
    try {
      if (editingSubscription) {
        await updateSubscription(editingSubscription._id, formData);
        toast.success("Subscription updated successfully");
      } else {
        await createSubscription(formData);
        toast.success("Subscription created successfully");
      }
      closeModal();
    } catch (error) {
      console.error("Error saving subscription:", error);
      toast.error("Error saving subscription. Please try again.");
    }
  };

  // فتح مودال الحذف
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  // تأكيد الحذف
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSubscription(deleteId);
      toast.success("Subscription deleted");
    } catch (error) {
      toast.error("Error deleting subscription");
    } finally {
      setDeleteId(null);
      setIsConfirmOpen(false);
    }
  };

  // الفلترة
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const name = subscription.playerId?.fullName?.toLowerCase() || "";
    const matchesSearch = name.includes(filters.searchTerm.toLowerCase());

    const matchesStatus =
      !filters.filterStatus ||
      (filters.filterStatus === "paid" && subscription.hasPaid) ||
      (filters.filterStatus === "unpaid" && !subscription.hasPaid);

    const matchesYear =
      !filters.filterYear ||
      subscription.playerId?.birthYear?.toString() === filters.filterYear;

    return matchesSearch && matchesStatus && matchesYear;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Subscriptions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {subscriptions.length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalIncome.toFixed(2)} EGP
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {overdueSubscriptions.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by player name..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter("searchTerm", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filters.filterStatus}
            onChange={(e) => updateFilter("filterStatus", e.target.value)}
            options={[
              { value: "", label: "All Status" },
              { value: "paid", label: "Paid" },
              { value: "unpaid", label: "Unpaid" },
            ]}
          />
          <Select
            value={filters.filterYear}
            onChange={(e) => updateFilter("filterYear", e.target.value)}
            options={[
              { value: "", label: "All Years" },
              { value: "2024", label: "2024" },
              { value: "2023", label: "2023" },
              { value: "2022", label: "2022" },
            ]}
          />
          {user?.role === "ADMIN" && (
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      {filteredSubscriptions.length === 0 ? (
        <EmptyState
          title="No subscriptions found"
          description="Try adjusting your search or add a new subscription."
          action={
            user?.role === "ADMIN" && (
              <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Subscription
              </Button>
            )
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                  {user?.role === "ADMIN" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub._id} className={isOverdue(sub) ? "bg-red-50" : ""}>
                    <td className="px-6 py-4">{sub.playerId?.fullName}</td>
                    <td className="px-6 py-4">{new Date(sub.month).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</td>
                    <td className="px-6 py-4">{sub.amount} EGP</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${sub.hasPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {sub.hasPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {sub.paymentDate ? new Date(sub.paymentDate).toLocaleDateString() : "-"}
                    </td>
                    {user?.role === "ADMIN" && (
                      <td className="px-6 py-4 flex space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(sub)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="text-red-600" onClick={() => handleDelete(sub._id)}>
                         <Trash2 className="h-4 w-4" /> 
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal */}
      {user?.role === "ADMIN" && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingSubscription ? "Edit Subscription" : "Add Subscription"}
        >
          <SubscriptionForm
            players={players}
            initialData={editingSubscription}
            onSubmit={handleSave}
            onCancel={closeModal}
          />
        </Modal>
      )}

      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        title="تأكيد الحذف"
        description="لن تتمكن من استرجاع الاشتراك بعد الحذف."
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SubscriptionsPage;
