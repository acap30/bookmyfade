import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";

import Modal from "../ui/Modal";
import type { IService } from "../../types/service";

type Props = {
  open: boolean;
  onClose: () => void;

  service: IService | null;
  forBarber: boolean;

  onSubmit: (id: number, data: Omit<IService, "id">) => Promise<void> | void;
};

const EditServiceModal = ({
  open,
  onClose,
  service,
  forBarber,
  onSubmit,
}: Props) => {
  const initialState = {
    name: "",
    length: 0,
    price: 0,
  };
  const [formData, setFormData] = useState<Omit<IService, "id">>(initialState);

  const [error, setError] = useState("");

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        length: service.length,
        price: service.price,
      });
    }
  }, [service, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "length" || name === "price" ? Number(value) : value,
    }));
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!service) return;

    if (!forBarber && (!formData.name.trim() || formData.length <= 0)) {
      setError("Name and duration are required");
      return;
    }

    if (forBarber && formData.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    try {
      await onSubmit(service.id, formData);

      handleClose();
    } catch (error) {
      console.error(error);

      setError("Failed to update service");
    }
  };

  return (
    <Modal open={open} title="Edit Service">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Service Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="light-input"
            disabled={forBarber}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Duration (minutes)
          </label>

          <input
            type="number"
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="light-input"
            disabled={forBarber}
          />
        </div>

        {forBarber && (
          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              Price
            </label>

            <div className="flex items-center gap-2">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="light-input"
              />
              <p>RSD</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            <CircleAlert size={16} />
            <span>{error}</span>
          </div>
        )}

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

export default EditServiceModal;
