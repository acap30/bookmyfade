import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBarberById, type Barber } from "../api/barbersApi";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";

const BarberPage = () => {
  const { id, barberId } = useParams();

  const [barber, setBarber] = useState<Barber | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedService, setSelectedService] = useState<number | "">("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingCompleted, setBookingCompleted] = useState(false);

  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime || !selectedService) return;
    if (!clientName || !clientPhone) return;

    const service = services.find((s) => s.id === Number(selectedService));

    if (!service) return;

    const [hours, minutes] = selectedTime.split(":");
    const start = new Date(selectedDate);
    start.setHours(Number(hours), Number(minutes), 0);

    const payload = {
      hs_id: Number(selectedService),
      client_name: clientName,
      client_phone: clientPhone,
      res_date: selectedDate.toISOString().split("T")[0],
      start_time: selectedTime + ":00",
    };

    console.log(payload);

    try {
      const res = await fetch(`http://localhost:8000/reservation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Booking failed");

      setBookingCompleted(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!barberId) return;

    const fetchBarberAndTimes = async () => {
      try {
        const barberData = await getBarberById(barberId);

        setBarber({
          id: barberData.id,
          first_name: barberData.first_name,
          last_name: barberData.last_name,
          title: barberData.title || "Professional Barber",
        });

        setAvailableSlots([]);
      } catch (error) {
        console.error(error);

        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBarberAndTimes();
  }, [barberId]);

  useEffect(() => {
    const fetchServices = async () => {
      if (!id) return;

      try {
        const res = await fetch(
          `http://localhost:8000/public/service/salon/${id}`,
        );
        const data = await res.json();

        const safeServices = Array.isArray(data.services) ? data.services : [];
        setServices(safeServices);
      } catch (err) {
        console.error("Services error:", err);
      }
    };

    fetchServices();
  }, [id]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!barberId || !selectedDate || !selectedService) return;

      const hdId = Number(barberId);
      if (isNaN(hdId)) return;

      console.log("BARBER ID:", hdId);
      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];

        console.log("DATE:", formattedDate);
        const res = await fetch(
          `http://localhost:8000/public/reservation/available/hairdresser/${hdId}/${selectedService}?date=${formattedDate}`,
        );

        const data = await res.json();

        const safeSlots = Array.isArray(data?.slots)
          ? data.slots
          : Array.isArray(data)
            ? data
            : [];

        const slicedSlots = safeSlots.map((time) => time.slice(0, 5));

        setAvailableSlots(slicedSlots);
        setSelectedTime(null);
      } catch (err) {
        console.error("Slots error:", err);
      }
    };

    fetchSlots();
  }, [selectedDate, barberId, selectedService]);

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "white" }}>Loading barber...</div>
    );
  }

  if (!barber) {
    return (
      <div style={{ padding: "40px", color: "white" }}>Barber not found</div>
    );
  }

  return (
    <div className="barber-page">
      <header className="navbar">
        <Link to="/" className="brand">
          BookMyFade
        </Link>

        <nav className="nav-links">
          <Link to={`/salon/${id}/barbers`}>Back to barbers</Link>
        </nav>
      </header>

      <section className="barber-profile">
        <img
          src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop"
          alt={barber.first_name}
        />

        <div className="barber-profile-content">
          <span className="badge">Selected barber</span>

          <h1>
            {barber.first_name} {barber?.last_name ?? ""}
          </h1>

          <p className="barber-title">
            {barber.title || "Professional Barber"}
          </p>

          <p className="barber-bio">
            Experienced barber focused on clean fades, modern cuts and beard
            styling.
          </p>

          {bookingCompleted ? (
            <div className="success-card">
              <h2>Appointment booked!</h2>

              <p>
                Your appointment with <strong>{barber.first_name}</strong> has
                been scheduled for{" "}
                <strong>
                  {selectedDate?.toISOString().split("T")[0] ?? "selected date"}
                </strong>{" "}
                at <strong>{selectedTime ?? "selected time"}</strong>.
              </p>

              <div className="btn-section">
                <button
                  onClick={() => setBookingCompleted(false)}
                  className="primary-btn"
                >
                  Book another appointment
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="primary-btn back-btn"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            <div className="booking-card">
              <h3>Choose appointment time</h3>

              <div className="booking-section">
                <h4>Select date</h4>

                <DatePicker
                  onChange={(value) => {
                    if (value instanceof Date) {
                      setSelectedDate(value);
                    }
                    setSelectedTime(null);
                    setAvailableSlots([]);
                  }}
                  value={selectedDate}
                  minDate={new Date()}
                  clearIcon={null}
                />
              </div>

              <div className="booking-section">
                <h4>Select service</h4>

                <select
                  value={selectedService}
                  onChange={(e) => {
                    setSelectedService(Number(e.target.value));
                    setSelectedTime(null);
                    setAvailableSlots([]);
                  }}
                >
                  <option value="">-- choose service --</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.length} min)
                    </option>
                  ))}
                </select>
              </div>

              {availableSlots?.length > 0 ? (
                <div className="time-grid">
                  {(availableSlots || []).map((time, index) => (
                    <button
                      key={index}
                      type="button"
                      className={selectedTime === time ? "time-active" : ""}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="no-slots">
                  {selectedService
                    ? "No available appointments for the selected date and service."
                    : "No service is selected. Choose service to see available appointments."}
                </div>
              )}

              {selectedTime && (
                <div className="booking-section">
                  <h4>Full name</h4>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your full Name"
                    className="booking-section-input"
                  />

                  <h4>Phone number</h4>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="booking-section-input"
                  />
                </div>
              )}

              <button
                className="primary-btn booking-btn"
                disabled={
                  !selectedTime ||
                  !selectedDate ||
                  !selectedService ||
                  !clientName ||
                  !clientPhone
                }
                onClick={handleContinue}
              >
                Finish booking
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BarberPage;
