import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services';

export const useChat = (userId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await chatService.getUserMessages(userId);
      setMessages(data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
    } catch (error) {
      setError(error.message);
      console.error('Fetch messages error:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    
    try {
      const count = await chatService.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Fetch unread count error:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [fetchMessages, fetchUnreadCount]);

  const sendMessage = useCallback(async (content, messageType = 'text') => {
    if (!userId || !content.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const newMessage = await chatService.sendMessage(userId, content, messageType);
      setMessages(prev => [...prev, newMessage]);
      
      // Try to get AI response
      try {
        const aiResponse = await chatService.getAIResponse(userId, newMessage.id);
        setMessages(prev => [...prev, aiResponse]);
      } catch (aiError) {
        console.error('AI response error:', aiError);
        // Don't throw - user message was sent successfully
      }
      
      return newMessage;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const sendFileMessage = useCallback(async (file, description) => {
    if (!userId || !file) return;
    
    setLoading(true);
    setError(null);
    try {
      const newMessage = await chatService.sendFileMessage(userId, file, description);
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const deleteMessage = useCallback(async (messageId) => {
    setLoading(true);
    setError(null);
    try {
      await chatService.deleteMessage(messageId, userId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateMessageStatus = useCallback(async (messageId, status) => {
    try {
      await chatService.updateMessageStatus(messageId, status);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: status === 'read' } : msg
      ));
      if (status === 'read') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await chatService.markAllAsRead(userId);
      setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
      setUnreadCount(0);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [userId]);

  const searchMessages = useCallback(async (searchTerm) => {
    if (!userId || !searchTerm) return [];
    
    try {
      return await chatService.searchMessages(userId, searchTerm);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getRecentMessages = useCallback(async (limit = 50) => {
    if (!userId) return [];
    
    try {
      return await chatService.getRecentMessages(userId, limit);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getMessagesByType = useCallback(async (messageType) => {
    if (!userId) return [];
    
    try {
      return await chatService.getMessagesByType(userId, messageType);
    } catch (error) {
      setError(error.message);
      return [];
    }
  }, [userId]);

  const getConversationSummary = useCallback(async (days = 7) => {
    if (!userId) return null;
    
    try {
      return await chatService.getConversationSummary(userId, days);
    } catch (error) {
      setError(error.message);
      return null;
    }
  }, [userId]);

  const startNewTopic = useCallback(async (topic) => {
    if (!userId || !topic) return;
    
    try {
      const topicMessage = await chatService.startNewTopic(userId, topic);
      setMessages(prev => [...prev, topicMessage]);
      return topicMessage;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [userId]);

  // Computed values
  const messagesCount = messages.length;
  const userMessages = messages.filter(msg => msg.isFromUser);
  const aiMessages = messages.filter(msg => !msg.isFromUser);
  const todayMessages = messages.filter(msg => {
    const msgDate = new Date(msg.timestamp);
    const today = new Date();
    return msgDate.toDateString() === today.toDateString();
  });

  const lastMessage = messages[messages.length - 1] || null;
  const hasUnreadMessages = unreadCount > 0;

  return {
    messages,
    loading,
    error,
    unreadCount,
    messagesCount,
    userMessages,
    aiMessages,
    todayMessages,
    lastMessage,
    hasUnreadMessages,
    fetchMessages,
    sendMessage,
    sendFileMessage,
    deleteMessage,
    updateMessageStatus,
    markAllAsRead,
    searchMessages,
    getRecentMessages,
    getMessagesByType,
    getConversationSummary,
    startNewTopic,
    refreshMessages: fetchMessages
  };
};