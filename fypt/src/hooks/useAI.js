import { useState, useCallback } from 'react';
import { aiService } from '../services';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askQuestion = useCallback(async (question, userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.askQuestion(question, userId);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecordAssessment = useCallback(async (recordId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const assessment = await aiService.getRecordAssessment(recordId, userId);
      return assessment;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHealthInsights = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const insights = await aiService.getHealthInsights(userId);
      return insights;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateHealthSummary = useCallback(async (userId, timeframe) => {
    setLoading(true);
    setError(null);
    try {
      const summary = await aiService.generateHealthSummary(userId, timeframe);
      return summary;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeSymptoms = useCallback(async (symptoms, userId) => {
    setLoading(true);
    setError(null);
    try {
      const analysis = await aiService.analyzeSymptoms(symptoms, userId);
      return analysis;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkDrugInteractions = useCallback(async (medications, userId) => {
    setLoading(true);
    setError(null);
    try {
      const interactions = await aiService.checkDrugInteractions(medications, userId);
      return interactions;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPersonalizedRecommendations = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const recommendations = await aiService.getPersonalizedRecommendations(userId);
      return recommendations;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeDocument = useCallback(async (documentData, userId) => {
    setLoading(true);
    setError(null);
    try {
      const analysis = await aiService.analyzeDocument(documentData, userId);
      return analysis;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRiskAssessment = useCallback(async (userId, factors) => {
    setLoading(true);
    setError(null);
    try {
      const assessment = await aiService.getRiskAssessment(userId, factors);
      return assessment;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHealthTrends = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const trends = await aiService.getHealthTrends(userId);
      return trends;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    askQuestion,
    getRecordAssessment,
    getHealthInsights,
    generateHealthSummary,
    analyzeSymptoms,
    checkDrugInteractions,
    getPersonalizedRecommendations,
    analyzeDocument,
    getRiskAssessment,
    getHealthTrends
  };
};