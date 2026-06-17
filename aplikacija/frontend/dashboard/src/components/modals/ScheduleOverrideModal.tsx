import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";

import Modal from "../ui/Modal";
import type { IScheduleOverride } from "../../types/workSchedule";

type Props = {
  open: boolean;
  override?: IScheduleOverride | null;
  selectedDate?: Date;
  onClose: () => void;
  onCreate: (data: IScheduleOverride) => Promise<void>;
  onUpdate: (id: number, data: IScheduleOverride) => Promise<void>;
};

const emptyForm: IScheduleOverride = {
  id: 0,
  date: "",
  from: "09:00",
  to: "17:00",
  off: false,
};

const ScheduleOverrideModal = ({
  open,
  override,
  selectedDate,
  onClose,
  onCreate,
  onUpdate,
}: Props) => {
  const [formData, setFormData] = useState<IScheduleOverride>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (override) {
      setFormData(override);
      return;
    }

    setFormData({
      ...emptyForm,
      date: selectedDate ? selectedDate.toLocaleDateString("sv-SE") : "",
    });

    setError("");
  }, [open, override, selectedDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    setError("");

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date) {
      setError("Date is required");
      return;
    }

    if (!formData.off && (!formData.from || !formData.to)) {
      setError("From and To are required");
      return;
    }

    try {
      if (override?.id) {
        await onUpdate(override.id, formData);
      } else {
        await onCreate(formData);
      }
      onClose();
    } catch (error: any) {
      setError("Something went wrong");
    }
  };

  return (
    <Modal open={open} title={override ? "Edit Override" : "Add Override"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">From</label>

            <input
              type="time"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="light-input"
              disabled={formData.off}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">To</label>

            <input
              type="time"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="light-input"
              disabled={formData.off}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="off"
            checked={!formData.off}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                off: !e.target.checked,
              }))
            }
            className="h-4 w-4 shrink-0 accent-primary"
          />

          <label className={formData.off ? "text-muted" : ""}>
            Working Day
          </label>
        </div>

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
            Save Override
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

export default ScheduleOverrideModal;
