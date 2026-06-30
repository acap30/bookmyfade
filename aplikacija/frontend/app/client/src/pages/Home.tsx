import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <header className="navbar">
        <Link to="/" className="brand">
          BookMyFade
        </Link>

        <nav className="nav-links">
          <a href="#how">How it works</a>

          <Link to="/browse-salons">Salons</Link>

          <Link to="/browse-salons" className="nav-button">
            Book now
          </Link>
        </nav>
      </header>

      <main className="hero">
        <section className="hero-content">
          <span className="badge">Barber booking</span>

          <h1>Book your next cut with the right barber.</h1>

          <p>
            Explore salons, choose a barber and reserve your appointment online
            in just a few clicks.
          </p>

          <div className="hero-actions">
            <Link to="/browse-salons" className="primary-btn">
              Browse salons
            </Link>
          </div>
        </section>

        <section className="hero-card">
          <img
            src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1400&auto=format&fit=crop"
            alt="Barber shop"
          />
        </section>
      </main>

      <section id="how" className="steps">
        <div>
          <span>01</span>

          <h3>Choose salon</h3>

          <p>Browse available salons.</p>
        </div>

        <div>
          <span>02</span>

          <h3>Select barber</h3>

          <p>Pick the barber and service you want.</p>
        </div>

        <div>
          <span>03</span>

          <h3>Book online</h3>

          <p>Reserve your appointment instantly.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
