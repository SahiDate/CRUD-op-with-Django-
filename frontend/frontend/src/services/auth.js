// src/services/auth.js

export const getToken = () => {
  return localStorage.getItem("access");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("access");
};

export const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
};

