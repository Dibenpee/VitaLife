import { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Bot,
  User,
  Star,
  StarOff,
  Copy,
  Trash2,
  MoreVertical,
  Check,
  Image,
  FileText,
  Download,
} from "lucide-react";

const ChatMessage = ({
  message,
  isFromUser,
  onStar,
  onDelete,
  onCopy,
  showActions = true,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      await onCopy(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStar = () => {
    if (onStar) {
      onStar(message.id, !message.isStarred);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    setShowMenu(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute ago
    if (diff < 60000) {
      return "Just now";
    }

    // Less than 1 hour ago
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }

    // Less than 24 hours ago
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    // More than 24 hours ago
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const renderFilePreview = () => {
    if (!message.file) return null;

    const { file } = message;
    const isImage = file.type?.startsWith("image/");

    return (
      <div className="mt-2 p-2 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          {isImage ? (
            <>
              <Image className="w-4 h-4 text-blue-600" />
              <img
                src={file.url}
                alt={file.name}
                className="max-w-48 max-h-32 rounded-md object-cover"
              />
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700 flex-1 truncate">
                {file.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(file.url, "_blank")}
              >
                <Download className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
        {file.description && (
          <p className="text-xs text-gray-600 mt-1">{file.description}</p>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "group flex gap-3 py-4 px-4 hover:bg-gray-50/50 transition-colors",
        isFromUser ? "flex-row-reverse" : "flex-row",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isFromUser
            ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
            : "bg-gray-100 text-gray-600"
        )}
      >
        {isFromUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn("flex-1 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl")}
      >
        <Card
          className={cn(
            "p-3 shadow-sm border",
            isFromUser
              ? "bg-gradient-to-r from-green-500 to-blue-500 text-white border-green-200"
              : "bg-white border-gray-200"
          )}
        >
          {/* Message Header */}
          <div className="flex items-center justify-between mb-1">
            <span
              className={cn(
                "text-xs font-medium",
                isFromUser ? "text-green-100" : "text-gray-500"
              )}
            >
              {isFromUser ? "You" : "AI Assistant"}
            </span>
            <div className="flex items-center gap-1">
              {message.isStarred && (
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              )}
              <span
                className={cn(
                  "text-xs",
                  isFromUser ? "text-green-100" : "text-gray-400"
                )}
              >
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          </div>

          {/* Message Content */}
          <div
            className={cn(
              "text-sm leading-relaxed",
              isFromUser ? "text-white" : "text-gray-800"
            )}
          >
            {message.content}
          </div>

          {/* File Preview */}
          {renderFilePreview()}

          {/* Message Type Indicator */}
          {message.messageType && message.messageType !== "text" && (
            <div className="mt-2">
              <span
                className={cn(
                  "inline-block px-2 py-1 rounded-full text-xs font-medium",
                  isFromUser
                    ? "bg-white/20 text-green-100"
                    : "bg-blue-100 text-blue-800"
                )}
              >
                {message.messageType}
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* Actions */}
      {showActions && (
        <div
          className={cn(
            "flex-shrink-0 flex items-start gap-1 transition-opacity",
            isHovered ? "opacity-100" : "opacity-0",
            isFromUser ? "flex-row-reverse" : "flex-row"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0 hover:bg-gray-200"
            title={copied ? "Copied!" : "Copy message"}
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleStar}
            className="h-8 w-8 p-0 hover:bg-gray-200"
            title={message.isStarred ? "Unstar message" : "Star message"}
          >
            {message.isStarred ? (
              <StarOff className="w-3 h-3 text-yellow-500" />
            ) : (
              <Star className="w-3 h-3" />
            )}
          </Button>

          {showMenu ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
              title="Delete message"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(true)}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title="More actions"
            >
              <MoreVertical className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
