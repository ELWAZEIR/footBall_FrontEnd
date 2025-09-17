// import React, { useState } from 'react';
// import { useAuthStore } from '../store/authStore';
// import { usePlayers } from '../hooks/usePlayers';
// import { useModal } from '../hooks/useModal';
// import { useFilters } from '../hooks/useFilters';
// import Card from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import Input from '../components/ui/Input';
// import Select from '../components/ui/Select';
// import Modal from '../components/ui/Modal';
// import LoadingSpinner from '../components/common/LoadingSpinner';
// import EmptyState from '../components/common/EmptyState';
// import PlayerForm from '../components/players/PlayerForm';
// import { Plus, Edit, Trash2, Search } from 'lucide-react';
// import ConfirmDeleteModal from '../components/common/ConfirmDelete';

// interface Player {
//   _id?: string;
//   fullName: string;
//   birthYear: number;
//   parentPhone: string;
//   notes?: string;
// }

// const PlayersPage: React.FC = () => {
//   const { user } = useAuthStore();
//   const {
//     players,
//     loading: isLoading,
//     createPlayer: addPlayer,
//     updatePlayer: editPlayer,
//     deletePlayer: removePlayer,
//   } = usePlayers();

//   const { isOpen: isModalOpen, openModal, closeModal } = useModal();
//   const { filters, updateFilter } = useFilters();

//   const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Confirm delete modal state
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     birthYear: '',
//     parentPhone: '',
//     notes: '',
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const playerData: Player = {
//         fullName: formData.fullName.trim(),
//         birthYear: parseInt(formData.birthYear, 10),
//         parentPhone: formData.parentPhone.trim(),
//         notes: formData.notes.trim(),
//       };

//       if (editingPlayer?._id) {
//         await editPlayer(editingPlayer._id, playerData);
//       } else {
//         await addPlayer(playerData);
//       }

//       closeModal();
//       resetForm();
//     } catch (error) {
//       console.error('Error saving player:', error);
//       // أي توست خطأ غالباً بيتعامل معه الهوك
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEdit = (player: Player) => {
//     setEditingPlayer(player);
//     setFormData({
//       fullName: player.fullName,
//       birthYear: player.birthYear.toString(),
//       parentPhone: player.parentPhone,
//       notes: player.notes || '',
//     });
//     openModal();
//   };

//   const handleDelete = (id: string) => {
//     setDeleteId(id);
//     setIsConfirmOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteId) return;
//     await removePlayer(deleteId);
//     setDeleteId(null);
//     // غلق المودال يتم من داخل ConfirmDeleteModal بعد نجاح onConfirm باستدعاء onClose
//   };

//   const resetForm = () => {
//     setFormData({
//       fullName: '',
//       birthYear: '',
//       parentPhone: '',
//       notes: '',
//     });
//     setEditingPlayer(null);
//   };

//   const handleModalClose = () => {
//     closeModal();
//     resetForm();
//   };

//   const filteredPlayers = players.filter((player: Player) => {
//     const matchesSearch = player.fullName
//       .toLowerCase()
//       .includes((filters.searchTerm || '').toLowerCase());
//     const matchesYear =
//       !filters.filterYear || player.birthYear.toString() === filters.filterYear;

//     return matchesSearch && matchesYear;
//   });

//   const availableYears = [...new Set(players.map((p: Player) => p.birthYear.toString()))]
//     .sort((a, b) => parseInt(b) - parseInt(a));

//   if (isLoading && players.length === 0) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Statistics Cards */}
//       {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
//         <Card>
//           <div className="flex items-center">
//             <div className="p-2 ml-3 bg-blue-100 rounded-lg">
//               <Plus className="h-6 w-6 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">إجمالي اللاعبين</p>
//               <p className="text-2xl font-bold text-gray-900">{players.length}</p>
//             </div>
//           </div>
//         </Card>
//         {/* <Card>
//           <div className="flex items-center">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <Edit className="h-6 w-6 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">اللاعبين النشطين</p>
//               <p className="text-2xl font-bold text-gray-900">{players.length}</p>
//             </div>
//           </div>
//         </Card> */}
//       {/* </div> */}

//       {/* Filters */}
//       <Card>
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="البحث بواسطة اسم اللاعب..."
//                 value={filters.searchTerm}
//                 onChange={(e) => updateFilter('searchTerm', e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>
//           <Select
//             value={filters.filterYear}
//             onChange={(e) => updateFilter('filterYear', e.target.value)}
//             options={[
//               { value: '', label: 'جميع السنوات' },
//               ...availableYears.map((year) => ({
//                 value: year,
//                 label: year,
//               })),
//             ]}
//           />
//           {user?.role === 'ADMIN' && (
//             <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
//               <Plus className="h-4 w-4 mr-2" />
//               إضافة لاعب
//             </Button>
//           )}
//         </div>
//       </Card>

//       {/* Players Table */}
//       {filteredPlayers.length === 0 ? (
//         <EmptyState
//           title="لا يوجد لاعبين"
//           description="جرب تعديل البحث أو أضف لاعب جديد."
//           action={
//             user?.role === 'ADMIN' && (
//               <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
//                 <Plus className="h-4 w-4 mr-2" />
//                 إضافة لاعب
//               </Button>
//             )
//           }
//         />
//       ) : (
//         <Card>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     اسم اللاعب
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     سنة الميلاد
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     هاتف ولي الأمر
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     ملاحظات
//                   </th>
//                   {user?.role === 'ADMIN' && (
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       الإجراءات
//                     </th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredPlayers.map((player: Player) => (
//                   <tr key={player._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {player.fullName}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {player.birthYear}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {player.parentPhone}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">
//                       <div className="max-w-xs truncate">
//                         {player.notes || '-'}
//                       </div>
//                     </td>
//                     {user?.role === 'ADMIN' && (
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <Button
//                             variant="secondary"
//                             size="sm"
//                             onClick={() => handleEdit(player)}
//                             title="تعديل اللاعب"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             size="sm"
//                             onClick={() => handleDelete(player._id!)}
//                             className="text-red-600 hover:text-red-700"
//                             title="حذف اللاعب"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* Modal for Adding/Editing Players */}
//       {user?.role === 'ADMIN' && (
//         <Modal
//           isOpen={isModalOpen}
//           onClose={handleModalClose}
//           title={editingPlayer ? 'تعديل اللاعب' : 'إضافة لاعب جديد'}
//         >
//           <PlayerForm
//             formData={formData}
//             setFormData={setFormData}
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting}
//           />
//         </Modal>
//       )}

//       {/* Confirm Delete Modal (أحمر – يمنع الضغط خارج المودال) */}
//       <ConfirmDeleteModal
//         isOpen={isConfirmOpen}
//         title="تأكيد حذف اللاعب"
//         description="لن تتمكن من استرجاع هذا اللاعب بعد الحذف."
//         onClose={() => {
//           setIsConfirmOpen(false);
//           setDeleteId(null);
//         }}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// };

// export default PlayersPage;

import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePlayers } from '../hooks/usePlayers';
import { useModal } from '../hooks/useModal';
import { useFilters } from '../hooks/useFilters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import PlayerForm from '../components/players/PlayerForm';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import ConfirmDeleteModal from '../components/common/ConfirmDelete';
import { PlayerFormData } from '../hooks/usePlayers'; // 👈 مهم

