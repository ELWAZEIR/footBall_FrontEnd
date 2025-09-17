// src/hooks/useDashboard.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../lib/api";
import { usePlayers } from "./usePlayers";
import { useModal } from "./useModal";
import { DashboardData } from "../types/Dashboard";
import {
  Users,
  DollarSign,
  Shirt,
  ClipboardList,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    fullName: "",
    birthYear: "",
    parentPhone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createPlayer: addPlayer } = usePlayers();

  const resetForm = () => {
    setFormData({
      fullName: "",
      birthYear: "",
      parentPhone: "",
      notes: "",
    });
  };

  // ✅ refreshDashboard function
  const refreshDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addPlayer({
        fullName: formData.fullName.trim(),
        birthYear: parseInt(formData.birthYear, 10),
        parentPhone: formData.parentPhone.trim(),
        notes: formData.notes.trim(),
      });
      navigate("/players"); 
      closeModal();
      resetForm();
    } catch (error) {
      console.error("Error saving player:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  // ✅ حساب totalIncome + stats + incomeBreakdown
  const totalIncome = useMemo(() => {
    if (!data) return 0;
    return (
      data.subscriptionIncome +
      data.uniformIncome +
      data.registrationIncome
    );
  }, [data]);

  const stats = useMemo(() => {
    if (!data) return [];
    return [
      {
        title: "Total Players",
        value: data.totalPlayers.toString(),
        icon: Users,
        gradient: "from-blue-500 to-blue-700",
      },
      {
        title: "Total Income",
        value: `${totalIncome.toLocaleString()} EGP`,
        icon: DollarSign,
        gradient: "from-green-500 to-green-700",
      },
      {
        title: "Unpaid Subscriptions",
        value: data.unpaidSubscriptions.toString(),
        icon: AlertCircle,
        gradient: "from-yellow-400 to-yellow-600",
      },
      {
        title: "Overdue Payments",
        value: data.overdueSubscriptions.toString(),
        icon: AlertCircle,
        gradient: "from-red-500 to-red-700",
      },
    ];
  }, [data, totalIncome]);

  const incomeBreakdown = useMemo(() => {
    if (!data) return [];
    return [
      {
        title: "Subscription Income",
        value: `${data.subscriptionIncome.toLocaleString()} EGP`,
        icon: TrendingUp,
        color: "text-blue-600",
      },
      {
        title: "Uniform Income",
        value: `${data.uniformIncome.toLocaleString()} EGP`,
        icon: Shirt,
        color: "text-purple-600",
      },
      {
        title: "Registration Income",
        value: `${data.registrationIncome.toLocaleString()} EGP`,
        icon: ClipboardList,
        color: "text-green-600",
      },
    ];
  }, [data]);

  return {
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
    totalIncome,
    stats,
    incomeBreakdown,
    refreshDashboard, // ✅ نرجعها علشان نقدر نعمل refresh من أي مكان
  };
};
