import { AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;

  title?: string;
  subtitle?: string;
  message?: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;
};

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  subtitle = "Delete Selected Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}: Props) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal open={open} title={title}>
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertTriangle size={24} />
          </div>

          <div>
            <h3 className="font-semibold">{subtitle}</h3>

            <p className="mt-1 text-sm text-muted">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm transition hover:bg-accent disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
