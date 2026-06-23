import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";

import Modal from "../ui/Modal";

type IService = {
  id: number;
  name: string;
  length: number;
};

type Props = {
  open: boolean;
  onClose: () => void;

  services: IService[];

  onSubmit: (data: {
    serviceId: number;
    price: number;
  }) => Promise<void> | void;
};

const LinkServiceModal = ({ open, onClose, services, onSubmit }: Props) => {
  const [selectedService, setSelectedService] = useState("");

  const [price, setPrice] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedService("");
      setPrice("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !price) {
      setError("All fields are required");
      return;
    }

    try {
      await onSubmit({
        serviceId: Number(selectedService),
        price: Number(price),
      });

      onClose();
    } catch (error) {
      console.error(error);

      setError("Failed to link service");
    }
  };

  return (
    <Modal open={open} title="Add Service">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Select */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Service
          </label>

          <select
            value={selectedService}
            onChange={(e) => {
              setError("");
              setSelectedService(e.target.value);
            }}
            className="light-input cursor-pointer"
          >
            <option value="">Select service</option>

            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.length} min)
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Price
          </label>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Enter service price"
              value={price}
              onChange={(e) => {
                setError("");
                setPrice(e.target.value);
              }}
              className="light-input"
            />
            <p>RSD</p>
          </div>
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
            Add Service
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-text transition hover:bg-accent cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LinkServiceModal;
