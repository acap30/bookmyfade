import {
  MapPin,
  Mail,
  Phone,
  Clock3,
  Users,
  Calendar,
  Scissors,
  DollarSign,
  Store,
  Loader2,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSalonById } from "../../api/salonsApi";
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

const SalonDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState<IService[]>(null);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedService, setSelectedService] = useState<IService | null>(null);

  const fetchData = async (salon_id: string) => {
    try {
      const data = await getSalonById(salon_id);
      const services = await getSerivicesBySalonId(salon_id);
      setSalon({
        id: data.id,
        name: data.name,
        address: data.address,
        email: "cadi@example.com (fake data)",
        phone: data.phone,
        workingHours: "09:00 - 21:00 (fake data)",

        stats: {
          barbers: 8,
          appointmentsToday: 23,
          monthlyRevenue: "$4,200",
          services: 14,
        },
      });
      setServices(services);
    } catch (err) {
      console.error("Failed to fetch salon details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(id);
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
    fetchData(id);
  };

  const handleAddService = async (id, data) => {
    await addServiceWithSalonId(id, data);
    fetchData(id);
  };

  const handleDeleteService = async (service_id) => {
    await deleteService(service_id);
    fetchData(salon.id);
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
                      {salon.email}
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={15} />
                      {salon.phone || "Not provided"}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={15} />
                      {salon.workingHours}
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
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Services */}
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

            {/* Recent Appointments */}
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
        </>
      )}
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

export default SalonDetails;
