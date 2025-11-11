import { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Bell,
  Clock,
  Star,
  StarOff,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Calendar,
  Pill,
  AlertTriangle,
  Info,
  Activity,
  Settings as SettingsIcon,
  User,
  Check,
  X,
} from "lucide-react";

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onStar,
  showActions = true,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case "appointment":
        return Calendar;
      case "medication":
        return Pill;
      case "health":
        return Activity;
      case "system":
        return SettingsIcon;
      case "warning":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getTypeColor = (type, priority) => {
    const colors = {
      appointment: "text-blue-600 bg-blue-50",
      medication: "text-green-600 bg-green-50",
      health: "text-purple-600 bg-purple-50",
      system: "text-gray-600 bg-gray-50",
      warning: "text-orange-600 bg-orange-50",
      info: "text-blue-600 bg-blue-50",
    };

    if (priority === "high") {
      return "text-red-600 bg-red-50";
    }

    return colors[type] || colors.info;
  };

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

    return date.toLocaleDateString();
  };

  const TypeIcon = getTypeIcon(notification.type);
  const typeColorClass = getTypeColor(notification.type, notification.priority);

  const handleMarkAsRead = () => {
    onMarkAsRead?.(notification.id);
    setShowMenu(false);
  };

  const handleMarkAsUnread = () => {
    onMarkAsUnread?.(notification.id);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      onDelete?.(notification.id);
    }
    setShowMenu(false);
  };

  const handleStar = () => {
    onStar?.(notification.id, !notification.isStarred);
  };

  return (
    <Card
      className={cn(
        "p-4 border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer",
        getPriorityIndicator(notification.priority),
        !notification.isRead && "bg-blue-50/30 border-blue-200",
        notification.isStarred && "ring-1 ring-yellow-200",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            typeColorClass
          )}
        >
          <TypeIcon className="w-5 h-5" />
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-medium text-sm leading-tight",
                !notification.isRead ? "text-gray-900" : "text-gray-700"
              )}
            >
              {notification.title}
            </h3>

            {/* Status Indicators */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {notification.isStarred && (
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              )}
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
          </div>

          <p
            className={cn(
              "text-sm mt-1 leading-relaxed",
              !notification.isRead ? "text-gray-800" : "text-gray-600"
            )}
          >
            {notification.content}
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{formatTimestamp(notification.timestamp)}</span>

              {/* Priority Badge */}
              {notification.priority === "high" && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                  Urgent
                </span>
              )}
            </div>

            {/* Action Buttons */}
            {showActions && isHovered && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStar}
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                  title={notification.isStarred ? "Unstar" : "Star"}
                >
                  {notification.isStarred ? (
                    <StarOff className="w-3 h-3 text-yellow-500" />
                  ) : (
                    <Star className="w-3 h-3" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={
                    notification.isRead ? handleMarkAsUnread : handleMarkAsRead
                  }
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                  title={
                    notification.isRead ? "Mark as unread" : "Mark as read"
                  }
                >
                  {notification.isRead ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </Button>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMenu(!showMenu)}
                    className="h-6 w-6 p-0 hover:bg-gray-200"
                    title="More actions"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>

                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border z-10">
                      <div className="py-1">
                        <button
                          onClick={handleDelete}
                          className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;
