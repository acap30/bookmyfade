import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { IAppointment } from "../../types/appointments";
import { getAppointments } from "../../api/appointmentsApi";
import AppointmentItem from "../../components/items/AppointmentItem";

const ITEMS_PER_PAGE = 5;

const Appointments = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [total, setTotal] = useState(0);
  // const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchAppointments = async (pageNumber: number) => {
    try {
      setLoading(true);

      const skip = (pageNumber - 1) * ITEMS_PER_PAGE;

      const data = await getAppointments(skip, ITEMS_PER_PAGE);

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
  }, [page]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* <SearchInput
        placeholder="Search appointments..."
        value={search}
        onChange={setSearch}
      /> */}

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

            <p className="mt-1 text-sm text-muted">Try changing your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
