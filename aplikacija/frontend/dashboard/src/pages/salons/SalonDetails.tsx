import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  Store,
  Loader2,
  Plus,
  Pencil,
  Image,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSalonById, uploadSalonImage } from "../../api/salonsApi";
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
import type { IWorkSchedule } from "../../types/workSchedule";
import WorkScheduleModal from "../../components/modals/WorkScheduleModal";
import { updateSalonSchedule } from "../../api/workScheduleApi";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";

const SalonDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState<IService[]>(null);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [schedule, setSchedule] = useState<IWorkSchedule | null>(null);

  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchData = async (id: string) => {
    try {
      const data = await getSalonById(id);
      const services = await getSerivicesBySalonId(id);
      setSalon({
        id: data.id,
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        active: data.is_active,
        image_url: data.image_url,

        stats: {
          barbers: 8,
          appointmentsToday: 23,
          monthlyRevenue: "$4,200",
          services: 14,
        },
      });
      setSchedule(data.wh);
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

  const handleDeleteService = async () => {
    await deleteService(selectedService.id);
    fetchData(salon.id);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    await uploadSalonImage(Number(salon.id), formData);

    await fetchData(salon.id);
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
          <div className="relative rounded-2xl border border-border bg-card p-6">
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
              <div
                className={`absolute top-6 right-6 w-fit rounded-full px-4 py-2 text-sm font-medium ${
                  salon.active
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {salon.active ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="columns-1 gap-6 md:columns-2">
            {/* Cover Image */}
            <div className="h-fit xl:col-span-2 rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text">Salon image</h2>
                <label className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 cursor-pointer">
                  {salon.image_url ? <Pencil size={16} /> : <Plus size={16} />}
                  {salon.image_url ? "Edit Image" : "Add Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="group relative h-64 w-full cursor-pointer overflow-hidden rounded-3xl border border-border bg-card">
                {salon.image_url ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${salon.image_url}`}
                    alt="Salon cover"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center h-full">
                    <Image size={32} className="mb-3 text-muted" />

                    <h3 className="font-medium text-text">Image not added</h3>

                    <p className="mt-1 text-sm text-muted">
                      Add cover image for this salon
                    </p>
                  </div>
                )}
              </div>
            </div>
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
                      onDelete={() => {
                        setSelectedService(service);
                        setDeleteModalOpen(true);
                      }}
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
                      Set working hours for this salon
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
          </div>
        </>
      )}
      <WorkScheduleModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        schedule={schedule}
        onSubmit={async (data) => {
          if (schedule) {
            await updateSalonSchedule(id, data);
          }

          fetchData(id);
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
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteService}
        title="Delete Service"
        subtitle={`Delete ${selectedService?.name || "Service"}`}
        message="Are you sure you want to delete this service? This action cannot be undone."
      />
    </div>
  );
};

export default SalonDetails;
