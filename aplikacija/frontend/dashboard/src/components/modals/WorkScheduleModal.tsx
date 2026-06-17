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
  mondayFrom: "09:00",
  mondayTo: "17:00",
  mondayOff: false,

  tuesdayFrom: "09:00",
  tuesdayTo: "17:00",
  tuesdayOff: false,

  wednesdayFrom: "09:00",
  wednesdayTo: "17:00",
  wednesdayOff: false,

  thursdayFrom: "09:00",
  thursdayTo: "17:00",
  thursdayOff: false,

  fridayFrom: "09:00",
  fridayTo: "17:00",
  fridayOff: false,

  saturdayFrom: "09:00",
  saturdayTo: "15:00",
  saturdayOff: false,

  sundayFrom: "",
  sundayTo: "",
  sundayOff: true,
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
      mondayFrom: schedule.monday.from ?? "09:00",
      mondayTo: schedule.monday.to ?? "15:00",
      mondayOff: schedule.monday.off,

      tuesdayFrom: schedule.tuesday.from ?? "09:00",
      tuesdayTo: schedule.tuesday.to ?? "15:00",
      tuesdayOff: schedule.tuesday.off,

      wednesdayFrom: schedule.wednesday.from ?? "09:00",
      wednesdayTo: schedule.wednesday.to ?? "15:00",
      wednesdayOff: schedule.wednesday.off,

      thursdayFrom: schedule.thursday.from ?? "09:00",
      thursdayTo: schedule.thursday.to ?? "15:00",
      thursdayOff: schedule.thursday.off,

      fridayFrom: schedule.friday.from ?? "09:00",
      fridayTo: schedule.friday.to ?? "15:00",
      fridayOff: schedule.friday.off,

      saturdayFrom: schedule.saturday.from ?? "09:00",
      saturdayTo: schedule.saturday.to ?? "15:00",
      saturdayOff: schedule.saturday.off,

      sundayFrom: schedule.sunday.from ?? "09:00",
      sundayTo: schedule.sunday.to ?? "15:00",
      sundayOff: schedule.sunday.off,
    });

    setError("");
  }, [open, schedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
        off: formData.mondayOff,
      },
      tuesday: {
        from: formData.tuesdayFrom,
        to: formData.tuesdayTo,
        off: formData.tuesdayOff,
      },
      wednesday: {
        from: formData.wednesdayFrom,
        to: formData.wednesdayTo,
        off: formData.wednesdayOff,
      },
      thursday: {
        from: formData.thursdayFrom,
        to: formData.thursdayTo,
        off: formData.thursdayOff,
      },
      friday: {
        from: formData.fridayFrom,
        to: formData.fridayTo,
        off: formData.fridayOff,
      },
      saturday: {
        from: formData.saturdayFrom,
        to: formData.saturdayTo,
        off: formData.saturdayOff,
      },
      sunday: {
        from: formData.sundayFrom,
        to: formData.sundayTo,
        off: formData.sundayOff,
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
          {days.map((day) => {
            const offKey = `${day.key}Off` as keyof typeof formData;
            const isOff = formData[offKey] as boolean;

            return (
              <div
                key={day.key}
                className="grid sm:grid-cols-[90px_1fr_1fr] gap-6"
              >
                <div className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    name={offKey}
                    checked={!isOff}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [offKey]: !e.target.checked,
                      }))
                    }
                    className="h-4 w-4 shrink-0 accent-primary"
                  />
                  <label className={!isOff ? "" : "text-muted"}>
                    {day.label}
                  </label>
                </div>

                <input
                  type="time"
                  name={`${day.key}From`}
                  value={
                    formData[
                      `${day.key}From` as keyof typeof formData
                    ] as string
                  }
                  disabled={isOff}
                  onChange={handleChange}
                  className="light-input"
                />

                <input
                  type="time"
                  name={`${day.key}To`}
                  value={
                    formData[`${day.key}To` as keyof typeof formData] as string
                  }
                  disabled={isOff}
                  onChange={handleChange}
                  className="light-input"
                />
              </div>
            );
          })}
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
