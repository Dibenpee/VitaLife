import api from './api';

class AuthService {
  /**
   * Register a new user
   */
  async signup(userData) {
    try {
      const response = await api.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Authenticate user and get JWT token
   */
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      const userData = response.data;
      
      // Store authentication data
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify({
        nid: userData.nid,
        name: userData.name,
        email: userData.email
      }));
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(userData) {
    try {
      const response = await api.post('/api/auth/refresh', userData);
      const newUserData = response.data;
      
      // Update stored token
      localStorage.setItem('token', newUserData.token);
      
      return newUserData;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(nid, name) {
    try {
      const params = new URLSearchParams();
      if (nid) params.append('nid', nid);
      if (name) params.append('name', name);
      
      const response = await api.get(`/api/auth/Display?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    try {
      const response = await api.put('/api/auth/UpdateProf', userData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(oldPassword, newPassword, userData) {
    try {
      const params = new URLSearchParams();
      params.append('op', oldPassword);
      params.append('np', newPassword);
      
      const response = await api.put(`/api/auth/UpdatePassword?${params.toString()}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  /**
   * Get stored user data
   */
  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export default authService;