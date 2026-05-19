import { useState } from "react";
import { CircleAlert } from "lucide-react";

import Modal from "../ui/Modal";

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;

  title: string;

  fields: Field[];

  onSubmit: (data: Record<string, string>) => Promise<void> | void;
};

const AddModal = ({ open, onClose, title, fields, onSubmit }: Props) => {
  const initialState = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: "",
    }),
    {},
  );

  const [formData, setFormData] =
    useState<Record<string, string>>(initialState);

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasEmptyField = Object.values(formData).some(
      (value) => !value.trim(),
    );

    if (hasEmptyField) {
      setError("All fields are required");
      return;
    }

    try {
      await onSubmit(formData);

      setFormData(initialState);

      onClose();
    } catch (error) {
      console.error(error);

      setError("Something went wrong");
    }
  };

  const handleCancel = () => {
    setError("");

    setFormData(initialState);

    onClose();
  };

  return (
    <Modal open={open} onClose={handleCancel} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="text-sm text-muted">{field.label}</label>

            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="light-input"
            />
          </div>
        ))}

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
            {title}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-text transition hover:bg-accent cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddModal;
