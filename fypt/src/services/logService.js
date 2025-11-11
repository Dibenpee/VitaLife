import api from './api';

class LogService {
  /**
   * Get all system logs
   */
  async getAllLogs() {
    try {
      const response = await api.get('/api/logs/all');
      return response.data || [];
    } catch (error) {
      console.error('Get all logs error:', error);
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Get logs for a specific user
   */
  async getUserLogs(userId) {
    try {
      const response = await api.get(`/api/logs/user?x=${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Get user logs error:', error);
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Create a new log entry
   */
  async createLogEntry(
    level,
    message,
    userId,
    details
  ) {
    try {
      const logData = {
        level,
        message,
        userId,
        details,
        timestamp: new Date().toISOString()
      };
      
      const response = await api.post('/api/logs/create', logData);
      return response.data;
    } catch (error) {
      console.error('Create log entry error:', error);
      throw error;
    }
  }

  /**
   * Get logs by level (info, warning, error, debug)
   */
  async getLogsByLevel(level) {
    try {
      const allLogs = await this.getAllLogs();
      return allLogs.filter(log => log.level?.toLowerCase() === level.toLowerCase());
    } catch (error) {
      console.error('Get logs by level error:', error);
      throw error;
    }
  }

  /**
   * Get logs within a date range
   */
  async getLogsInRange(startDate, endDate) {
    try {
      const allLogs = await this.getAllLogs();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return allLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= start && logDate <= end;
      });
    } catch (error) {
      console.error('Get logs in range error:', error);
      throw error;
    }
  }

  /**
   * Get recent logs (last N hours)
   */
  async getRecentLogs(hours = 24) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - hours);
      
      const allLogs = await this.getAllLogs();
      return allLogs.filter(log => new Date(log.timestamp) >= cutoffDate)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Get recent logs error:', error);
      throw error;
    }
  }

  /**
   * Search logs by message content
   */
  async searchLogs(searchTerm) {
    try {
      const allLogs = await this.getAllLogs();
      const lowercaseSearch = searchTerm.toLowerCase();
      
      return allLogs.filter(log => 
        log.message?.toLowerCase().includes(lowercaseSearch) ||
        JSON.stringify(log.details || {}).toLowerCase().includes(lowercaseSearch)
      );
    } catch (error) {
      console.error('Search logs error:', error);
      throw error;
    }
  }

  /**
   * Get error logs only
   */
  async getErrorLogs() {
    return this.getLogsByLevel('error');
  }

  /**
   * Get warning logs only
   */
  async getWarningLogs() {
    return this.getLogsByLevel('warning');
  }

  /**
   * Get info logs only
   */
  async getInfoLogs() {
    return this.getLogsByLevel('info');
  }

  /**
   * Log user action
   */
  async logUserAction(
    userId, 
    action, 
    details
  ) {
    return this.createLogEntry('info', `User action: ${action}`, userId, {
      action,
      ...details
    });
  }

  /**
   * Log system error
   */
  async logSystemError(
    error, 
    context,
    userId
  ) {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return this.createLogEntry('error', `System error: ${errorMessage}`, userId, {
      context,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log API call
   */
  async logAPICall(
    method,
    endpoint,
    statusCode,
    duration,
    userId
  ) {
    return this.createLogEntry('info', `API ${method} ${endpoint} - ${statusCode}`, userId, {
      method,
      endpoint,
      statusCode,
      duration,
      type: 'api_call'
    });
  }

  /**
   * Get logs summary/statistics
   */
  async getLogsSummary(hours = 24) {
    try {
      const recentLogs = await this.getRecentLogs(hours);
      
      const summary = {
        total: recentLogs.length,
        byLevel: {
          error: recentLogs.filter(log => log.level === 'error').length,
          warning: recentLogs.filter(log => log.level === 'warning').length,
          info: recentLogs.filter(log => log.level === 'info').length,
          debug: recentLogs.filter(log => log.level === 'debug').length
        },
        timeRange: {
          from: new Date(Date.now() - hours * 60 * 60 * 1000).toISOString(),
          to: new Date().toISOString()
        },
        uniqueUsers: [...new Set(recentLogs
          .filter(log => log.userId)
          .map(log => log.userId))].length
      };
      
      return summary;
    } catch (error) {
      console.error('Get logs summary error:', error);
      throw error;
    }
  }

  /**
   * Clear old logs (older than specified days)
   */
  async clearOldLogs(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      await api.delete(`/api/logs/cleanup?before=${cutoffDate.toISOString()}`);
      return true;
    } catch (error) {
      console.error('Clear old logs error:', error);
      throw error;
    }
  }
}

export const logService = new LogService();
export default logService;