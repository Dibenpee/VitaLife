import api from './api';

class RecordsService {
  /**
   * Get all medical records for a user
   */
  async getUserRecords(userId) {
    try {
      const response = await api.get(`/api/records/all?x=${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Get records error:', error);
      if (error.response?.status === 404) {
        return []; // No records found
      }
      throw error;
    }
  }

  /**
   * Get a specific medical record by ID
   */
  async getRecordById(recordId) {
    try {
      const response = await api.get(`/api/records/${recordId}`);
      return response.data;
    } catch (error) {
      console.error('Get record error:', error);
      throw error;
    }
  }

  /**
   * Add a new medical record
   */
  async addRecord(recordData) {
    try {
      // Ensure entryTime is in ISO format
      const recordWithTime = {
        ...recordData,
        entryTime: recordData.entryTime || new Date().toISOString()
      };
      
      const response = await api.post('/api/records/add', recordWithTime);
      return response.data;
    } catch (error) {
      console.error('Add record error:', error);
      throw error;
    }
  }

  /**
   * Scan and add a document
   */
  async scanDocument(recordData) {
    try {
      const response = await api.post('/api/records/scan', recordData);
      return response.data;
    } catch (error) {
      console.error('Scan document error:', error);
      throw error;
    }
  }

  /**
   * Import records from external portal
   */
  async importFromPortal(portalId, userData) {
    try {
      const response = await api.post(`/api/records/PortalMagic?porId=${portalId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Import from portal error:', error);
      throw error;
    }
  }

  /**
   * Get records by type
   */
  async getRecordsByType(userId, type) {
    try {
      const allRecords = await this.getUserRecords(userId);
      return allRecords.filter(record => record.type === type);
    } catch (error) {
      console.error('Get records by type error:', error);
      throw error;
    }
  }

  /**
   * Get recent records (last 30 days)
   */
  async getRecentRecords(userId, days = 30) {
    try {
      const allRecords = await this.getUserRecords(userId);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);
      
      return allRecords.filter(record => {
        const recordDate = new Date(record.entryTime);
        return recordDate >= thirtyDaysAgo;
      });
    } catch (error) {
      console.error('Get recent records error:', error);
      throw error;
    }
  }

  /**
   * Search records by title or description
   */
  async searchRecords(userId, searchTerm) {
    try {
      const allRecords = await this.getUserRecords(userId);
      const lowercaseSearch = searchTerm.toLowerCase();
      
      return allRecords.filter(record => 
        record.title.toLowerCase().includes(lowercaseSearch) ||
        record.description.toLowerCase().includes(lowercaseSearch)
      );
    } catch (error) {
      console.error('Search records error:', error);
      throw error;
    }
  }
}

export const recordsService = new RecordsService();
export default recordsService;