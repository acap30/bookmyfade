import { Link } from "react-router-dom";
const salons = [
  {
    id: 1,
    name: "Barber Studio",
    city: "Belgrade",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Gentlemen Cuts",
    city: "Novi Sad",
    image:
      "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Urban Fade",
    city: "Niš",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-text">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            BarberBook
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="#salons"
              className="text-sm font-medium text-muted transition hover:text-text"
            >
              Browse Salons
            </a>

            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Modern barber booking platform
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-6xl">
            Find and book your next haircut online.
          </h1>

          <p className="mb-8 max-w-xl text-lg text-muted">
            Explore top-rated barber shops, choose your favorite barber and
            reserve your appointment in just a few clicks.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#salons"
              className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              View Salons
            </a>

            <Link
              to="/sign-in"
              className="rounded-xl border border-border px-6 py-3 font-medium transition hover:bg-card"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1400&auto=format&fit=crop"
            alt="Barber shop"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Salons */}
      <section id="salons" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Popular Salons</h2>
            <p className="mt-2 text-muted">
              Choose a salon and continue to booking.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-md">
          {salons.slice(0, 1).map((salon) => (
            <div
              key={salon.id}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="overflow-hidden">
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6 text-center">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{salon.name}</h3>
                  <span className="text-sm text-muted">{salon.city}</span>
                </div>

                <p className="mb-6 text-sm leading-6 text-muted">
                  Browse available salons and continue to booking.
                </p>

                <Link
                  to="/browse-salons"
                  className="block w-full rounded-xl bg-black px-4 py-3 text-center font-medium text-white transition hover:opacity-90"
                >
                  Choose Salon
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Easy Booking</h3>
            <p className="text-sm text-muted">
              Reserve your appointment in just a few clicks.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">
              Professional Barbers
            </h3>
            <p className="text-sm text-muted">
              Choose experienced barbers and modern styles.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Fast Scheduling</h3>
            <p className="text-sm text-muted">
              Find available appointments quickly and easily.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;