'use client';

import { AlertCircle } from 'lucide-react';

interface WarningYesNoDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
  confirmingText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function WarningYesNoDialog({
  isOpen,
  title,
  message,
  subMessage,
  confirmText = '확인',
  cancelText = '취소',
  confirmingText = '처리 중...',
  onConfirm,
  onCancel,
  loading = false,
}: WarningYesNoDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
            {subMessage && (
              <p className="mt-2 text-xs text-gray-400">{subMessage}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? confirmingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
