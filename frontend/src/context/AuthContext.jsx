
import { createContext, useContext, useEffect, useState } from "react";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); // ✅ Restore token from localStorage
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getCurrentUser();
        if (data) {
          setUser(data);
        } else {
          console.log("🔄 Token invalid or expired.");
          logout();
        }
      } catch (error) {
        console.log("🔴 Error fetching user:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = (userData) => {
    setUser(userData.user);
    setToken(userData.token);
    localStorage.setItem("token", userData.token); // ✅ Store token
    localStorage.setItem("userId", userData.user._id);
  };

  const register = async (userData) => {
    try {
      const newUser = await registerUser(userData);
      login(newUser); // ✅ Store token after registration
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token"); // ✅ Remove token only
    localStorage.removeItem("userId"); // ✅ Ensure userId is removed too
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

