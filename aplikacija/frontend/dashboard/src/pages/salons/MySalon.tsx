import {
  MapPin,
  Mail,
  Phone,
  Users,
  Calendar,
  Scissors,
  DollarSign,
  Store,
  Loader2,
  Plus,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import StatCard from "../../components/ui/StatCard";
import type { IService } from "../../types/service";
import {
  addServiceWithSalonId,
  deleteService,
  getSerivicesBySalonId,
  updateService,
} from "../../api/servicesApi";
import AddModal from "../../components/modals/AddModal";
import SalonServiceItem from "../../components/items/SalonServiceItem";
import EditServiceModal from "../../components/modals/EditServiceModal";
import { getMySalon } from "../../api/salonsApi";
import type { IWorkSchedule } from "../../types/workSchedule";
import {
  createSalonSchedule,
  updateSalonSchedule,
} from "../../api/workScheduleApi";
import WorkScheduleModal from "../../components/modals/WorkScheduleModal";

const recentAppointments = [
  {
    id: 1,
    client: "Marko Jovanovic (fake)",
    barber: "Nikola (fake)",
    time: "13:00 (fake)",
  },
  {
    id: 2,
    client: "Luka Petrovic (fake)",
    barber: "Stefan (fake)",
    time: "14:30 (fake)",
  },
  {
    id: 3,
    client: "Nikola Nikolic (fake)",
    barber: "Milos (fake)",
    time: "16:00 (fake)",
  },
];

const MySalon = () => {
  const [loading, setLoading] = useState(true);
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState<IService[]>(null);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [schedule, setSchedule] = useState<IWorkSchedule | null>(null);

  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const data = await getMySalon();
      const services = await getSerivicesBySalonId(data.id);

      setSalon({
        id: data.id,
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,

        stats: {
          barbers: 8,
          appointmentsToday: 23,
          monthlyRevenue: "$4,200",
          services: 14,
        },
      });
      const { salon_id, ...scheduleData } = data.wh;
      setSchedule(scheduleData);
      setServices(services);
    } catch (err) {
      console.error("Failed to fetch salon details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startEditService = (service: IService) => {
    setSelectedService(service);
    setEditModalOpen(true);
  };

  const handleEditService = async (
    service_id: number,
    service_data: Omit<IService, "id">,
  ) => {
    await updateService(service_id, service_data);
    fetchData();
  };

  const handleAddService = async (id, data) => {
    await addServiceWithSalonId(id, data);
    fetchData();
  };

  const handleDeleteService = async (service_id) => {
    await deleteService(service_id);
    fetchData();
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted">
          <Loader2 className="mb-3 animate-spin" size={40} />
          <p className="text-sm">Loading details...</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Store size={28} />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-text">
                      {salon.name}
                    </h1>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-muted">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} />
                      {salon.address}
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail size={15} />
                      {salon.email || "Not provided"}
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={15} />
                      {salon.phone || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              key={"Barbers"}
              label={"Barbers"}
              icon={Users}
              value={salon.stats.barbers}
            />
            <StatCard
              key={"Appointments Today"}
              label={"Appointments Today"}
              icon={Calendar}
              value={salon.stats.appointmentsToday}
            />
            <StatCard
              key={"Monthly Revenue"}
              label={"Monthly Revenue"}
              icon={DollarSign}
              value={salon.stats.monthlyRevenue}
            />
            <StatCard
              key={"Services"}
              label={"Services"}
              icon={Scissors}
              value={salon.stats.services}
            />
          </div>

          {/* Bottom */}
          <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
            {/* Services */}
            <div className="mb-6 break-inside-avoid">
              <div className="h-fit xl:col-span-2 rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text">Services</h2>

                  <span className="text-sm text-muted">
                    {services.length} services
                  </span>
                </div>

                <div className="space-y-3">
                  {services.map((service) => (
                    <SalonServiceItem
                      key={service.id}
                      service={service}
                      onEdit={() => startEditService(service)}
                      onDelete={() => handleDeleteService(service.id)}
                    />
                  ))}
                  <button
                    className="button-add w-full"
                    onClick={() => setAddServiceModalOpen(true)}
                  >
                    <Plus size={18} />
                    <p>Add Service</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="mb-6 break-inside-avoid">
              <div className="h-fit rounded-2xl border border-border bg-card p-5">
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
                            {time.off ? "Day Off" : `${time.from} - ${time.to}`}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="mb-6 break-inside-avoid">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text">
                    Recent Appointments
                  </h2>
                </div>

                <div className="space-y-3">
                  {recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <p className="font-medium text-text">
                        {appointment.client}
                      </p>

                      <p className="mt-1 text-sm text-muted">
                        Barber: {appointment.barber}
                      </p>

                      <div className="mt-3 text-sm text-muted">
                        {appointment.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <WorkScheduleModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        schedule={schedule}
        onSubmit={async (data) => {
          if (schedule) {
            await updateSalonSchedule(salon.id, data);
          } else {
            await createSalonSchedule(salon.id, data);
          }

          fetchData();
        }}
      />
      <AddModal
        open={addServiceModalOpen}
        onClose={() => setAddServiceModalOpen(false)}
        title="Add Service"
        fields={[
          {
            name: "name",
            label: "Service Name",
            placeholder: "Enter service name",
          },
          {
            name: "length",
            label: "Service Length",
            placeholder: "Enter service length",
            type: "number",
          },
        ]}
        onSubmit={(data) => handleAddService(salon.id, data)}
      />
      <EditServiceModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        service={selectedService}
        forBarber={false}
        onSubmit={(service_id, formData) =>
          handleEditService(service_id, formData)
        }
      />
    </div>
  );
};

export default MySalon;
