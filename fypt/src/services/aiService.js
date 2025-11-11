import api from './api';

class AIService {
  /**
   * Ask a general medical question to the AI assistant
   */
  async askQuestion(question, userId) {
    try {
      const response = await api.post('/api/ai/ask', {
        question,
        userId
      });
      return response.data.answer || response.data;
    } catch (error) {
      console.error('AI ask question error:', error);
      throw error;
    }
  }

  /**
   * Get AI assessment of medical records
   */
  async getRecordAssessment(recordId, userId) {
    try {
      const response = await api.post('/api/ai/assess', {
        recordId,
        userId
      });
      return response.data.assessment || response.data;
    } catch (error) {
      console.error('AI record assessment error:', error);
      throw error;
    }
  }

  /**
   * Get health insights and recommendations
   */
  async getHealthInsights(userId) {
    try {
      const response = await api.post('/api/ai/insights', {
        userId
      });
      return response.data;
    } catch (error) {
      console.error('AI health insights error:', error);
      throw error;
    }
  }

  /**
   * Generate health summary report
   */
  async generateHealthSummary(userId, timeframe) {
    try {
      const params = { userId };
      if (timeframe) params.timeframe = timeframe;
      
      const response = await api.post('/api/ai/summary', params);
      return response.data;
    } catch (error) {
      console.error('AI health summary error:', error);
      throw error;
    }
  }

  /**
   * Analyze symptoms and provide recommendations
   */
  async analyzeSymptoms(symptoms, userId) {
    try {
      const response = await api.post('/api/ai/symptoms', {
        symptoms,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('AI symptoms analysis error:', error);
      throw error;
    }
  }

  /**
   * Get drug interaction warnings
   */
  async checkDrugInteractions(medications, userId) {
    try {
      const response = await api.post('/api/ai/drug-interactions', {
        medications,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('AI drug interactions error:', error);
      throw error;
    }
  }

  /**
   * Get personalized health recommendations
   */
  async getPersonalizedRecommendations(userId) {
    try {
      const response = await api.post('/api/ai/recommendations', {
        userId
      });
      return response.data;
    } catch (error) {
      console.error('AI recommendations error:', error);
      throw error;
    }
  }

  /**
   * Analyze medical document/image
   */
  async analyzeDocument(documentData, userId) {
    try {
      const isFormData = documentData instanceof FormData;
      const config = isFormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};
      
      if (!isFormData) {
        documentData.userId = userId;
      } else {
        documentData.append('userId', userId.toString());
      }
      
      const response = await api.post('/api/ai/analyze-document', documentData, config);
      return response.data;
    } catch (error) {
      console.error('AI document analysis error:', error);
      throw error;
    }
  }

  /**
   * Get AI-powered health risk assessment
   */
  async getRiskAssessment(userId, factors) {
    try {
      const response = await api.post('/api/ai/risk-assessment', {
        userId,
        factors
      });
      return response.data;
    } catch (error) {
      console.error('AI risk assessment error:', error);
      throw error;
    }
  }

  /**
   * Get trending health topics and insights
   */
  async getHealthTrends(userId) {
    try {
      const response = await api.get(`/api/ai/trends?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('AI health trends error:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
export default aiService;