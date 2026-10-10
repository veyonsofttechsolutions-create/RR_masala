import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { API } from "../api/http.js";

const C = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CHECK CURRENT AUTHENTICATION
  // ==========================================

  const checkAuth = useCallback(async () => {
    try {
      const response = await API.get("/auth/me");

      const currentUser = response.data?.data?.user;

      if (currentUser) {
        setUser(currentUser);
        return currentUser;
      }

      setUser(null);
      return null;
    } catch (error) {
      console.error("Authentication check failed:", {
        status: error.response?.status,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      });

      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // INITIAL AUTHENTICATION CHECK
  // ==========================================

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (data) => {
    try {
      const response = await API.post("/auth/login", data);

      const loggedInUser = response.data?.data?.user;

      if (!loggedInUser) {
        throw new Error(
          "Login succeeded, but user information was not returned."
        );
      }

      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      console.error("Login failed:", {
        status: error.response?.status,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      });

      throw error;
    }
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (data) => {
    try {
      const response = await API.post("/auth/register", data);

      const registeredUser = response.data?.data?.user;

      if (!registeredUser) {
        throw new Error(
          "Registration succeeded, but user information was not returned."
        );
      }

      setUser(registeredUser);

      return registeredUser;
    } catch (error) {
      console.error("Registration failed:", {
        status: error.response?.status,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      });

      throw error;
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", {
        status: error.response?.status,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      });

      throw error;
    } finally {
      setUser(null);
    }
  };

  // ==========================================
  // REFRESH USER INFORMATION
  // ==========================================

  const refreshUser = async () => {
    return checkAuth();
  };

  // ==========================================
  // CONTEXT PROVIDER
  // ==========================================

  return (
    <C.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        checkAuth,
      }}
    >
      {children}
    </C.Provider>
  );
}

// ==========================================
// CUSTOM AUTH HOOK
// ==========================================

export const useAuth = () => {
  const context = useContext(C);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
};
