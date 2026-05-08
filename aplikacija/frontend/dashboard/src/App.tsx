import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import AuthLayout from "./auth/AuthLayout";
import SigninForm from "./auth/SigninForm";

function App() {
  return (
    <div>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
        </Route>

        {/* private routes */}
        <Route path="/" element={<RootLayout />}>
          {/* protected routes and role routes */}
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
