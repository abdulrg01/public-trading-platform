import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { tradingAPI, userAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [balances, setBalances] = useState(null);
  const [error, setError] = useState(null);

   // Fetch user balances when authenticated
   useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && username) {
        try {
          const response = await tradingAPI.getBalance();
          if (response.ok) {
            setBalances(response)
          } else {
            throw new Error(response.message || "Failed to fetch balances");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load balances.");
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, username]);

  const login = useCallback(async (username, password) => {
    try {
      setError(null);
      const response = await userAPI.login({ username, password });

      if (response.ok) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("username", username);
        setIsAuthenticated(true);
        setUsername(username);
        return { success: true, redirectTo: response.redirectTo };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      return { success: false, message: "Login failed" };
    }
  }, []);

  const register = useCallback(async (username, password) => {
    try {
      setError(null);
      const response = await userAPI.register({ username, password });

      if (response.ok) {
        return { success: true, redirectTo: response.redirectTo };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      return { success: false, message: "Registration failed" };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername(null);
    setBalances(null);
  }, []);

  const value = {
    isAuthenticated,
    error,
    login,
    register,
    balances,
    logout,
    username,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
