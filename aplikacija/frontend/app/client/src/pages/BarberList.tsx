import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBarbers, type Barber } from "../api/barbersApi";

const fallbackBarbers: Barber[] = [
  {
    id: 1,
    name: "Frizer1",
    title: "Fade Specialist",
  },
  {
    id: 2,
    name: "Frizer2",
    title: "Classic Cuts",
  },
  {
    id: 3,
    name: "Frizer3",
    title: "Beard & Styling",
  },
];

const BarberList = () => {
  const { id } = useParams();

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getBarbers();

        setBarbers(data);
      } catch (error) {
        console.error(error);

        setBarbers(fallbackBarbers);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  return (
    <div className="list-page">
      <header className="navbar">
        <Link to="/" className="brand">
          BookMyFade
        </Link>

        <nav className="nav-links">
          <Link to={`/salon/${id}`}>Back to salon</Link>
        </nav>
      </header>

      <section className="list-hero">
        <span className="badge">Choose your barber</span>

        <h1>Select the barber for your appointment.</h1>

        <p>Pick a professional and continue to booking.</p>
      </section>

      {loading ? (
        <p style={{ padding: "40px" }}>Loading barbers...</p>
      ) : (
        <section className="salon-grid">
          {barbers.map((barber) => (
            <Link
              key={barber.id}
              to={`/salon/${id}/barber/${barber.id}`}
              className="salon-card"
            >
              <img
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop"
                alt={barber.name || "Barber"}
              />

              <div className="salon-card-content">
                <div>
                  <h3>{barber.name || `Barber #${barber.id}`}</h3>

                  <p>{barber.title || "Professional Barber"}</p>
                </div>

                <span className="rating">Book</span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
};

export default BarberList;