import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSalonBarbers, type Barber } from "../api/barbersApi";

const baseUrl = import.meta.env.VITE_API_URL;

const BarberList = () => {
  const { id } = useParams();

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getSalonBarbers(id);

        const filteredBarbers = data.filter(
          (barber) => barber.salon_id === Number(id),
        );
        setBarbers(filteredBarbers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, [id]);

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
                src={
                  barber.image_url
                    ? `${baseUrl}${barber.image_url}`
                    : "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop"
                }
                alt={barber.first_name}
              />

              <div className="salon-card-content">
                <div>
                  <h3>
                    {barber.first_name} {barber.last_name}
                  </h3>

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
