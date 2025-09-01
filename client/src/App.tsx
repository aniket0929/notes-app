import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/SignUp";
import Signin from "./pages/SignIn";
import { useAuthStore } from "./store/authStore";
import type { JSX } from "react";
import Dashboard from "./pages/Dashboard";


function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuthStore();
  if (!isLoggedIn) return <Navigate to="/signup" replace />;
  return children;
}

function App() {
  const { isLoggedIn } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/notes" /> : <Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
