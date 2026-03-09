interface DeleteModalProps {
  isOpen: null | boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 shadow-2xl w-full max-w-md rounded-2xl border border-green-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon & Text */}
        <div className="mb-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-700 text-center mb-2">
            {title}
          </h2>
          <p className="text-black text-center leading-relaxed">
            {description}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-black transition-all duration-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
