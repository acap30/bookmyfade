import { Calendar, Clock, Phone, Scissors } from "lucide-react";
import type { IAppointment } from "../../types/appointments";
import UserAvatar from "../ui/UserAvatar";

type Props = {
  appointment: IAppointment;
};

const AppointmentItem = ({ appointment }: Props) => {
  return (
    <div className="flex max-md:flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-background px-5 py-4">
      <div className="lg:grid w-full grid-cols-[300px_1fr] items-center lg:gap-6 flex lg:w-fit justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar fullName={appointment.clientName} size={40} />

          <div className="min-w-0">
            <p className="font-semibold truncate">{appointment.clientName}</p>
            <div className="flex items-center gap-2">
              <Phone size={12} />
              <p className="text-sm text-muted truncate">
                {appointment.clientPhone}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden lg:block rounded-lg p-3 border border-border bg-card shrink-0">
            <Scissors size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">
              {appointment.service.name}{" "}
              <span className="text-sm text-muted ">
                ({appointment.service.length} min)
              </span>
            </p>
            <p className="text-sm text-muted truncate">
              {appointment.barber.user.fullName} •{" "}
              {appointment.barber.salon.name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 justify-between md:justify-end w-full lg:w-fit">
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
