// API configuration for different environments
const isProd = import.meta.env.PROD;

// In production, we assume the backend is on the same domain or provided via VITE_API_BASE_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
    (isProd ? `${window.location.origin}/api` : 'http://localhost:5000/api');

export const AUTH_API_URL = `${API_BASE_URL}/auth`;
export const HABITS_API_URL = `${API_BASE_URL}/habits`;
