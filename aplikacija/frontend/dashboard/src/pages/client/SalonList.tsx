import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Salon = {
  id: number;
  name: string;
  city?: string;
  image?: string;
};

const SalonList = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchSalons = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      const res = await fetch("http://localhost:8000/salon/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();

      console.log("REAL DATA:", data);
      setSalons(data);
    } catch (error) {
      console.warn("Backend failed → showing dummy data");

      setSalons([
        {
          id: 1,
          name: "Test Salon",
          city: "Niš",
          image:
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  fetchSalons();
}, []);

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="border-b border-border bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold">Browse Salons</h1>
            <p className="text-sm text-muted">
              Choose your favorite barber shop
            </p>
          </div>

          <Link
            to="/"
            className="rounded-xl border border-border px-5 py-2 text-sm font-medium transition hover:bg-card"
          >
            Back Home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {loading ? (
          <div className="text-center text-muted">Loading salons...</div>
        ) : salons.length === 0 ? (
          <div className="text-center text-muted">No salons found</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {salons.map((salon) => (
              <div
                key={salon.id}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={
                      salon.image ||
                      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f"
                    }
                    alt={salon.name}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {salon.name}
                    </h2>

                    <span className="text-sm text-muted">
                      {salon.city || "City"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted">
                    Premium barber experience
                  </p>

                  <Link
                    to={`/salon/${salon.id}`}
                    className="mt-5 block rounded-xl bg-black px-4 py-3 text-center text-white transition hover:opacity-90"
                  >
                    View Salon
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonList;