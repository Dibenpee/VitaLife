import { useState, useEffect } from "react";
import { useAuth, useNotifications } from "../../hooks";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import NotificationItem from "./NotificationItem";
import {
  Bell,
  BellRing,
  Filter,
  Search,
  CheckCheck,
  Trash2,
  Star,
  Calendar,
  Pill,
  Activity,
  AlertTriangle,
  Info,
  Settings as SettingsIcon,
  Loader2,
  RefreshCw,
  Plus,
  SortDesc,
  Archive,
  Download,
} from "lucide-react";

const NotificationsPanel = ({
  className,
  showHeader = true,
  maxHeight = "600px",
  enableRealtime = true,
  ...props
}) => {
  const { user } = useAuth();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    notificationsCount,
    unreadNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsByPriority,
    searchNotifications,
    fetchNotifications,
  } = useNotifications(user?.nid);

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [starredNotifications, setStarredNotifications] = useState([]);

  // Filter options
  const filterOptions = [
    { value: "all", label: "All", icon: Bell, count: notificationsCount },
    { value: "unread", label: "Unread", icon: BellRing, count: unreadCount },
    {
      value: "starred",
      label: "Starred",
      icon: Star,
      count: starredNotifications.length,
    },
    { value: "appointment", label: "Appointments", icon: Calendar },
    { value: "medication", label: "Medication", icon: Pill },
    { value: "health", label: "Health Updates", icon: Activity },
    { value: "system", label: "System", icon: SettingsIcon },
    { value: "warning", label: "Warnings", icon: AlertTriangle },
    { value: "info", label: "Information", icon: Info },
  ];

  // Priority filters
  const priorityFilters = [
    { value: "high", label: "High Priority", color: "text-red-600" },
    { value: "medium", label: "Medium Priority", color: "text-yellow-600" },
    { value: "low", label: "Low Priority", color: "text-green-600" },
  ];

  // Real-time updates
  useEffect(() => {
    if (enableRealtime && user?.nid) {
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval);
    }
  }, [enableRealtime, user?.nid, fetchNotifications]);

  // Filter and search notifications
  useEffect(() => {
    let result = [...notifications];

    // Update starred notifications
    setStarredNotifications(result.filter((n) => n.isStarred));

    // Apply filters
    switch (selectedFilter) {
      case "unread":
        result = unreadNotifications;
        break;
      case "starred":
        result = result.filter((n) => n.isStarred);
        break;
      case "appointment":
      case "medication":
      case "health":
      case "system":
      case "warning":
      case "info":
        result = result.filter((n) => n.type === selectedFilter);
        break;
      default:
        // 'all' - no filtering
        break;
    }

    // Apply search
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(lowercaseSearch) ||
          n.content.toLowerCase().includes(lowercaseSearch)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);

      if (sortOrder === "newest") {
        return dateB - dateA;
      } else if (sortOrder === "oldest") {
        return dateA - dateB;
      } else if (sortOrder === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (
          (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        );
      }
      return 0;
    });

    setFilteredNotifications(result);
  }, [
    notifications,
    selectedFilter,
    searchTerm,
    sortOrder,
    unreadNotifications,
  ]);

  const handleStarNotification = async (notificationId, isStarred) => {
    // Update local state optimistically
    setStarredNotifications((prev) =>
      isStarred
        ? [...prev, notifications.find((n) => n.id === notificationId)]
        : prev.filter((n) => n.id !== notificationId)
    );

    // Here you would call the API to update the star status
    // This depends on if your backend supports starring notifications
    console.log(
      `${isStarred ? "Starred" : "Unstarred"} notification ${notificationId}`
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleClearAll = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all notifications? This action cannot be undone."
      )
    ) {
      try {
        await clearAllNotifications();
      } catch (error) {
        console.error("Failed to clear all notifications:", error);
      }
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleExportNotifications = () => {
    const exportData = {
      notifications: filteredNotifications,
      exportDate: new Date().toISOString(),
      user: user?.name || "Unknown",
      totalCount: notificationsCount,
      unreadCount: unreadCount,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notifications-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Notifications
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn("flex flex-col overflow-hidden", className)}
      style={{ maxHeight }}
      {...props}
    >
      {/* Header */}
      {showHeader && (
        <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <p className="text-blue-100 text-sm">
                  {notificationsCount} total • {unreadCount} unread
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="text-white hover:bg-white/10"
                title="Refresh notifications"
              >
                <RefreshCw
                  className={cn("w-4 h-4", loading && "animate-spin")}
                />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-white hover:bg-white/10"
                title="Filter options"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Filter Pills */}
            {showFilters && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isActive = selectedFilter === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedFilter(option.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors",
                          isActive
                            ? "bg-white text-blue-600"
                            : "bg-white/10 text-white hover:bg-white/20"
                        )}
                      >
                        <IconComponent className="w-3 h-3" />
                        {option.label}
                        {option.count !== undefined && (
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded-full text-xs",
                              isActive
                                ? "bg-blue-100 text-blue-600"
                                : "bg-white/20"
                            )}
                          >
                            {option.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70">Sort by:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/50"
                  >
                    <option value="newest" className="bg-gray-800">
                      Newest First
                    </option>
                    <option value="oldest" className="bg-gray-800">
                      Oldest First
                    </option>
                    <option value="priority" className="bg-gray-800">
                      Priority
                    </option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
      )}

      {/* Bulk Actions */}
      {filteredNotifications.length > 0 && (
        <div className="flex-shrink-0 p-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="text-gray-600"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark All Read
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportNotifications}
                className="text-gray-600"
                title="Export notifications"
              >
                <Download className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:bg-red-50"
                title="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-y-auto">
          {loading && filteredNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Loading notifications...
                </p>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {searchTerm
                    ? "No matching notifications"
                    : "No notifications"}
                </h3>
                <p className="text-sm text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search or filters"
                    : selectedFilter === "all"
                    ? "You'll see notifications here when they arrive"
                    : `No ${filterOptions
                        .find((f) => f.value === selectedFilter)
                        ?.label.toLowerCase()} notifications`}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 p-3">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onMarkAsUnread={markAsUnread}
                  onDelete={deleteNotification}
                  onStar={handleStarNotification}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
