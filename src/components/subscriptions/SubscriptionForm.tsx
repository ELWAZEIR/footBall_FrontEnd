import React, { useEffect, useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface Player {
  _id: string;
  fullName: string;
  birthYear: number;
}

interface SubscriptionFormProps {
  onSubmit: (formData: any) => void;
  initialData?: any;
  players: Player[];
  onCancel: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSubmit,
  initialData,
  players,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    playerId: "",
    month: "",
    hasPaid: false,
    paymentDate: "",
    amount: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        playerId: initialData.playerId?._id || "",
        month: initialData.month || "",
        hasPaid: initialData.hasPaid || false,
        paymentDate: initialData.paymentDate
          ? new Date(initialData.paymentDate).toISOString().split("T")[0]
          : "",
        amount: initialData.amount || 0,
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid =
    formData.playerId.trim() !== "" &&
    formData.month.trim() !== "" &&
    formData.amount > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
     <Select
  label="Player"
  value={formData.playerId}
  onChange={(e) => handleChange("playerId", e.target.value)}
  options={Array.isArray(players) ? players.map((p) => ({
    value: p._id,
    label: `${p.fullName} (${p.birthYear})`,
  })) : []}
  placeholder="Select a player"
/>


      <Input
        label="Month"
        type="month"
        value={formData.month}
        onChange={(e) => handleChange("month", e.target.value)}
      />

      <Input
        label="Payment Date"
        type="date"
        value={formData.paymentDate || ""}
        onChange={(e) => handleChange("paymentDate", e.target.value)}
      />

      <Input
        label="Amount"
        type="number"
        value={formData.amount}
        onChange={(e) => handleChange("amount", Number(e.target.value))}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.hasPaid}
          onChange={(e) => handleChange("hasPaid", e.target.checked)}
        />
        <label>Has Paid</label>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={!isValid}
          className={`px-4 py-2 rounded ${
            isValid ? "bg-blue-600 text-white" : "bg-gray-400 text-gray-700"
          }`}
        >
          Save Subscription
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SubscriptionForm;
