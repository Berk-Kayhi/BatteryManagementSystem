import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

export function useUserAuth() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authApi.me();
        setUserName(user.username || "");
        setUserEmail(user.email);
      } catch {
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  return { userName, userEmail, isLoading };
}