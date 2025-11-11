import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (nid, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(nid, password);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signup(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on client side even if server call fails
      setUser(null);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      localStorage.removeItem('authToken');
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (updateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await authService.updateProfile(user.nid, updateData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      await authService.updatePassword(user.nid, currentPassword, newPassword);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const isAuthenticated = !!user;
  const isLoading = loading;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshToken,
    updateProfile,
    updatePassword,
    checkAuthStatus
  };
};