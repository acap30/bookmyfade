import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";

import Modal from "../ui/Modal";

type ISalon = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

type Props = {
  open: boolean;
  onClose: () => void;

  salon: ISalon | null;

  onSubmit: (id: number, data: Omit<ISalon, "id">) => Promise<void> | void;
};

const initialState = {
  name: "",
  address: "",
  phone: "",
};

const EditSalonModal = ({ open, onClose, salon, onSubmit }: Props) => {
  const [formData, setFormData] = useState(initialState);

  const [error, setError] = useState("");

  useEffect(() => {
    if (salon) {
      setFormData({
        name: salon.name,
        address: salon.address,
        phone: salon.phone,
      });
    }
  }, [salon]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = () => {
    setError("");

    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.address.trim() ||
      !formData.phone.trim()
    ) {
      setError("All fields are required");
      return;
    }

    if (!salon) return;

    try {
      await onSubmit(salon.id, formData);

      handleClose();
    } catch (error) {
      console.error(error);

      setError("Failed to update salon");
    }
  };

  return (
    <Modal open={open} title="Edit Salon">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm text-muted">Salon Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter salon name"
            className="light-input"
          />
        </div>

        {/* Address */}
        <div>
          <label className="mb-2 block text-sm text-muted">Address</label>

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="light-input"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm text-muted">Phone</label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="light-input"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            <CircleAlert size={16} />

            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 cursor-pointer"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-text transition hover:bg-accent cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSalonModal;
