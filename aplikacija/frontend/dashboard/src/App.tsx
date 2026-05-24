import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import AuthLayout from "./auth/AuthLayout";
import SigninForm from "./auth/SigninForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import SalonList from "./pages/client/SalonList";
import SalonPage from "./pages/client/SalonPage";
import BarberList from "./pages/client/BarberList";
import BarberPage from "./pages/client/BarberPage";
import {
  Barbers,
  Dashboard,
  MySalon,
  Owners,
  Profile,
  SalonDetails,
  Salons,
  Home,
} from "./pages";
import { ROLES } from "./types/auth";

function App() {
  return (
    <div>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />

        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
        </Route>

        <Route path="/browse-salons" element={<SalonList />} />
        <Route path="/salon/:id" element={<SalonPage />} />

        <Route path="/salon/:id/barbers" element={<BarberList />} />
        <Route
          path="/salon/:id/barber/:barberId"
          element={<BarberPage />}
        />

        {/* private routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route index path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="/salons" element={<Salons />} />
              <Route path="/salons/:id" element={<SalonDetails />} />
              <Route path="/owners" element={<Owners />} />
            </Route>
            <Route
              element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]} />}
            >
              <Route path="/my-salon" element={<MySalon />} />
              <Route path="/barbers" element={<Barbers />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
