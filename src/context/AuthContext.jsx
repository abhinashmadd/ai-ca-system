import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ai_ca_auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("ai_ca_auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ai_ca_auth_user");
    }
  }, [user]);

  // Login method
  const login = async (email, password) => {
    setLoading(true);
    // Simulate authentication latency & verification
    await new Promise((r) => setTimeout(r, 600));

    if (!email || !password) {
      setLoading(false);
      throw new Error("Email and password are required.");
    }
    if (password.length < 6) {
      setLoading(false);
      throw new Error("Password must be at least 6 characters long.");
    }

    const mockUser = {
      id: "USR-" + Math.floor(1000 + Math.random() * 9000),
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Ashish Vaiswani",
      email: email,
      role: "Senior Chartered Accountant",
      firmName: "Maddheshiya & Associates CA",
      membershipNo: "FCA-849201",
      token: "jwt_mock_token_" + Date.now(),
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(email)
    };

    setUser(mockUser);
    setLoading(false);
    return mockUser;
  };

  // Sign up method
  const signup = async ({ name, email, password, firmName, role }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    if (!email || !password || !name) {
      setLoading(false);
      throw new Error("Name, email and password are required.");
    }

    const newUser = {
      id: "USR-" + Math.floor(1000 + Math.random() * 9000),
      name,
      email,
      role: role || "Chartered Accountant",
      firmName: firmName || "Chartered Financial Services",
      membershipNo: "ACA-" + Math.floor(100000 + Math.random() * 900000),
      token: "jwt_mock_token_" + Date.now(),
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(name)
    };

    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (!email) {
      setLoading(false);
      throw new Error("Please enter your registered email address.");
    }
    setLoading(false);
    return { success: true, message: `Password reset link sent to ${email}` };
  };

  // Logout method
  const logout = () => {
    setUser(null);
    localStorage.removeItem("ai_ca_auth_user");
  };

  // Update profile
  const updateProfile = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        forgotPassword,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