interface Player {
  _id?: string;
  fullName: string;
  birthYear: number;
  parentPhone: string;
  notes?: string;
}

const PlayersPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    players,
    loading: isLoading,
    createPlayer: addPlayer,
    updatePlayer: editPlayer,
    deletePlayer: removePlayer,
  } = usePlayers();

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { filters, updateFilter } = useFilters();

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirm delete modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<PlayerFormData>({
    fullName: '',
    birthYear: '', // 👈 string في الفورم
    parentPhone: '',
    notes: '',
  });

  const handleSubmit = async (data: PlayerFormData) => {
    setIsSubmitting(true);
    try {
      const playerData: Player = {
        fullName: data.fullName.trim(),
        birthYear: parseInt(data.birthYear, 10), // 👈 تحويل لرقم
        parentPhone: data.parentPhone.trim(),
        notes: data.notes?.trim(),
      };

      if (editingPlayer?._id) {
        await editPlayer(editingPlayer._id, playerData);
      } else {
        await addPlayer(playerData);
      }

      closeModal();
      resetForm();
    } catch (error) {
      console.error('Error saving player:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      fullName: player.fullName,
      birthYear: player.birthYear.toString(), // 👈 string للفورم
      parentPhone: player.parentPhone,
      notes: player.notes || '',
    });
    openModal();
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await removePlayer(deleteId);
    setDeleteId(null);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      birthYear: '',
      parentPhone: '',
      notes: '',
    });
    setEditingPlayer(null);
  };

  const handleModalClose = () => {
    closeModal();
    resetForm();
  };

  const filteredPlayers = players.filter((player: Player) => {
    const matchesSearch = player.fullName
      .toLowerCase()
      .includes((filters.searchTerm || '').toLowerCase());
    const matchesYear =
      !filters.filterYear || player.birthYear.toString() === filters.filterYear;

    return matchesSearch && matchesYear;
  });

  const availableYears = [...new Set(players.map((p: Player) => p.birthYear.toString()))]
    .sort((a, b) => parseInt(b) - parseInt(a));

  if (isLoading && players.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Cards */}
      <Card>
        <div className="flex items-center">
          <div className="p-2 ml-3 bg-blue-100 rounded-lg">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">إجمالي اللاعبين</p>
            <p className="text-2xl font-bold text-gray-900">{players.length}</p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث بواسطة اسم اللاعب..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filters.filterYear}
            onChange={(e) => updateFilter('filterYear', e.target.value)}
            options={[
              { value: '', label: 'جميع السنوات' },
              ...availableYears.map((year) => ({
                value: year,
                label: year,
              })),
            ]}
          />
          {user?.role === 'ADMIN' && (
            <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              إضافة لاعب
            </Button>
          )}
        </div>
      </Card>

      {/* Players Table */}
      {filteredPlayers.length === 0 ? (
        <EmptyState
          title="لا يوجد لاعبين"
          description="جرب تعديل البحث أو أضف لاعب جديد."
          action={
            user?.role === 'ADMIN' && (
              <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                إضافة لاعب
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم اللاعب
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سنة الميلاد
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    هاتف ولي الأمر
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ملاحظات
                  </th>
                  {user?.role === 'ADMIN' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers.map((player: Player) => (
                  <tr key={player._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {player.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {player.birthYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {player.parentPhone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {player.notes || '-'}
                      </div>
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(player)}
                            title="تعديل اللاعب"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDelete(player._id!)}
                            className="text-red-600 hover:text-red-700"
                            title="حذف اللاعب"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
      {user?.role === 'ADMIN' && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingPlayer ? 'تعديل اللاعب' : 'إضافة لاعب جديد'}
        >
          <PlayerForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit} // 👈 بياخد Data مش Event
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        title="تأكيد حذف اللاعب"
        description="لن تتمكن من استرجاع هذا اللاعب بعد الحذف."
        onClose={() => {
          setIsConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PlayersPage;
