import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onClose: () => void; // يُستدعى عند إلغاء فقط
  onConfirm: () => Promise<void> | void; // يُستدعى عند تأكيد الحذف
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirm();
      // نغلق من داخل المودال بعد نجاح الحذف
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay يمنع الضغط خارج المودال */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Dialog */}
      <div className="relative z-[101] w-full max-w-md rounded-2xl shadow-2xl select-none">
        <div className="bg-red-600 text-white rounded-2xl p-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-lg font-bold text-center mb-2">
            {title || "هل أنت متأكد من الحذف؟"}
          </h2>
          {description && (
            <p className="text-center text-white/90 mb-6">{description}</p>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 font-medium disabled:opacity-60"
            >
              إلغاء
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-5 py-2 rounded-lg bg-white text-red-600 font-semibold hover:bg-gray-100 disabled:opacity-60 flex items-center gap-2"
            >
              {isDeleting && (
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
