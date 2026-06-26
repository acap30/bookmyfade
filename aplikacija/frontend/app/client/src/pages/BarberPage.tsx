import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime || !selectedService) return;

    const service = services.find(
      (s) => s.hs_id === Number(selectedService)
    );

    if (!service) return;

    const [hours, minutes] = selectedTime.split(":");
    const start = new Date(selectedDate);
    start.setHours(Number(hours), Number(minutes), 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + service.length);

    const payload = {
      hs_id: Number(selectedService),
      client_name: "Test User",
      client_phone: "061000000",
      res_date: selectedDate.toISOString().split("T")[0],
      start_time: selectedTime + ":00",
      end_time: end.toTimeString().slice(0, 5) + ":00",
    };

    try {
      const res = await fetch(`http://localhost:8000/reservation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Booking failed");

      alert("Booking successful!");
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
          name: barberData.name || "Selected Barber",
          title: barberData.title || "Professional Barber",
        });

        setAvailableSlots([]);
      } catch (error) {
        console.error(error);

        setBarber({
          id: Number(barberId),
          name: "Marko Petrović",
          title: "Fade Specialist",
        });

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
          `http://localhost:8000/services/salon/${id}`
        );
        const data = await res.json();

          const safeServices = Array.isArray(data) ? data : [];
            setServices(safeServices);
      } catch (err) {
        console.error("Services error:", err);
      }
    };

    fetchServices();
  }, [id]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!barberId || !selectedDate) return;

        const hdId = Number(barberId);
        if (isNaN(hdId)) return;

        console.log("BARBER ID:", hdId); 
      try {
        const formattedDate = selectedDate
          .toISOString()
          .split("T")[0];

          console.log("DATE:", formattedDate);
        const res = await fetch(
          `http://localhost:8000/reservation/available/hairdresser/${hdId}?date=${formattedDate}`
        );

        const data = await res.json();
        
          const safeSlots = Array.isArray(data?.slots)
            ? data.slots
            : Array.isArray(data)
            ? data
            : [];

          setAvailableSlots(safeSlots);
        setSelectedTime(null);
      } catch (err) {
        console.error("Slots error:", err);
      }
    };

    fetchSlots();
  }, [selectedDate, barberId]);

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
          alt={barber.name || "Barber"}
        />

        <div className="barber-profile-content">
          <span className="badge">Selected barber</span>

          <h1>{barber.name || "Barber"}</h1>

          <p className="barber-title">
            {barber.title || "Professional Barber"}
          </p>

          <p className="barber-bio">
            Experienced barber focused on clean fades, modern cuts and beard
            styling.
          </p>

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
                  setSelectedService(e.target.value);
                  setSelectedTime(null);
                  setAvailableSlots([]);
                }}
              >
                <option value="">-- choose service --</option>
                {services.map((s) => (
                  <option key={s.hs_id} value={s.hs_id}>
                    {s.name} ({s.length} min)
                  </option>
                ))}
              </select>
            </div>

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

            {selectedTime && (
              <p className="selected-time">
                Selected time: <strong>{selectedTime}</strong>
              </p>
            )}

            <button
              className="primary-btn booking-btn"
              disabled={!selectedTime || !selectedDate || !selectedService}
              onClick={handleContinue}
            >
              Continue booking
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BarberPage;
