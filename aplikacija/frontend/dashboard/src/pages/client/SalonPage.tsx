import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

type Salon = {
  id: number;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
  image?: string;
};

const SalonPage = () => {
  const { id } = useParams();

  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:8000/salon/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch salon");
        }

        const data = await res.json();

        setSalon(data);
      } catch (error) {
        console.warn("Backend failed → using dummy salon");

        setSalon({
          id: Number(id),
          name: "Test Salon",
          city: "Niš",
          address: "Test Adresa 123",
          phone: "060 123 456",
          image:
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-muted">
        Loading salon...
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="text-center text-muted">
        Salon not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text p-8">
      <Link to="/browse-salons" className="text-sm underline">
        ← Back to salons
      </Link>

      <div className="mt-6">
        <img
          src={
            salon.image ||
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f"
          }
          alt={salon.name}
          className="w-full h-80 object-cover rounded-2xl"
        />

        <h1 className="text-3xl font-bold mt-4">
          {salon.name}
        </h1>

        <p className="text-muted mt-2">
          {salon.city} • {salon.address}
        </p>

        <p className="mt-2 text-sm">
          📞 {salon.phone}
        </p>

        <Link to={`/salon/${id}/barbers`}>
          <button
            style={{
              marginTop: "24px",
              padding: "16px 28px",
              border: "none",
              borderRadius: "16px",
              background: "black",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            View Barbers
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SalonPage;