import {
  Mail,
  Phone,
  Scissors,
  Plus,
  Loader2,
  Store,
  Pencil,
  Calendar,
  CalendarX2,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { IService } from "../../types/service";
import { useParams } from "react-router-dom";
import {
  getSerivicesBySalonId,
  getServicesByBarberId,
  linkServiceToBarber,
  unlinkServiceFromBarber,
  updateServiceToBarber,
} from "../../api/servicesApi";
import type { IBarber } from "../../types/barber";
import { getBarberById } from "../../api/barbersApi";
import UserAvatar from "../../components/ui/UserAvatar";
import LinkServiceModal from "../../components/modals/LinkServiceModal";
import BarberServiceItem from "../../components/items/BarberServiceItem";
import EditServiceModal from "../../components/modals/EditServiceModal";
import type { IDayOff, IWorkSchedule } from "../../types/workSchedule";
import WorkScheduleModal from "../../components/modals/WorkScheduleModal";
import {
  createWorkSchedule,
  updateWorkSchedule,
} from "../../api/workScheduleApi";
import AddModal from "../../components/modals/AddModal";

// export const schedule: IWorkSchedule = {
//   monday: {
//     from: "08:00",
//     to: "16:00",
//   },
//   tuesday: {
//     from: "08:00",
//     to: "16:00",
//   },
//   wednesday: {
//     from: "08:00",
//     to: "16:00",
//   },
//   thursday: {
//     from: "08:00",
//     to: "16:00",
//   },
//   friday: {
//     from: "08:00",
//     to: "16:00",
//   },
//   saturday: {
//     from: "09:00",
//     to: "14:00",
//   },
//   sunday: {
//     from: "",
//     to: "",
//   },
// };

const daysOff: IDayOff[] = [
  // {
  //   id: 1,
  //   from: "2026-05-20",
  //   to: "2026-05-22",
  //   reason: "Vacation",
  // },
  // {
  //   id: 2,
  //   from: "2026-06-02",
  //   to: "2026-06-02",
  //   reason: "Medical Leave",
  // },
];

const BarberDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [barber, setBarber] = useState<IBarber | null>(null);
  const [services, setServices] = useState<IService[]>([]);
  const [avaliableServices, setAvaliableServices] = useState<IService[]>([]);
  const [schedule, setSchedule] = useState<IWorkSchedule | null>(null);

  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [dayOffModalOpen, setDayOffModalOpen] = useState<boolean>(false);
  const [addServiceModalOpen, setAddServiceModalOpen] =
    useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);

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

  const startEditService = (service: IService) => {
    setSelectedService(service);
    setEditModalOpen(true);
  };

  const handleEditService = async (
    service_id: number,
    service_data: Omit<IService, "id">,
  ) => {
    await updateServiceToBarber(service_id, id, service_data.price);
    fetchBarber(id);
  };

  const handleDeleteService = async (service_id) => {
    await unlinkServiceFromBarber(service_id, id);
    fetchBarber(id);
  };

  const handleAddService = async (data) => {
    await linkServiceToBarber(id, data.serviceId, data.price);
    fetchBarber(id);
  };

  const addDayOff = async (data) => {
    //TODO
  };

  const deleteDayOff = async (id: string | number) => {
    //TODO
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
                      <BarberServiceItem
                        key={service.id}
                        service={service}
                        onEdit={() => startEditService(service)}
                        onDelete={() => handleDeleteService(service.id)}
                      />
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
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text">
                  Weekly Schedule
                </h2>

                <button
                  onClick={() => setScheduleModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 cursor-pointer"
                >
                  {schedule ? <Pencil size={16} /> : <Plus size={16} />}
                  {schedule ? "Edit" : "Set Schedule"}
                </button>
              </div>

              {!schedule ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Calendar size={32} className="mb-3 text-muted" />

                  <h3 className="font-medium text-text">No schedule set</h3>

                  <p className="mt-1 text-sm text-muted">
                    Set working hours for this barber
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedule &&
                    Object.entries(schedule).map(([day, time]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
                      >
                        <div className="font-medium text-text capitalize">
                          {day}
                        </div>

                        <div className="text-sm text-muted">
                          {time.from && time.to
                            ? `${time.from} - ${time.to}`
                            : "Day Off"}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Days Off */}
            <div className="rounded-2xl h-fit md:col-span-2 xl:col-span-1 border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text">Days Off</h2>

                <button
                  className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 cursor-pointer"
                  onClick={() => setDayOffModalOpen(true)}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              {daysOff.length > 0 ? (
                <div className="space-y-3">
                  {daysOff.map((day) => (
                    <div
                      key={day.id}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text">{day.reason}</p>

                          <p className="mt-1 text-sm text-muted">
                            {day.from} → {day.to}
                          </p>
                        </div>

                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20 cursor-pointer"
                          onClick={() => deleteDayOff(day.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CalendarX2 size={32} className="mb-3 text-muted" />

                  <h3 className="font-medium text-text">No days off</h3>

                  <p className="mt-1 text-sm text-muted">
                    Add planned absences for this barber
                  </p>
                </div>
              )}
            </div>
            <LinkServiceModal
              open={addServiceModalOpen}
              onClose={() => setAddServiceModalOpen(false)}
              services={avaliableServices}
              onSubmit={(data) => handleAddService(data)}
            />
            <EditServiceModal
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              service={selectedService}
              forBarber={true}
              onSubmit={(service_id, formData) =>
                handleEditService(service_id, formData)
              }
            />
            <WorkScheduleModal
              open={scheduleModalOpen}
              onClose={() => setScheduleModalOpen(false)}
              schedule={schedule}
              onSubmit={async (data) => {
                if (schedule) {
                  await updateWorkSchedule(id, data);
                } else {
                  await createWorkSchedule(id, data);
                }

                fetchBarber(id);
              }}
            />
          </div>
          <AddModal
            open={dayOffModalOpen}
            onClose={() => setDayOffModalOpen(false)}
            title="Add Day Off"
            fields={[
              {
                name: "from",
                label: "From",
                type: "date",
              },
              {
                name: "to",
                label: "To",
                type: "date",
              },
              {
                name: "reason",
                label: "Reason",
                placeholder: "Reason for day off",
              },
            ]}
            onSubmit={addDayOff}
          />
        </>
      )}
    </div>
  );
};

export default BarberDetails;
