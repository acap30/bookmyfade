import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBarberById, type Barber } from "../api/barbersApi";

type TimeSlot = {
  id: number;
  time: string;
};

const fallbackTimes: TimeSlot[] = [
  { id: 1, time: "10:00" },
  { id: 2, time: "11:30" },
  { id: 3, time: "13:00" },
  { id: 4, time: "15:30" },
  { id: 5, time: "18:00" },
  { id: 6, time: "19:30" },
];

const BarberPage = () => {
  const { id, barberId } = useParams();

  const [barber, setBarber] = useState<Barber | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

        /* TODO: getAvailableSlots(barberId) */

        setTimeSlots(fallbackTimes);
      } catch (error) {
        console.error(error);

        setBarber({
          id: Number(barberId),
          name: "Marko Petrović",
          title: "Fade Specialist",
        });

        setTimeSlots(fallbackTimes);
      } finally {
        setLoading(false);
      }
    };

    fetchBarberAndTimes();
  }, [barberId]);

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

            <div className="time-grid">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className={selectedTime === slot.time ? "time-active" : ""}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
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
              disabled={!selectedTime}
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
