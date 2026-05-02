import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUser(JSON.parse(storedUserInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(userData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
