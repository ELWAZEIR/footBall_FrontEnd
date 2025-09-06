import { useState, useEffect } from "react";
import api from "../lib/api";

export interface Uniform {
  _id: string;
  playerId: string;
  hasPaid: boolean;
  hasReceived: boolean;
  size: string;
  amount: number;
  player: {
    id: string;
    fullName: string;
    birthYear: number;
  };
  createdAt: string;
}

export default function useUniforms() {
  const [uniforms, setUniforms] = useState<Uniform[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUniform, setEditingUniform] = useState<Uniform | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    playerId: "",
    hasPaid: false,
    hasReceived: false,
    size: "",
    amount: "",
  });

  useEffect(() => {
    fetchUniforms();
    fetchPlayers();
  }, []);

  const fetchUniforms = async () => {
    try {
      const response = await api.get("/uniforms");
      setUniforms(response.data);
    } catch (error) {
      console.error("Error fetching uniforms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await api.get("/players");
      setPlayers(response.data.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const data = {
        ...formData,
        // amount: parseFloat(formData.amount),
        amount: formData.amount ? parseFloat(formData.amount) : 0,
        size: formData.size.replace("SIZE_", ""),
      };

      if (editingUniform) {
        await api.put(`/uniforms/${editingUniform._id}`, data);
      } else {
        await api.post("/uniforms", data);
      }

      fetchUniforms();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving uniform:", error);
    }
  };

  const handleEdit = (uniform: Uniform) => {
    setEditingUniform(uniform);
    setFormData({
      playerId: uniform.playerId,
      hasPaid: uniform.hasPaid,
      hasReceived: uniform.hasReceived,
      size: uniform.size,
      amount: uniform.amount ? uniform.amount.toString() : "",

      // amount: uniform.amount.toString(),
    });
    setIsModalOpen(true);
  };

const handleDelete = (id: string) => {
  setDeleteId(id);
  setIsConfirmOpen(true);
};

const confirmDelete = async () => {
  if (!deleteId) return;
  try {
    await api.delete(`/uniforms/${deleteId}`);
    fetchUniforms();
  } catch (error) {
    console.error("Error deleting uniform:", error);
  } finally {
    setIsConfirmOpen(false);
    setDeleteId(null);
  }
};

  const resetForm = () => {
    setFormData({
      playerId: "",
      hasPaid: false,
      hasReceived: false,
      size: "",
      amount: "",
    });
    setEditingUniform(null);
  };
  
  return {
    uniforms,
    players,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    editingUniform,
    setEditingUniform,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    resetForm,
     handleDelete,     
  confirmDelete,    
  isConfirmOpen,    
  setIsConfirmOpen,
  };
}
