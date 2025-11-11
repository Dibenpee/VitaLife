import { useState, useEffect, useCallback } from 'react';
import { appointmentsService } from '../services';

export const useAppointments = (userId) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentsService.getUserAppointments(userId);
      setAppointments(data);
    } catch (error) {
      setError(error.message);
      console.error('Fetch appointments error:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const createAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const newAppointment = await appointmentsService.createAppointment(appointmentData);
      setAppointments(prev => [newAppointment, ...prev]);
      return newAppointment;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAppointment = useCallback(async (appointmentId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAppointment = await appointmentsService.updateAppointment(appointmentId, updateData);
      setAppointments(prev => prev.map(app => 
        app.id === appointmentId ? updatedAppointment : app
      ));
      return updatedAppointment;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelAppointment = useCallback(async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      await appointmentsService.cancelAppointment(appointmentId, userId);
      setAppointments(prev => prev.map(app => 
        app.id === appointmentId ? { ...app, status: 'cancelled' } : app
      ));
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getAppointmentById = useCallback(async (appointmentId) => {
    try {
      return await appointmentsService.getAppointmentById(appointmentId);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const getUpcomingAppointments = useCallback(async () => {
    if (!userId) return [];
    
    try {
      return await appointmentsService.getUpcomingAppointments(userId);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getPastAppointments = useCallback(async () => {
    if (!userId) return [];
    
    try {
      return await appointmentsService.getPastAppointments(userId);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getAppointmentsByStatus = useCallback(async (status) => {
    if (!userId) return [];
    
    try {
      return await appointmentsService.getAppointmentsByStatus(userId, status);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getAppointmentsForDate = useCallback(async (date) => {
    if (!userId) return [];
    
    try {
      return await appointmentsService.getAppointmentsForDate(userId, date);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getAppointmentsInRange = useCallback(async (startDate, endDate) => {
    if (!userId) return [];
    
    try {
      return await appointmentsService.getAppointmentsInRange(userId, startDate, endDate);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const checkConflicts = useCallback(async (dateTime, duration = 60) => {
    if (!userId) return false;
    
    try {
      return await appointmentsService.checkConflicts(userId, dateTime, duration);
    } catch (error) {
      setError(error.message);
      return false;
    }
  }, [userId]);

  // Computed values
  const appointmentsCount = appointments.length;
  const upcomingCount = appointments.filter(app => {
    const appDate = new Date(app.dateTime);
    return appDate >= new Date() && app.status !== 'cancelled';
  }).length;
  
  const todayAppointments = appointments.filter(app => {
    const appDate = new Date(app.dateTime);
    const today = new Date();
    return appDate.toDateString() === today.toDateString();
  });

  const nextAppointment = appointments
    .filter(app => {
      const appDate = new Date(app.dateTime);
      return appDate >= new Date() && app.status !== 'cancelled';
    })
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))[0] || null;

  return {
    appointments,
    loading,
    error,
    appointmentsCount,
    upcomingCount,
    todayAppointments,
    nextAppointment,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointmentById,
    getUpcomingAppointments,
    getPastAppointments,
    getAppointmentsByStatus,
    getAppointmentsForDate,
    getAppointmentsInRange,
    checkConflicts,
    refreshAppointments: fetchAppointments
  };
};