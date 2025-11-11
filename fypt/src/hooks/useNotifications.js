import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services';

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getUserNotifications(userId);
      setNotifications(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      setError(error.message);
      console.error('Fetch notifications error:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    
    try {
      const count = await notificationService.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Fetch unread count error:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  const sendNotification = useCallback(async (title, content, type = 'info', priority = 'medium') => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const newNotification = await notificationService.sendNotification(userId, title, content, type, priority);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      return newNotification;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const markAsUnread = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsUnread(notificationId);
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: false } : notif
      ));
      setUnreadCount(prev => prev + 1);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    setLoading(true);
    setError(null);
    try {
      await notificationService.deleteNotification(notificationId, userId);
      const deletedNotif = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId, notifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [userId]);

  const clearAllNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await notificationService.clearAllNotifications(userId);
      setNotifications([]);
      setUnreadCount(0);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getNotificationsByType = useCallback(async (type) => {
    if (!userId) return [];
    
    try {
      return await notificationService.getNotificationsByType(userId, type);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getNotificationsByPriority = useCallback(async (priority) => {
    if (!userId) return [];
    
    try {
      return await notificationService.getNotificationsByPriority(userId, priority);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getRecentNotifications = useCallback(async (days = 7) => {
    if (!userId) return [];
    
    try {
      return await notificationService.getRecentNotifications(userId, days);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const searchNotifications = useCallback(async (searchTerm) => {
    if (!userId || !searchTerm) return [];
    
    try {
      return await notificationService.searchNotifications(userId, searchTerm);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const sendAppointmentReminder = useCallback(async (appointmentDetails, reminderTime) => {
    if (!userId) return;
    
    try {
      const reminder = await notificationService.sendAppointmentReminder(userId, appointmentDetails, reminderTime);
      setNotifications(prev => [reminder, ...prev]);
      setUnreadCount(prev => prev + 1);
      return reminder;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [userId]);

  const sendMedicationReminder = useCallback(async (medicationName, dosage) => {
    if (!userId) return;
    
    try {
      const reminder = await notificationService.sendMedicationReminder(userId, medicationName, dosage);
      setNotifications(prev => [reminder, ...prev]);
      setUnreadCount(prev => prev + 1);
      return reminder;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [userId]);

  const sendHealthUpdate = useCallback(async (updateContent) => {
    if (!userId) return;
    
    try {
      const update = await notificationService.sendHealthUpdate(userId, updateContent);
      setNotifications(prev => [update, ...prev]);
      setUnreadCount(prev => prev + 1);
      return update;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [userId]);

  const getNotificationStats = useCallback(async (days = 30) => {
    if (!userId) return null;
    
    try {
      return await notificationService.getNotificationStats(userId, days);
    } catch (error) {
      setError(error.message);
      return null;
    }
  }, [userId]);

  // Computed values
  const notificationsCount = notifications.length;
  const unreadNotifications = notifications.filter(notif => !notif.isRead);
  const readNotifications = notifications.filter(notif => notif.isRead);
  
  const notificationsByType = {
    info: notifications.filter(n => n.type === 'info'),
    appointment: notifications.filter(n => n.type === 'appointment'),
    medication: notifications.filter(n => n.type === 'medication'),
    health: notifications.filter(n => n.type === 'health'),
    system: notifications.filter(n => n.type === 'system')
  };

  const notificationsByPriority = {
    low: notifications.filter(n => n.priority === 'low'),
    medium: notifications.filter(n => n.priority === 'medium'),
    high: notifications.filter(n => n.priority === 'high')
  };

  const todayNotifications = notifications.filter(notif => {
    const notifDate = new Date(notif.timestamp);
    const today = new Date();
    return notifDate.toDateString() === today.toDateString();
  });

  const hasUnreadNotifications = unreadCount > 0;
  const latestNotification = notifications[0] || null;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    notificationsCount,
    unreadNotifications,
    readNotifications,
    notificationsByType,
    notificationsByPriority,
    todayNotifications,
    hasUnreadNotifications,
    latestNotification,
    fetchNotifications,
    sendNotification,
    markAsRead,
    markAsUnread,
    deleteNotification,
    markAllAsRead,
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsByPriority,
    getRecentNotifications,
    searchNotifications,
    sendAppointmentReminder,
    sendMedicationReminder,
    sendHealthUpdate,
    getNotificationStats,
    refreshNotifications: fetchNotifications
  };
};