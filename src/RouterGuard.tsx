import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./lib/authcontext";

const publicRoutes = ["/app-download", "/verify-email", "/reset-password","/auth"];

export default function RouterGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const path = location.pathname;
    const isPublic = publicRoutes.includes(path);

    if (!user && !isPublic) {
      navigate("/auth", { replace: true });
    } else if (user && path === "/auth") {
      navigate("/", { replace: true });
    }
  }, [user, isLoading, location.pathname, navigate]);

  return <>{children}</>;
}
