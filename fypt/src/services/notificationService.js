import api from './api';

class NotificationService {
  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId) {
    try {
      const response = await api.get(`/api/notifications/all?x=${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Get notifications error:', error);
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Send a new notification
   */
  async sendNotification(
    userId,
    title,
    content,
    type = 'info',
    priority = 'medium'
  ) {
    try {
      const notificationData = {
        userId,
        title,
        content,
        type,
        priority,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      const response = await api.post('/api/notifications/send', notificationData);
      return response.data;
    } catch (error) {
      console.error('Send notification error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      await api.put(`/api/notifications/read/${notificationId}`);
      return true;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as unread
   */
  async markAsUnread(notificationId) {
    try {
      await api.put(`/api/notifications/unread/${notificationId}`);
      return true;
    } catch (error) {
      console.error('Mark notification as unread error:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId, userId) {
    try {
      await api.delete(`/api/notifications/delete/${notificationId}?userId=${userId}`);
      return true;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  /**
   * Get unread notifications
   */
  async getUnreadNotifications(userId) {
    try {
      const allNotifications = await this.getUserNotifications(userId);
      return allNotifications.filter(notification => !notification.isRead);
    } catch (error) {
      console.error('Get unread notifications error:', error);
      throw error;
    }
  }

  /**
   * Get notifications by type
   */
  async getNotificationsByType(userId, type) {
    try {
      const allNotifications = await this.getUserNotifications(userId);
      return allNotifications.filter(notification => notification.type === type);
    } catch (error) {
      console.error('Get notifications by type error:', error);
      throw error;
    }
  }

  /**
   * Get notifications by priority
   */
  async getNotificationsByPriority(
    userId, 
    priority
  ) {
    try {
      const allNotifications = await this.getUserNotifications(userId);
      return allNotifications.filter(notification => notification.priority === priority);
    } catch (error) {
      console.error('Get notifications by priority error:', error);
      throw error;
    }
  }

  /**
   * Get recent notifications (last N days)
   */
  async getRecentNotifications(userId, days = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const allNotifications = await this.getUserNotifications(userId);
      return allNotifications.filter(notification => 
        new Date(notification.timestamp) >= cutoffDate
      ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Get recent notifications error:', error);
      throw error;
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    try {
      const unreadNotifications = await this.getUnreadNotifications(userId);
      return unreadNotifications.length;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    try {
      const unreadNotifications = await this.getUnreadNotifications(userId);
      
      for (const notification of unreadNotifications) {
        await this.markAsRead(notification.id);
      }
      
      return true;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(userId) {
    try {
      const allNotifications = await this.getUserNotifications(userId);
      
      for (const notification of allNotifications) {
        await this.deleteNotification(notification.id, userId);
      }
      
      return true;
    } catch (error) {
      console.error('Clear all notifications error:', error);
      throw error;
    }
  }

  /**
   * Search notifications by content
   */
  async searchNotifications(userId, searchTerm) {
    try {
      const allNotifications = await this.getUserNotifications(userId);
      const lowercaseSearch = searchTerm.toLowerCase();
      
      return allNotifications.filter(notification => 
        notification.title.toLowerCase().includes(lowercaseSearch) ||
        notification.content.toLowerCase().includes(lowercaseSearch)
      );
    } catch (error) {
      console.error('Search notifications error:', error);
      throw error;
    }
  }

  /**
   * Send appointment reminder notification
   */
  async sendAppointmentReminder(
    userId,
    appointmentDetails,
    reminderTime
  ) {
    const title = '🏥 Appointment Reminder';
    const content = `You have an appointment with ${appointmentDetails.doctor} at ${reminderTime}`;
    
    return this.sendNotification(userId, title, content, 'appointment', 'high');
  }

  /**
   * Send medication reminder notification
   */
  async sendMedicationReminder(
    userId,
    medicationName,
    dosage
  ) {
    const title = '💊 Medication Reminder';
    const content = `Time to take ${medicationName} - ${dosage}`;
    
    return this.sendNotification(userId, title, content, 'medication', 'high');
  }

  /**
   * Send health update notification
   */
  async sendHealthUpdate(
    userId,
    updateContent
  ) {
    const title = '📊 Health Update';
    
    return this.sendNotification(userId, title, updateContent, 'health', 'medium');
  }

  /**
   * Send system notification
   */
  async sendSystemNotification(
    userId,
    message,
    priority = 'low'
  ) {
    const title = '⚙️ System Notification';
    
    return this.sendNotification(userId, title, message, 'system', priority);
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId, days = 30) {
    try {
      const recentNotifications = await this.getRecentNotifications(userId, days);
      
      const stats = {
        total: recentNotifications.length,
        unread: recentNotifications.filter(n => !n.isRead).length,
        byType: {
          info: recentNotifications.filter(n => n.type === 'info').length,
          appointment: recentNotifications.filter(n => n.type === 'appointment').length,
          medication: recentNotifications.filter(n => n.type === 'medication').length,
          health: recentNotifications.filter(n => n.type === 'health').length,
          system: recentNotifications.filter(n => n.type === 'system').length
        },
        byPriority: {
          low: recentNotifications.filter(n => n.priority === 'low').length,
          medium: recentNotifications.filter(n => n.priority === 'medium').length,
          high: recentNotifications.filter(n => n.priority === 'high').length
        },
        timeRange: {
          from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
          to: new Date().toISOString()
        }
      };
      
      return stats;
    } catch (error) {
      console.error('Get notification stats error:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;