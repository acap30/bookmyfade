import { Calendar, Clock, Phone, Scissors } from "lucide-react";
import type { IAppointment } from "../../types/appointments";
import UserAvatar from "../ui/UserAvatar";

type Props = {
  appointment: IAppointment;
};

const AppointmentItem = ({ appointment }: Props) => {
  return (
    <div className="flex max-md:flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-background px-5 py-4">
      <div className="flex w-full lg:w-fit lg:gap-25 items-center justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar fullName={appointment.clientName} size={40} />

          <div>
            <p className="font-semibold">{appointment.clientName}</p>
            <div className="flex items-center gap-2">
              <Phone size={12} />
              <p className="text-sm text-muted">{appointment.clientPhone}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg p-3 border border-border bg-card">
            <Scissors size={20} />
          </div>
          <div>
            <p className="font-medium">
              {appointment.service.name}{" "}
              <span className="text-sm text-muted">
                ({appointment.service.length} min)
              </span>
            </p>
            <p className="text-sm text-muted">
              {appointment.barber.user.fullName} •{" "}
              {appointment.barber.salon.name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 justify-between w-full lg:w-fit">
        <div className="flex items-center gap-2">
          <Calendar size={18} />
          <div className="font-medium">{appointment.date}</div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
          <Clock size={18} />
          <p>{appointment.startTime}</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;
