import {
  Mail,
  Phone,
  Scissors,
  Plus,
  Trash2,
  Loader2,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { IService } from "../../types/service";
import { useParams } from "react-router-dom";
import {
  getSerivicesBySalonId,
  getServicesByBarberId,
  linkServiceToBarber,
  unlinkServiceFromBarber,
} from "../../api/servicesApi";
import type { IBarber } from "../../types/barber";
import { getBarberById } from "../../api/barbersApi";
import UserAvatar from "../../components/ui/UserAvatar";
import LinkServiceModal from "../../components/modals/LinkServiceModal";

const weeklySchedule = [
  {
    day: "Monday",
    from: "09:00",
    to: "17:00",
  },
  {
    day: "Tuesday",
    from: "09:00",
    to: "17:00",
  },
  {
    day: "Wednesday",
    from: "10:00",
    to: "18:00",
  },
  {
    day: "Thursday",
    from: "09:00",
    to: "17:00",
  },
  {
    day: "Friday",
    from: "09:00",
    to: "15:00",
  },
  {
    day: "Saturday",
    from: "09:00",
    to: "15:00",
  },
];

const daysOff = [
  {
    id: 1,
    from: "2026-05-20",
    to: "2026-05-22",
    reason: "Vacation",
  },
  {
    id: 2,
    from: "2026-06-02",
    to: "2026-06-02",
    reason: "Medical Leave",
  },
];

const BarberDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [barber, setBarber] = useState<IBarber>(null);
  const [services, setServices] = useState<IService[]>([]);
  const [avaliableServices, setAvaliableServices] = useState<IService[]>([]);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);

  const fetchBarber = async (barber_id: string) => {
    try {
      const services = await getServicesByBarberId(barber_id);
      const barber = await getBarberById(barber_id);
      const salonsServices = await getSerivicesBySalonId(`${barber.salon.id}`);
      setBarber(barber);
      setServices(services);
      setAvaliableServices(salonsServices);
    } catch (err) {
      console.error("Failed to fetch barber details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarber(id);
  }, []);

  const handleDeleteService = async (service_id) => {
    await unlinkServiceFromBarber(service_id, id);
    fetchBarber(id);
  };

  const handleAddService = async (data) => {
    await linkServiceToBarber(id, data.serviceId, data.price);
    fetchBarber(id);
  };
  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted">
          <Loader2 className="mb-3 animate-spin" size={40} />
          <p className="text-sm">Loading barber...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-5">
                <UserAvatar fullName={barber.user.fullName} size={70} />

                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-text">
                      {barber.user.fullName}
                    </h1>

                    <div className="flex items-center gap-2 text-sm text-muted rounded-xl bg-background border border-border px-3 py-2">
                      <Store size={15} />
                      {barber.salon.name}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-muted">
                    <div className="flex items-center gap-2">
                      <Mail size={15} />
                      {barber.user.email}
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={15} />
                      {barber.user.phoneNumber || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Services */}
            <div className="flex h-fit flex-col items-stretch justify-between rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-1 flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text">Services</h2>

                  <span className="text-sm text-muted">
                    {services.length} services
                  </span>
                </div>

                <div className="flex flex-1 flex-col space-y-3">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="flex items-center gap-2">
                          <div className="icon-container">
                            <Scissors size={18} />
                          </div>
                          <div>
                            <h3 className="font-medium text-text">
                              {service.name}
                            </h3>
                            <p className="text-sm text-muted">
                              {service.length} min
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="rounded-xl border border-border bg-card px-3 py-1 text-sm font-medium text-text">
                            ${service.price}
                          </div>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 border border-red-500/20 bg-red-500/10 transition-colors hover:bg-red-500/20 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl py-10 text-center">
                      <Scissors size={32} className="text-muted mb-3" />

                      <h3 className="font-medium text-text">
                        No services found
                      </h3>

                      <p className="mt-1 text-sm text-muted">
                        Try adding new service to this barber
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="button-add w-full"
                onClick={() => setAddServiceModalOpen(true)}
              >
                <Plus size={18} />
                <p>Add Service</p>
              </button>
            </div>

            {/* Weekly Schedule */}
            <div className="rounded-2xl h-fit border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text">
                  Weekly Schedule
                </h2>
              </div>

              <div className="space-y-3">
                {weeklySchedule.map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
                  >
                    <div className="font-medium text-text">{schedule.day}</div>

                    <div className="text-sm text-muted">
                      {schedule.from} - {schedule.to}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Days Off */}
            <div className="rounded-2xl h-fit md:col-span-2 xl:col-span-1 border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text">Days Off</h2>

                <button className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 cursor-pointer">
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-sm text-muted">
                      <th className="pb-2 font-medium">From</th>
                      <th className="pb-2 font-medium">To</th>
                      <th className="pb-2 font-medium">Reason</th>
                    </tr>
                  </thead>

                  <tbody>
                    {daysOff.map((day) => (
                      <tr key={day.id} className="bg-background">
                        <td className="rounded-l-xl border-y border-l border-border px-3 py-3 text-sm text-text">
                          {day.from}
                        </td>

                        <td className="border-y border-border px-3 py-3 text-sm text-text">
                          {day.to}
                        </td>

                        <td className="rounded-r-xl border-y border-r border-border px-3 py-3 text-sm text-muted">
                          {day.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <LinkServiceModal
              open={addServiceModalOpen}
              onClose={() => setAddServiceModalOpen(false)}
              services={avaliableServices}
              onSubmit={(data) => handleAddService(data)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BarberDetails;
