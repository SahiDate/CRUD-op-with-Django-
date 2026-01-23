import { Navigate } from "react-router-dom";
import { isLoggedIn, getRole } from "../services/auth";

export default function ProtectedRoute({ children, allowRole }) {
  const auth = isLoggedIn();
  const role = getRole();

  // Not logged in → go to correct login page
  if (!auth) {
    return <Navigate to="/user/login" replace />;
  }

  // Role mismatch → go to correct dashboard
  if (allowRole && role !== allowRole) {
    return role === "admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/user" replace />;
  }

  return children;
}
