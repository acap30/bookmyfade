import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import AuthLayout from "./auth/AuthLayout";
import SigninForm from "./auth/SigninForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import {
  Barbers,
  Dashboard,
  MySalon,
  Owners,
  Profile,
  SalonDetails,
  Salons,
} from "./pages";
import { ROLES } from "./types/auth";
import BarberDetails from "./pages/barbers/BarberDetails";
import Appointments from "./pages/appointments/Appointments";
import Schedule from "./pages/barbers/Schedule";

function App() {
  return (
    <div>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
        </Route>

        {/* private routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route index path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/appointments" element={<Appointments />} />
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
              <Route path="/barbers/:id" element={<BarberDetails />} />
            </Route>
            <Route element={<RoleRoute allowedRoles={[ROLES.BARBER]} />}>
              <Route path="/schedule-services" element={<Schedule />} />
            </Route>
          </Route>
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
