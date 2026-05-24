import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Barber = {
  id: number;
  name: string;
  rating?: number;
  image?: string;
};

function BarberPage() {
  const { id, barberId } = useParams();

  const [barber, setBarber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarber = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:8000/barber/${barberId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch barber");
        }

        const data = await res.json();

        setBarber(data);
      } catch (error) {
        console.warn("Backend failed");

        // fallback test barber
        setBarber({
          id: Number(barberId),
          name: "Test Barber",
          rating: 5,
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBarber();
  }, [barberId]);

  if (loading) {
    return (
      <div className="text-center text-muted">
        Loading barber...
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="text-center text-muted">
        Barber not found
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "50px 30px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "30px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <img
          src={
            barber.image ||
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
          }
          alt={barber.name}
          style={{
            width: "100%",
            height: "450px",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            padding: "40px",
          }}
        >
          <Link
            to={`/salon/${id}/barbers`}
            style={{
              textDecoration: "none",
              color: "#666",
              fontSize: "15px",
            }}
          >
            ← Back to barbers
          </Link>

          <h1
            style={{
              marginTop: "20px",
              fontSize: "48px",
              marginBottom: "10px",
            }}
          >
            {barber.name}
          </h1>

          <div
            style={{
              fontSize: "20px",
              color: "#666",
            }}
          >
            ⭐ {barber.rating || 5}
          </div>

          <button
            style={{
              marginTop: "40px",
              width: "100%",
              padding: "18px",
              border: "none",
              borderRadius: "18px",
              cursor: "pointer",
              background: "black",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default BarberPage;