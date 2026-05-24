import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Barber = {
  id: number;
  name: string;
  rating?: number;
  image?: string;
};

function BarberList() {
  const { id } = useParams();

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:8000/salon/${id}/barbers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch barbers");
        }

        const data = await res.json();

        if (data.length === 0) {
          setBarbers([
            {
              id: 1,
              name: "Test Barber",
              rating: 5,
              image:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            },
          ]);
        } else {
          setBarbers(data);
        }
      } catch (error) {
        console.warn("Backend failed");

        setBarbers([
          {
            id: 1,
            name: "Test Barber",
            rating: 5,
            image:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-muted">
        Loading barbers...
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
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "40px",
          }}
        >
          <p
            style={{
              color: "#777",
              fontSize: "18px",
              marginBottom: "10px",
            }}
          >
            Izaberi svog frizera
          </p>

          <h1
            style={{
              fontSize: "52px",
              margin: 0,
            }}
          >
            Naši frizeri
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
          }}
        >
          {barbers.map((barber) => (
            <div
              key={barber.id}
              style={{
                background: "white",
                borderRadius: "28px",
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
                  height: "350px",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "30px",
                    }}
                  >
                    {barber.name}
                  </h2>

                  <div
                    style={{
                      background: "#f3f3f3",
                      padding: "8px 14px",
                      borderRadius: "12px",
                      fontSize: "15px",
                    }}
                  >
                    ⭐ {barber.rating || 5}
                  </div>
                </div>

                <Link to={`/salon/${id}/barber/${barber.id}`}>
                  <button
                    style={{
                      marginTop: "24px",
                      width: "100%",
                      padding: "16px",
                      border: "none",
                      borderRadius: "16px",
                      cursor: "pointer",
                      background: "black",
                      color: "white",
                      fontSize: "17px",
                      fontWeight: "bold",
                    }}
                  >
                    Pogledaj profil
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BarberList;