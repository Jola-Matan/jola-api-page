import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserInfo {
  email?: string;
  sub?: string;
  "cognito:groups"?: string[];
  [key: string]: any;
}

export function useAuthenticatedUser() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const idToken = localStorage.getItem("id_token");
    if (!idToken) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(idToken.split(".")[1]));
      setUser(payload);
    } catch (e) {
      console.error("Invalid token format", e);
      localStorage.clear();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return {
    user,
    userId: user?.sub || null,
    groups: user?.["cognito:groups"] || [],
    loading,
  };
}
