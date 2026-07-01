import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSalons, type Salon } from "../api/salonsApi";

const baseUrl = import.meta.env.VITE_API_URL;

const SalonList = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const data = await getSalons();

        setSalons(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  return (
    <div className="list-page">
      <header className="navbar">
        <Link to="/" className="brand">
          BookMyFade
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
        </nav>
      </header>

      <section className="list-hero">
        <span className="badge">Choose your place</span>

        <h1>Find your next barber shop.</h1>

        <p>Choose salon</p>
      </section>

      {loading ? (
        <p style={{ padding: "40px" }}>Loading salons...</p>
      ) : salons.length > 0 ? (
        <section className="salon-grid">
          {salons.map((salon) => (
            <Link
              to={`/salon/${salon.id}`}
              className="salon-card"
              key={salon.id}
            >
              <img
                src={
                  salon.image_url
                    ? `${baseUrl}${salon.image_url}`
                    : "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop"
                }
                alt={salon.name}
              />

              <div className="salon-card-content">
                <div>
                  <h3>{salon.name}</h3>

                  <p>{salon.address}</p>
                </div>

                <span className="rating">Open</span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="list-hero">
          <h2>There are no salons currently. Try again later.</h2>
        </section>
      )}
    </div>
  );
};

export default SalonList;
