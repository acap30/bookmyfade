import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";

import Modal from "../ui/Modal";
import type { IWorkSchedule } from "../../types/workSchedule";

type Props = {
  open: boolean;
  onClose: () => void;
  schedule?: IWorkSchedule | null;
  onSubmit: (data: IWorkSchedule) => Promise<void>;
};

const days = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

const emptyForm = {
  mondayFrom: "",
  mondayTo: "",
  tuesdayFrom: "",
  tuesdayTo: "",
  wednesdayFrom: "",
  wednesdayTo: "",
  thursdayFrom: "",
  thursdayTo: "",
  fridayFrom: "",
  fridayTo: "",
  saturdayFrom: "",
  saturdayTo: "",
  sundayFrom: "",
  sundayTo: "",
};

const WorkScheduleModal = ({ open, onClose, schedule, onSubmit }: Props) => {
  const [formData, setFormData] = useState(emptyForm);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (!schedule) {
      setFormData(emptyForm);
      return;
    }

    setFormData({
      mondayFrom: schedule.monday.from,
      mondayTo: schedule.monday.to,

      tuesdayFrom: schedule.tuesday.from,
      tuesdayTo: schedule.tuesday.to,

      wednesdayFrom: schedule.wednesday.from,
      wednesdayTo: schedule.wednesday.to,

      thursdayFrom: schedule.thursday.from,
      thursdayTo: schedule.thursday.to,

      fridayFrom: schedule.friday.from,
      fridayTo: schedule.friday.to,

      saturdayFrom: schedule.saturday.from,
      saturdayTo: schedule.saturday.to,

      sundayFrom: schedule.sunday.from,
      sundayTo: schedule.sunday.to,
    });

    setError("");
  }, [open, schedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const day of days) {
      const from = formData[`${day.key}From`];
      const to = formData[`${day.key}To`];

      if ((from && !to) || (!from && to)) {
        setError(`${day.label}: both From and To are required`);
        return;
      }
    }

    const scheduleData: IWorkSchedule = {
      monday: {
        from: formData.mondayFrom,
        to: formData.mondayTo,
      },
      tuesday: {
        from: formData.tuesdayFrom,
        to: formData.tuesdayTo,
      },
      wednesday: {
        from: formData.wednesdayFrom,
        to: formData.wednesdayTo,
      },
      thursday: {
        from: formData.thursdayFrom,
        to: formData.thursdayTo,
      },
      friday: {
        from: formData.fridayFrom,
        to: formData.fridayTo,
      },
      saturday: {
        from: formData.saturdayFrom,
        to: formData.saturdayTo,
      },
      sunday: {
        from: formData.sundayFrom,
        to: formData.sundayTo,
      },
    };

    try {
      await onSubmit(scheduleData);

      onClose();
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Something went wrong");
    }
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      title={schedule ? "Edit Work Schedule" : "Set Work Schedule"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {days.map((day) => (
            <div
              key={day.key}
              className="grid sm:grid-cols-[90px_1fr_1fr] gap-3"
            >
              <div className="font-medium text-text">{day.label}</div>

              <input
                type="time"
                name={`${day.key}From`}
                value={formData[`${day.key}From` as keyof typeof formData]}
                onChange={handleChange}
                className="light-input"
              />

              <input
                type="time"
                name={`${day.key}To`}
                value={formData[`${day.key}To` as keyof typeof formData]}
                onChange={handleChange}
                className="light-input"
              />
            </div>
          ))}
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
            Save Schedule
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

export default WorkScheduleModal;
