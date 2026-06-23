import { Calendar, CalendarX2, Loader2, Scissors } from "lucide-react";
import { DayPicker } from "react-day-picker";
import {
  getDaysOff,
  getOverrides,
  getWorkSchedule,
} from "../../api/workScheduleApi";
import { useEffect, useState } from "react";
import type {
  IDayOff,
  IScheduleOverride,
  IWorkSchedule,
} from "../../types/workSchedule";
import BarberServiceItem from "../../components/items/BarberServiceItem";
import { getServicesByBarberId } from "../../api/servicesApi";
import type { IService } from "../../types/service";
import { getBarberIdByUserId } from "../../api/barbersApi";

const Schedule = () => {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<IWorkSchedule | null>(null);
  const [daysOff, setDaysOff] = useState<IDayOff[]>([]);
  const [overrides, setOverrides] = useState<IScheduleOverride[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [services, setServices] = useState<IService[]>([]);

  const overrideDates = overrides.map((o) => new Date(o.date));

  const selectedOverride = overrides.find(
    (o) =>
      selectedDate &&
      new Date(o.date).toDateString() === selectedDate.toDateString(),
  );
  const fetchBarber = async () => {
    try {
      const barber_id = await getBarberIdByUserId();
      const services = await getServicesByBarberId(barber_id);
      const dateOverrides = await getOverrides(barber_id);
      const workSchedule = await getWorkSchedule(barber_id);
      const daysOff = await getDaysOff(barber_id);

      setServices(services);
      setSchedule(workSchedule);
      setOverrides(dateOverrides);
      setDaysOff(daysOff);
    } catch (err) {
      console.error("Failed to fetch barber details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarber();
  }, []);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted">
          <Loader2 className="mb-3 animate-spin" size={40} />
          <p className="text-sm">Loading...</p>
        </div>
      ) : (
        <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
          {/* Services */}
          <div className="mb-6 break-inside-avoid">
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
                        onEdit={() => {}}
                        onDelete={() => {}}
                      />
                    ))
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl py-10 text-center">
                      <Scissors size={32} className="text-muted mb-3" />

                      <h3 className="font-medium text-text">
                        No services found
                      </h3>

                      <p className="mt-1 text-sm text-muted">
                        Ask your owner to add service
                      </p>
                    </div>
                  )}
                </div>
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

          {/* Date Overrides */}
          <div className="mb-6 break-inside-avoid">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text">
                  Date Overrides
                </h2>
              </div>

              <div className="w-full flex items-center justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{
                    overridden: overrideDates,
                  }}
                  modifiersClassNames={{
                    overridden: "override-day",
                  }}
                />
              </div>

              <div className="mt-4 border-t border-border pt-4">
                {!selectedDate ? (
                  <p className="text-sm text-muted">
                    Select a date to create or edit an override.
                  </p>
                ) : selectedOverride ? (
                  <div className="space-y-2">
                    <h3 className="font-medium text-text">
                      {selectedDate?.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>

                    <p className="text-sm text-muted">
                      {selectedOverride.off
                        ? "Day Off"
                        : `${selectedOverride.from} - ${selectedOverride.to}`}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-text">
                      {selectedDate?.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      No override exists for this date.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Days Off */}
          <div className="mb-6 break-inside-avoid">
            <div className="rounded-2xl h-fit md:col-span-2 xl:col-span-1 border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text">Days Off</h2>
              </div>
              {daysOff.length > 0 ? (
                <div className="space-y-3">
                  {daysOff.map((day, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text">
                            {day.detail ?? "Unknown"}
                          </p>

                          <p className="mt-1 text-sm text-muted">
                            {day.start_date} → {day.end_date}
                          </p>
                        </div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
