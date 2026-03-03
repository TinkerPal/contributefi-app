import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export const useRequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (callback) => {
    if (loading) return false;

    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: { from: location },
      });
      return false;
    }

    if (callback) {
      callback();
    }
    return true;
  };

  return { requireAuth, isAuthenticated, loading };
};
