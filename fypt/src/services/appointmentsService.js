import api from './api';

class AppointmentsService {
  /**
   * Get all appointments for a user
   */
  async getUserAppointments(userId) {
    try {
      const response = await api.get(`/api/appointments/all?x=${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Get appointments error:', error);
      if (error.response?.status === 404) {
        return []; // No appointments found
      }
      throw error;
    }
  }

  /**
   * Get a specific appointment by ID
   */
  async getAppointmentById(appointmentId) {
    try {
      const response = await api.get(`/api/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Get appointment error:', error);
      throw error;
    }
  }

  /**
   * Create a new appointment
   */
  async createAppointment(appointmentData) {
    try {
      const response = await api.post('/api/appointments/new', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
    }
  }

  /**
   * Update an existing appointment
   */
  async updateAppointment(
    appointmentId, 
    updateData
  ) {
    try {
      const response = await api.put(
        `/api/appointments/update/${appointmentId}`, 
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Update appointment error:', error);
      throw error;
    }
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId, userId) {
    try {
      await api.post(`/api/appointments/cancel/${appointmentId}?x=${userId}`);
      return true;
    } catch (error) {
      console.error('Cancel appointment error:', error);
      throw error;
    }
  }

  /**
   * Get upcoming appointments
   */
  async getUpcomingAppointments(userId) {
    try {
      const allAppointments = await this.getUserAppointments(userId);
      const now = new Date();
      
      return allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.dateTime);
        return appointmentDate >= now && appointment.status !== 'cancelled';
      }).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    } catch (error) {
      console.error('Get upcoming appointments error:', error);
      throw error;
    }
  }

  /**
   * Get past appointments
   */
  async getPastAppointments(userId) {
    try {
      const allAppointments = await this.getUserAppointments(userId);
      const now = new Date();
      
      return allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.dateTime);
        return appointmentDate < now;
      }).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    } catch (error) {
      console.error('Get past appointments error:', error);
      throw error;
    }
  }

  /**
   * Get appointments by status
   */
  async getAppointmentsByStatus(userId, status) {
    try {
      const allAppointments = await this.getUserAppointments(userId);
      return allAppointments.filter(appointment => appointment.status === status);
    } catch (error) {
      console.error('Get appointments by status error:', error);
      throw error;
    }
  }

  /**
   * Get appointments for a specific date
   */
  async getAppointmentsForDate(userId, date) {
    try {
      const allAppointments = await this.getUserAppointments(userId);
      const targetDate = new Date(date).toDateString();
      
      return allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.dateTime).toDateString();
        return appointmentDate === targetDate;
      });
    } catch (error) {
      console.error('Get appointments for date error:', error);
      throw error;
    }
  }

  /**
   * Get appointments in date range
   */
  async getAppointmentsInRange(
    userId, 
    startDate, 
    endDate
  ) {
    try {
      const allAppointments = await this.getUserAppointments(userId);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.dateTime);
        return appointmentDate >= start && appointmentDate <= end;
      });
    } catch (error) {
      console.error('Get appointments in range error:', error);
      throw error;
    }
  }

  /**
   * Check for appointment conflicts
   */
  async checkConflicts(
    userId, 
    dateTime, 
    duration = 60
  ) {
    try {
      const appointmentDate = new Date(dateTime);
      const endTime = new Date(appointmentDate.getTime() + duration * 60000);
      
      const dayAppointments = await this.getAppointmentsForDate(
        userId, 
        appointmentDate.toISOString().split('T')[0]
      );
      
      return dayAppointments.some(appointment => {
        const existingStart = new Date(appointment.dateTime);
        const existingEnd = new Date(existingStart.getTime() + (appointment.duration || 60) * 60000);
        
        return (appointmentDate >= existingStart && appointmentDate < existingEnd) ||
               (endTime > existingStart && endTime <= existingEnd) ||
               (appointmentDate <= existingStart && endTime >= existingEnd);
      });
    } catch (error) {
      console.error('Check conflicts error:', error);
      return false;
    }
  }
}

export const appointmentsService = new AppointmentsService();
export default appointmentsService;