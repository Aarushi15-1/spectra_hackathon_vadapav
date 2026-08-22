// HealthBridge LabConnect API Service Layer
// Uses relative '/api' endpoints when served on same port, or VITE_API_BASE_URL if configured
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Health check endpoint caller
 * GET /api/health
 */
export const checkHealth = async () => {
  const url = `${API_BASE_URL}/api/health`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }

  return await response.json();
};

/**
 * Dashboard stats API caller
 * GET /api/dashboard/stats
 */
export const fetchDashboardStats = async () => {
  try {
    const url = `${API_BASE_URL}/api/dashboard/stats`;
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend API unavailable, using fallback dashboard stats:', err);
  }
  return null;
};

/**
 * Patients API caller
 * GET /api/patients
 */
export const fetchPatients = async () => {
  try {
    const url = `${API_BASE_URL}/api/patients`;
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend API unavailable, using fallback patient data:', err);
  }
  return null;
};

/**
 * Lab Tests catalog API caller
 * GET /api/tests
 */
export const fetchLabTests = async () => {
  try {
    const url = `${API_BASE_URL}/api/tests`;
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend API unavailable, using fallback test catalog:', err);
  }
  return null;
};

/**
 * Recent Orders API caller
 * GET /api/orders/recent
 */
export const fetchRecentOrders = async () => {
  try {
    const url = `${API_BASE_URL}/api/orders/recent`;
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend API unavailable, using fallback order data:', err);
  }
  return null;
};

export const getApiBaseUrl = () => API_BASE_URL || window.location.origin;

export default {
  checkHealth,
  fetchDashboardStats,
  fetchPatients,
  fetchLabTests,
  fetchRecentOrders,
  getApiBaseUrl,
};
