import useUniforms from "../hooks/useUniforms";
import UniformStats from "../components/uniforms/UniformStats";
import UniformFilters from "../components/uniforms/UniformFilters";
import UniformTable from "../components/uniforms/UniformTable";
import UniformForm from "../components/uniforms/UniformForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import ConfirmDeleteModal from "../components/common/ConfirmDelete";

const UniformsPage = () => {
  const {
    uniforms,
    players,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    editingUniform,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete
  } = useUniforms();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      );

  return (
    <div className="space-y-6">
      <UniformStats uniforms={uniforms} />
      <UniformFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onAdd={() => setIsModalOpen(true)}
      />
      <UniformTable
        uniforms={uniforms}
        onEdit={handleEdit}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingUniform ? "Edit Uniform" : "Add New Uniform"}
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
              {editingUniform ? "Update" : "Add"} Uniform
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <UniformForm
            players={players}
            formData={formData}
            setFormData={setFormData}
          />
        </form>
      </Modal>
      
      {/* مودال التأكيد على الحذف */}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        title="تأكيد الحذف"
        description="هل أنت متأكد أنك تريد حذف هذا الزي؟"
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UniformsPage;
