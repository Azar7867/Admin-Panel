import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [valid, setValid] = useState(true);

  const checkToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setValid(false);
      navigate("/login", { replace: true });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setValid(false);
        navigate("/login", { replace: true });
      }
    } catch {
      localStorage.removeItem("token");
      setValid(false);
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    checkToken();
    const interval = setInterval(checkToken, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!valid) return null;

  return children;
};

export default ProtectedRoute;
