import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSalonById, getSalonServices } from "../api/salonsApi";

const SalonPage = () => {
  const { id } = useParams();

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const data = await getSalonById(id!);
        const servicesData = await getSalonServices(id);

        setSalon(data);
        setServices(servicesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "white" }}>Loading salon...</div>
    );
  }

  if (!salon) {
    return (
      <div style={{ padding: "40px", color: "white" }}>Salon not found</div>
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

          <p>Premium barber experience with modern styling and cuts.</p>

          <div className="salon-meta">
            <span>{salon.address}</span>

            <span>Open today</span>
          </div>

          <Link to={`/salon/${id}/barbers`} className="primary-btn">
            View barbers
          </Link>
        </div>
      </section>

      <section className="salon-info-grid">
        <div className="info-card">
          <h3>Working Hours</h3>

          <p>
            Monday ·{" "}
            {!salon.wh.monday.off
              ? `${salon.wh.monday.start.slice(0, 5)} - ${salon.wh.monday.end.slice(0, 5)}`
              : "Not working"}
          </p>
          <p>
            Tuesday ·{" "}
            {!salon.wh.tuesday.off
              ? `${salon.wh.tuesday.start.slice(0, 5)} - ${salon.wh.tuesday.end.slice(0, 5)}`
              : "Not working"}
          </p>
          <p>
            Wednesday ·{" "}
            {!salon.wh.wednesday.off
              ? `${salon.wh.wednesday.start.slice(0, 5)} - ${salon.wh.wednesday.end.slice(0, 5)}`
              : "Not working"}
          </p>
          <p>
            Thursday ·{" "}
            {!salon.wh.thursday.off
              ? `${salon.wh.thursday.start.slice(0, 5)} - ${salon.wh.thursday.end.slice(0, 5)}`
              : "Not working"}
          </p>
          <p>
            Friday ·{" "}
            {!salon.wh.friday.off
              ? `${salon.wh.friday.start.slice(0, 5)} - ${salon.wh.friday.end.slice(0, 5)}`
              : "Not working"}
          </p>
          <p>
            Saturday ·{" "}
            {!salon.wh.saturday.off
              ? `${salon.wh.saturday.start.slice(0, 5)} - ${salon.wh.saturday.end.slice(0, 5)}`
              : "Not working"}
          </p>
          <p>
            Sunday ·{" "}
            {!salon.wh.sunday.off
              ? `${salon.wh.sunday.start.slice(0, 5)} - ${salon.wh.sunday.end.slice(0, 5)}`
              : "Not working"}
          </p>
        </div>

        <div className="info-card">
          <h3>Services</h3>

          {services.map((service) => (
            <p key={service.id}>{`${service.name} (${service.length} min)`}</p>
          ))}
        </div>

        <div className="info-card">
          <h3>Contact</h3>

          <p>{salon.phone || "No phone number"}</p>
          <p>{salon.email || "No email"}</p>
        </div>
      </section>
    </div>
  );
};

export default SalonPage;
