import { useState, useEffect, useCallback } from 'react';
import { recordsService } from '../services';

export const useRecords = (userId) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.getUserRecords(userId);
      setRecords(data);
    } catch (error) {
      setError(error.message);
      console.error('Fetch records error:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = useCallback(async (recordData) => {
    setLoading(true);
    setError(null);
    try {
      const newRecord = await recordsService.addRecord(recordData);
      setRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecordById = useCallback(async (recordId) => {
    try {
      return await recordsService.getRecordById(recordId);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const searchRecords = useCallback(async (searchTerm) => {
    if (!userId || !searchTerm) return [];
    
    try {
      return await recordsService.searchRecords(userId, searchTerm);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getRecordsByType = useCallback(async (type) => {
    if (!userId) return [];
    
    try {
      return await recordsService.getRecordsByType(userId, type);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getRecentRecords = useCallback(async (days = 30) => {
    if (!userId) return [];
    
    try {
      return await recordsService.getRecentRecords(userId, days);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const scanDocument = useCallback(async (recordData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recordsService.scanDocument(recordData);
      // Refresh records after successful scan
      await fetchRecords();
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchRecords]);

  const importFromPortal = useCallback(async (portalId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recordsService.importFromPortal(portalId, userData);
      // Refresh records after successful import
      await fetchRecords();
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchRecords]);

  // Computed values
  const recordsCount = records.length;
  const recordTypes = [...new Set(records.map(record => record.type))];
  const recentRecordsCount = records.filter(record => {
    const recordDate = new Date(record.entryTime);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recordDate >= weekAgo;
  }).length;

  return {
    records,
    loading,
    error,
    recordsCount,
    recordTypes,
    recentRecordsCount,
    fetchRecords,
    addRecord,
    getRecordById,
    searchRecords,
    getRecordsByType,
    getRecentRecords,
    scanDocument,
    importFromPortal,
    refreshRecords: fetchRecords
  };
};