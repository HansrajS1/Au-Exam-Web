import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./lib/authcontext";

export default function RouterGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const path = location.pathname;
    const isAuthPage = path === "/";

    if (!user && !isAuthPage) {
      navigate("/", { replace: true });
    } else if (user && isAuthPage) {
      navigate("/Home", { replace: true });
    }
  }, [user, isLoading, location.pathname]);

  return <>{children}</>;
}
