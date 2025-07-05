import { useCallback } from 'react';
import { useAuthStore } from '../contexts/AuthContext';
import { useGlobalStore } from '../contexts/GlobalContext';
import { authService } from '../services/authService';
import type { LoginCredentials, RegisterData } from '../types';
import { AUTH_CONFIG } from '../constants';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: setAuth,
    logout: clearAuth,
    setLoading,
  } = useAuthStore();

  const { addToast } = useGlobalStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      // Store tokens
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.token);
      localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(response.user));
      
      // Update store
      setAuth(response.user, response.token);
      
      addToast({
        type: 'success',
        message: 'Login successful',
      });
      
      return response;
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Login failed',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading, addToast]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await authService.register(data);
      
      // Store tokens
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.token);
      localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(response.user));
      
      // Update store
      setAuth(response.user, response.token);
      
      addToast({
        type: 'success',
        message: 'Registration successful',
      });
      
      return response;
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Registration failed',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading, addToast]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
      
      // Clear store
      clearAuth();
      
      addToast({
        type: 'info',
        message: 'Logged out successfully',
      });
      
      setLoading(false);
    }
  }, [clearAuth, setLoading, addToast]);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authService.refreshToken(refreshToken);
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.token);
      
      return response.token;
    } catch (error) {
      await logout();
      throw error;
    }
  }, [logout]);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
    hasRole,
    hasAnyRole,
  };
};