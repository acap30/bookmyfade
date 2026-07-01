import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { IAppointment } from "../../types/appointments";
import { cancelAppointment, getAppointments } from "../../api/appointmentsApi";
import AppointmentItem from "../../components/items/AppointmentItem";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../types/auth";

const ITEMS_PER_PAGE = 5;

const Appointments = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);
  const [filters, setFilters] = useState({
    clientName: "",
    barber: "",
    salon: "",
    dateFrom: "",
    dateTo: "",
  });
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "canceled"
  >("all");

  const fetchAppointments = async (pageNumber: number) => {
    try {
      setLoading(true);

      const skip = (pageNumber - 1) * ITEMS_PER_PAGE;

      const canceledStatus =
        statusFilter === "active"
          ? false
          : statusFilter === "canceled"
            ? true
            : 0;

      const data = await getAppointments(skip, ITEMS_PER_PAGE, {
        clientName: filters.clientName ?? null,
        barberId: Number(filters.barber) ?? null,
        salonId: Number(filters.salon) ?? null,
        canceled: canceledStatus,
        dateFrom: filters.dateFrom ?? null,
        dateTo: filters.dateTo ?? null,
      });

      setAppointments(data.list);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(page);
  }, [page, filters, statusFilter]);

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    try {
      await cancelAppointment(Number(selectedAppointment.id));

      fetchAppointments(page);
    } catch (error) {
      console.log("Failed to cancel appointment", error);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPage(1);
  };

  const barbers = Array.from(
    new Map(
      appointments.map((appointment) => [
        appointment.barber.id,
        appointment.barber,
      ]),
    ).values(),
  );

  const salons = Array.from(
    new Map(barbers.map((barber) => [barber.salon.id, barber.salon])).values(),
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="flex flex-col">
          <label className="text-sm text-muted">Client name:</label>
          <input
            type="text"
            placeholder="Client name..."
            value={filters.clientName}
            onChange={(e) => handleFilterChange("clientName", e.target.value)}
            className="rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        {user.role !== ROLES.BARBER && (
          <div className="flex flex-col">
            <label className="text-sm text-muted">Barber:</label>
            <select
              value={filters.barber}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  barber: e.target.value,
                }))
              }
              className="rounded-xl border border-border bg-card px-4 py-3 text-text outline-none focus:border-primary"
            >
              <option value="">All barbers</option>

              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.user.fullName}
                </option>
              ))}
            </select>
          </div>
        )}

        {user.role === ROLES.ADMIN && (
          <div className="flex flex-col">
            <label className="text-sm text-muted">Salon:</label>
            <select
              value={filters.salon}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  salon: e.target.value,
                }))
              }
              className="rounded-xl border border-border bg-card px-4 py-3 text-text outline-none focus:border-primary"
            >
              <option value="">All salons</option>

              {salons.map((salon) => (
                <option key={salon.id} value={salon.id}>
                  {salon.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-sm text-muted">Date from:</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            className="rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-muted">Date to:</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            className="rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-muted">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "active" | "canceled")
            }
            className="rounded-xl border border-border bg-card px-4 py-3 text-text outline-none focus:border-primary"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="canceled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => {
              setFilters({
                clientName: "",
                barber: "",
                salon: "",
                dateFrom: "",
                dateTo: "",
              });
              setStatusFilter("all");
            }}
            className="w-full md:w-fit h-fit rounded-xl border border-border px-4 py-3 cursor-pointer transition-transform hover:scale-102 active:scale-95"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Appointments</h2>

          <span className="text-sm text-muted">
            {appointments.length} appointments
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted">
            <Loader2 className="mb-3 animate-spin" size={28} />

            <p className="text-sm">Loading appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <>
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <AppointmentItem
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={() => {
                    setSelectedAppointment(appointment);

                    setDeleteModalOpen(true);
                  }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`h-3 w-3 rounded-full transition-all cursor-pointer ${
                          page === pageNumber
                            ? "bg-primary scale-125"
                            : "bg-border hover:bg-muted"
                        }`}
                      />
                    ),
                  )}
                </div>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays size={36} className="mb-3 text-muted" />

            <h3 className="font-medium text-text">No appointments found</h3>

            <p className="mt-1 text-sm text-muted">Try again later</p>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleCancelAppointment}
        title="Cancel appointment"
        subtitle={`Cancel appointment`}
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Confirm"
      />
    </div>
  );
};

export default Appointments;
