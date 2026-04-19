import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      navigate("/signin?error=" + error, { replace: true });
      return;
    }

    if (token) {
      login(token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/signin", { replace: true });
    }
  }, [searchParams, login, navigate]);

  return <LoadingSpinner fullPage text="Signing you in..." />;
}

export default AuthCallback;
