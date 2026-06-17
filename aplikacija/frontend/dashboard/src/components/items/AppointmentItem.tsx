import { Calendar, Phone, Scissors, Store } from "lucide-react";
import type { IAppointment } from "../../types/appointments";
import UserAvatar from "../ui/UserAvatar";

type Props = {
  appointment: IAppointment;
};

const AppointmentItem = ({ appointment }: Props) => {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex min-w-0 items-start gap-4">
          <UserAvatar fullName={appointment.clientName} size={60} />

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-text">
              {appointment.clientName}
            </h3>

            <div className="mt-1 flex items-center gap-2 text-sm text-muted">
              <Phone size={14} />
              {appointment.clientPhone}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                <UserAvatar
                  fullName={appointment.barber.user.fullName}
                  size={25}
                />
                {appointment.barber.user.fullName}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                <Scissors size={14} />
                {`${appointment.service.name} (${appointment.service.length})`}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                <Store size={14} />
                {appointment.barber.salon.name}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-row items-center gap-3 lg:flex-col lg:items-end">
          <div className="rounded-xl border border-border bg-card px-4 py-2 text-center">
            <div className="text-xs text-muted">Date</div>

            <div className="flex items-center gap-1 font-medium text-text">
              <Calendar size={14} />
              {appointment.date}
            </div>
          </div>

          <div className="rounded-xl bg-primary px-4 py-2 text-center text-primary-foreground">
            <div className="text-xs opacity-80">Time</div>

            <div className="font-semibold">
              {appointment.startTime} - {appointment.endTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;
