import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSalonById, type Salon } from "../api/salonsApi";

const SalonPage = () => {
  const { id } = useParams();

  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const data = await getSalonById(id!);

        setSalon(data);
      } catch (error) {
        console.error(error);

        setSalon({
          id: Number(id),
          name: "Barber Studio",
          address: "Belgrade",
          phone: "+381 64 123 456",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "white" }}>
        Loading salon...
      </div>
    );
  }

  if (!salon) {
    return (
      <div style={{ padding: "40px", color: "white" }}>
        Salon not found
      </div>
    );
  }

  return (
    <div className="salon-page">
      <header className="navbar">
        <Link to="/" className="brand">
          BookMyFade
        </Link>

        <nav className="nav-links">
          <Link to="/browse-salons">Back</Link>
        </nav>
      </header>

      <section className="salon-hero">
        <img
          src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1400&auto=format&fit=crop"
          alt={salon.name}
          className="salon-hero-image"
        />

        <div className="salon-overlay">
          <span className="badge">Premium Barber Shop</span>

          <h1>{salon.name}</h1>

          <p>
            Premium barber experience with modern styling and cuts.
          </p>

          <div className="salon-meta">
            <span>{salon.address}</span>

            <span>Open today</span>
          </div>

          <Link
            to={`/salon/${id}/barbers`}
            className="primary-btn"
          >
            View barbers
          </Link>
        </div>
      </section>

      <section className="salon-info-grid">
        <div className="info-card">
          <h3>Working Hours</h3>

          <p>Mon - Fri · 09:00 - 21:00</p>
          <p>Saturday · 10:00 - 18:00</p>
        </div>

        <div className="info-card">
          <h3>Services</h3>

          <p>Haircut</p>
          <p>Fade</p>
          <p>Beard Trim</p>
        </div>

        <div className="info-card">
          <h3>Contact</h3>

          <p>{salon.phone || "+381 64 123 456"}</p>
          <p>barberstudio@gmail.com</p>
        </div>
      </section>
    </div>
  );
};

export default SalonPage;