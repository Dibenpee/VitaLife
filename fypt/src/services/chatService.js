import api from './api';

class ChatService {
  /**
   * Get all chat messages for a user
   */
  async getUserMessages(userId) {
    try {
      const response = await api.get(`/api/chat/all?x=${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Get messages error:', error);
      if (error.response?.status === 404) {
        return []; // No messages found
      }
      throw error;
    }
  }

  /**
   * Send a new message
   */
  async sendMessage(
    userId, 
    content, 
    messageType = 'text'
  ) {
    try {
      const messageData = {
        userId,
        content,
        messageType,
        timestamp: new Date().toISOString(),
        isFromUser: true
      };
      
      const response = await api.post('/api/chat/send', messageData);
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * Get AI response to user message
   */
  async getAIResponse(
    userId, 
    userMessageId
  ) {
    try {
      const response = await api.post('/api/chat/ai-response', {
        userId,
        userMessageId
      });
      return response.data;
    } catch (error) {
      console.error('Get AI response error:', error);
      throw error;
    }
  }

  /**
   * Update message status (read/unread)
   */
  async updateMessageStatus(
    messageId, 
    status
  ) {
    try {
      await api.put(`/api/chat/update-status/${messageId}`, { status });
      return true;
    } catch (error) {
      console.error('Update message status error:', error);
      throw error;
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId, userId) {
    try {
      await api.delete(`/api/chat/delete/${messageId}?userId=${userId}`);
      return true;
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }

  /**
   * Get recent messages (last N messages)
   */
  async getRecentMessages(userId, limit = 50) {
    try {
      const allMessages = await this.getUserMessages(userId);
      return allMessages
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    } catch (error) {
      console.error('Get recent messages error:', error);
      throw error;
    }
  }

  /**
   * Get messages by type
   */
  async getMessagesByType(userId, messageType) {
    try {
      const allMessages = await this.getUserMessages(userId);
      return allMessages.filter(message => message.messageType === messageType);
    } catch (error) {
      console.error('Get messages by type error:', error);
      throw error;
    }
  }

  /**
   * Search messages by content
   */
  async searchMessages(userId, searchTerm) {
    try {
      const allMessages = await this.getUserMessages(userId);
      const lowercaseSearch = searchTerm.toLowerCase();
      
      return allMessages.filter(message => 
        message.content.toLowerCase().includes(lowercaseSearch)
      );
    } catch (error) {
      console.error('Search messages error:', error);
      throw error;
    }
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(userId) {
    try {
      const allMessages = await this.getUserMessages(userId);
      return allMessages.filter(message => 
        !message.isFromUser && !message.isRead
      ).length;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  /**
   * Mark all messages as read
   */
  async markAllAsRead(userId) {
    try {
      const unreadMessages = await this.getUserMessages(userId);
      const unreadMessageIds = unreadMessages
        .filter(message => !message.isFromUser && !message.isRead)
        .map(message => message.id);
      
      for (const messageId of unreadMessageIds) {
        await this.updateMessageStatus(messageId, 'read');
      }
      
      return true;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  /**
   * Get conversation summary
   */
  async getConversationSummary(userId, days = 7) {
    try {
      const response = await api.get(`/api/chat/summary?userId=${userId}&days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Get conversation summary error:', error);
      
      // Fallback: generate basic summary from recent messages
      try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const allMessages = await this.getUserMessages(userId);
        const recentMessages = allMessages.filter(message => 
          new Date(message.timestamp) >= cutoffDate
        );
        
        return {
          totalMessages: recentMessages.length,
          userMessages: recentMessages.filter(m => m.isFromUser).length,
          aiMessages: recentMessages.filter(m => !m.isFromUser).length,
          timeRange: {
            from: cutoffDate.toISOString(),
            to: new Date().toISOString()
          }
        };
      } catch (fallbackError) {
        console.error('Fallback summary error:', fallbackError);
        throw error;
      }
    }
  }

  /**
   * Start a new conversation topic
   */
  async startNewTopic(userId, topic) {
    try {
      return await this.sendMessage(userId, `New topic: ${topic}`, 'topic');
    } catch (error) {
      console.error('Start new topic error:', error);
      throw error;
    }
  }

  /**
   * Send file or image message
   */
  async sendFileMessage(
    userId, 
    file, 
    description
  ) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId.toString());
      formData.append('messageType', file.type.startsWith('image/') ? 'image' : 'file');
      if (description) formData.append('description', description);
      
      const response = await api.post('/api/chat/send-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Send file message error:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default chatService;