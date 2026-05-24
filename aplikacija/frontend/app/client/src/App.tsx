import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SalonList from "./pages/SalonList";
import SalonPage from "./pages/SalonPage";
import BarberList from "./pages/BarberList";
import BarberPage from "./pages/BarberPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/browse-salons"
          element={<SalonList />}
        />

        <Route
          path="/salon/:id"
          element={<SalonPage />}
        />

        <Route
          path="/salon/:id/barbers"
          element={<BarberList />}
        />

        <Route
          path="/salon/:id/barber/:barberId"
          element={<BarberPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;