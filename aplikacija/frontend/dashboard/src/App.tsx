import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import AuthLayout from "./auth/AuthLayout";
import SigninForm from "./auth/SigninForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Home } from "./pages";

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
            <Route index path="/" element={<Home />} />
          </Route>
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
