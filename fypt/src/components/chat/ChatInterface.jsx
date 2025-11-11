import { useState, useEffect, useRef } from "react";
import { useAuth, useChat } from "../../hooks";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {
  Bot,
  MessageSquare,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Download,
  Star,
  History,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Brain,
} from "lucide-react";

const ChatInterface = ({
  className,
  height = "600px",
  showHeader = true,
  autoScroll = true,
  ...props
}) => {
  const { user } = useAuth();
  const {
    messages,
    loading,
    error,
    sendMessage,
    sendFileMessage,
    deleteMessage,
    updateMessageStatus,
    markAllAsRead,
    searchMessages,
    getRecentMessages,
    startNewTopic,
    hasUnreadMessages,
  } = useChat(user?.nid);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isTyping, setIsTyping] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [conversationStats, setConversationStats] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Messages", icon: MessageSquare },
    { value: "starred", label: "Starred", icon: Star },
    { value: "text", label: "Text Only", icon: MessageSquare },
    { value: "files", label: "With Files", icon: Download },
    { value: "today", label: "Today", icon: History },
  ];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredMessages.length, autoScroll]);

  // Listen for external message sending events
  useEffect(() => {
    const handleExternalMessage = (event) => {
      if (event.detail?.message) {
        handleSendMessage(event.detail.message);
      }
    };

    window.addEventListener("sendChatMessage", handleExternalMessage);
    return () => {
      window.removeEventListener("sendChatMessage", handleExternalMessage);
    };
  }, []);

  // Filter and search messages
  useEffect(() => {
    let result = [...messages];

    // Apply filters
    switch (selectedFilter) {
      case "starred":
        result = result.filter((msg) => msg.isStarred);
        break;
      case "text":
        result = result.filter((msg) => msg.messageType === "text");
        break;
      case "files":
        result = result.filter((msg) => msg.file || msg.messageType !== "text");
        break;
      case "today":
        const today = new Date().toDateString();
        result = result.filter(
          (msg) => new Date(msg.timestamp).toDateString() === today
        );
        break;
      default:
        // 'all' - no filtering
        break;
    }

    // Apply search
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        (msg) =>
          msg.content.toLowerCase().includes(lowercaseSearch) ||
          msg.file?.description?.toLowerCase().includes(lowercaseSearch)
      );
    }

    setFilteredMessages(result);
  }, [messages, selectedFilter, searchTerm]);

  // Calculate conversation statistics
  useEffect(() => {
    if (messages.length > 0) {
      const stats = {
        total: messages.length,
        userMessages: messages.filter((m) => m.isFromUser).length,
        aiMessages: messages.filter((m) => !m.isFromUser).length,
        starredMessages: messages.filter((m) => m.isStarred).length,
        todayMessages: messages.filter(
          (m) =>
            new Date(m.timestamp).toDateString() === new Date().toDateString()
        ).length,
      };
      setConversationStats(stats);
    }
  }, [messages]);

  const handleSendMessage = async (content) => {
    try {
      setIsTyping(true);
      await sendMessage(content);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendFile = async (file, description) => {
    try {
      setIsTyping(true);
      await sendFileMessage(file, description);
    } catch (error) {
      console.error("Failed to send file:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleStarMessage = async (messageId, isStarred) => {
    try {
      await updateMessageStatus(messageId, isStarred ? "starred" : "unstarred");
    } catch (error) {
      console.error("Failed to update message status:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(messageId);
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    }
  };

  const handleCopyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleStartNewTopic = async () => {
    const topic = window.prompt("Enter a topic for the new conversation:");
    if (topic?.trim()) {
      try {
        await startNewTopic(topic.trim());
      } catch (error) {
        console.error("Failed to start new topic:", error);
      }
    }
  };

  const clearAllMessages = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all messages? This action cannot be undone."
      )
    ) {
      // Implementation would depend on if you have a clear all endpoint
      console.log("Clear all messages requested");
    }
  };

  const exportConversation = () => {
    const exportData = {
      conversation: filteredMessages,
      exportDate: new Date().toISOString(),
      user: user?.name || "Unknown",
      stats: conversationStats,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <Card className={cn("flex items-center justify-center p-6", className)}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chat Error
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn("flex flex-col overflow-hidden", className)}
      style={{ height }}
      {...props}
    >
      {/* Header */}
      {showHeader && (
        <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Health Assistant</CardTitle>
                <p className="text-green-100 text-sm">
                  {isTyping
                    ? "AI is typing..."
                    : `${conversationStats?.total || 0} messages`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasUnreadMessages && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-white hover:bg-white/10"
                  title="Mark all as read"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="text-white hover:bg-white/10"
                title="Search messages"
              >
                <Search className="w-4 h-4" />
              </Button>

              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  title="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>

                {/* Dropdown menu - you could implement a proper dropdown component */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <div className="py-1">
                    <button
                      onClick={handleStartNewTopic}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      New Topic
                    </button>
                    <button
                      onClick={exportConversation}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Chat
                    </button>
                    <button
                      onClick={clearAllMessages}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="mt-3 flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {filterOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-gray-800"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardHeader>
      )}

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <div
          ref={messagesContainerRef}
          className="h-full overflow-y-auto scroll-smooth"
        >
          {loading && filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading conversation...</p>
              </div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md mx-auto p-6">
                <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to AI Health Assistant
                </h3>
                <p className="text-gray-600 mb-6">
                  I'm here to help with your health questions, analyze your
                  medical records, and provide personalized health insights. How
                  can I assist you today?
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-800">
                    Try asking:
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• "What do my latest test results mean?"</p>
                    <p>• "Analyze my medication interactions"</p>
                    <p>• "Give me health recommendations"</p>
                    <p>• "Summarize my medical history"</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pb-4">
              {/* Conversation Stats */}
              {conversationStats && (
                <div className="px-4 py-2 bg-gray-50 border-b">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>
                      {conversationStats.total} messages (
                      {conversationStats.userMessages} from you,{" "}
                      {conversationStats.aiMessages} from AI)
                    </span>
                    {conversationStats.starredMessages > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {conversationStats.starredMessages} starred
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              {filteredMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isFromUser={message.isFromUser}
                  onStar={handleStarMessage}
                  onDelete={handleDeleteMessage}
                  onCopy={handleCopyMessage}
                  className="border-b border-gray-100 last:border-b-0"
                />
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </CardContent>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t bg-gray-50">
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendFile={handleSendFile}
          disabled={loading}
          loading={isTyping}
          placeholder="Ask me about your health, medical records, or symptoms..."
        />
      </div>
    </Card>
  );
};

export default ChatInterface;
