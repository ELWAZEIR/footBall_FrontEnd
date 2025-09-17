// import React from 'react';
// import { PlayerFormData } from '../../hooks/usePlayers';
// import Button from '../ui/Button';
// import Input from '../ui/Input';

// interface PlayerFormProps {
//   formData: PlayerFormData;
//   setFormData: (data: PlayerFormData) => void;
//   onSubmit: (e: React.FormEvent) => void;
//   isSubmitting?: boolean;
// }

// const PlayerForm: React.FC<PlayerFormProps> = ({
//   formData,
//   setFormData,
//   onSubmit,
//   isSubmitting = false,
// }) => {
//   const handleInputChange = (field: keyof PlayerFormData, value: string) => {
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//   return (
//     <form onSubmit={onSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Full Name
//         </label>
//         <Input
//           type="text"
//           value={formData.fullName}
//           onChange={(e) => handleInputChange('fullName', e.target.value)}
//           placeholder="Enter full name"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Birth Year
//         </label>
//         <Input
//           type="number"
//           value={formData.birthYear}
//           onChange={(e) => handleInputChange('birthYear', e.target.value)}
//           placeholder="Enter birth year"
//           min="1990"
//           max="2024"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Parent Phone
//         </label>
//         <Input
//           maxLength={11}
//           type="tel"
//           value={formData.parentPhone}
//           onChange={(e) => handleInputChange('parentPhone', e.target.value)}
//           placeholder="Enter parent phone number"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Notes
//         </label>
//         <textarea
//           value={formData.notes}
//           onChange={(e) => handleInputChange('notes', e.target.value)}
//           placeholder="Enter any notes"
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           rows={3}
//         />
//       </div>

//       <div className="flex justify-end space-x-3 pt-4">
//         <Button
//           type="submit"
//           disabled={isSubmitting || !formData.fullName || !formData.birthYear || !formData.parentPhone}
//           className="bg-blue-600 hover:bg-blue-700"
//         >
//           {isSubmitting ? 'Saving...' : 'Save Player'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default PlayerForm;
import React, { useState } from 'react';
import * as Yup from 'yup';
import { PlayerFormData } from '../../hooks/usePlayers';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface PlayerFormProps {
  formData: PlayerFormData;
  setFormData: (data: PlayerFormData) => void;
  onSubmit: (data: PlayerFormData) => void; // 👈 هنا نستقبل Data مش Event
  isSubmitting?: boolean;
}

// ✅ Yup Schema
const playerSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name cannot exceed 50 characters')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'Only Arabic and English letters are allowed')
    .required('Full name is required'),

  birthYear: Yup.number()
    .typeError('Birth year must be a number')
    .min(1990, 'Birth year must be after 1990')
    .max(new Date().getFullYear(), `Birth year cannot exceed ${new Date().getFullYear()}`)
    .required('Birth year is required'),

  parentPhone: Yup.string()
    .matches(
      /^(010|011|012|015)[0-9]{8}$/,
      'Phone number must be a valid Egyptian number (11 digits starting with 010, 011, 012, or 015)'
    )
    .required('Parent phone is required'),

  notes: Yup.string()
    .max(200, 'Notes cannot exceed 200 characters')
    .nullable(),
});

const PlayerForm: React.FC<PlayerFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isSubmitting = false,
}) => {
  const [errors, setErrors] = useState<{ [key in keyof PlayerFormData]?: string }>({});

  const handleInputChange = (field: keyof PlayerFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // ✅ فاليديشن لحظي عند التعديل
    playerSchema
      .validateAt(field, { ...formData, [field]: value })
      .then(() => {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      })
      .catch((err) => {
        setErrors((prev) => ({ ...prev, [field]: err.message }));
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await playerSchema.validate(formData, { abortEarly: false });
      setErrors({});
      onSubmit(formData); // 👈 نرسل البيانات جاهزة بعد الفاليديشن
    } catch (err: any) {
      if (err.inner) {
        const newErrors: { [key in keyof PlayerFormData]?: string } = {};
        err.inner.forEach((validationError: any) => {
          newErrors[validationError.path as keyof PlayerFormData] = validationError.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <Input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Enter full name"
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
      </div>

      {/* Birth Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Birth Year
        </label>
        <Input
          type="number"
          value={formData.birthYear}
          onChange={(e) => handleInputChange('birthYear', e.target.value)}
          placeholder="Enter birth year"
          min="1990"
          max={new Date().getFullYear()}
        />
        {errors.birthYear && <p className="text-red-500 text-sm">{errors.birthYear}</p>}
      </div>

      {/* Parent Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Parent Phone
        </label>
        <Input
          maxLength={11}
          type="tel"
          value={formData.parentPhone}
          onChange={(e) => handleInputChange('parentPhone', e.target.value)}
          placeholder="Enter parent phone number"
        />
        {errors.parentPhone && <p className="text-red-500 text-sm">{errors.parentPhone}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Enter any notes"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
        {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : 'Save Player'}
        </Button>
      </div>
    </form>
  );
};

export default PlayerForm;

