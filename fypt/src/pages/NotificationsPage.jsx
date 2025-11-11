import { useState, useEffect } from "react";
import { useAuth, useNotifications } from "../hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Sidebar from "../components/SideBar";
import vitalife from "../assets/vitalife.svg";
import NotificationsPanel from "../components/notifications/NotificationsPanel";
import {
  Bell,
  BellRing,
  Settings as SettingsIcon,
  TrendingUp,
  Calendar,
  Pill,
  Activity,
  AlertTriangle,
  Clock,
  Archive,
  Filter,
  BarChart3,
} from "lucide-react";

const NotificationsPage = () => {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    notificationsCount,
    getNotificationStats,
    getNotificationsByType,
    getNotificationsByPriority,
  } = useNotifications(user?.nid);

  const [notificationStats, setNotificationStats] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    medicationReminders: true,
    healthUpdates: true,
    systemNotifications: false,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getNotificationStats(30);
        setNotificationStats(stats);
      } catch (error) {
        console.error("Failed to load notification stats:", error);
      }
    };

    if (user?.nid) {
      loadStats();
    }
  }, [user?.nid, getNotificationStats]);

  const handleSettingsChange = (setting, value) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));

    // Here you would save settings to backend
    console.log("Settings updated:", { [setting]: value });
  };

  const quickStats = [
    {
      title: "Total Notifications",
      value: notificationsCount || 0,
      icon: Bell,
      color: "text-blue-600 bg-blue-50",
      description: "All time",
    },
    {
      title: "Unread",
      value: unreadCount || 0,
      icon: BellRing,
      color: "text-red-600 bg-red-50",
      description: "Needs attention",
    },
    {
      title: "This Month",
      value: notificationStats?.total || 0,
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
      description: "Last 30 days",
    },
    {
      title: "High Priority",
      value: notificationStats?.byPriority?.high || 0,
      icon: AlertTriangle,
      color: "text-orange-600 bg-orange-50",
      description: "Urgent items",
    },
  ];

  const notificationTypes = [
    {
      type: "appointment",
      title: "Appointments",
      icon: Calendar,
      color: "text-blue-600 bg-blue-50",
      count: notificationStats?.byType?.appointment || 0,
      description: "Appointment reminders and updates",
    },
    {
      type: "medication",
      title: "Medications",
      icon: Pill,
      color: "text-green-600 bg-green-50",
      count: notificationStats?.byType?.medication || 0,
      description: "Medication reminders and alerts",
    },
    {
      type: "health",
      title: "Health Updates",
      icon: Activity,
      color: "text-purple-600 bg-purple-50",
      count: notificationStats?.byType?.health || 0,
      description: "Health insights and recommendations",
    },
    {
      type: "system",
      title: "System",
      icon: SettingsIcon,
      color: "text-gray-600 bg-gray-50",
      count: notificationStats?.byType?.system || 0,
      description: "System updates and maintenance",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Sidebar />
            <div className="flex items-center space-x-2">
              <img src={vitalife} alt="VitaLife" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-900">
                Vita<span className="text-green-600">Life</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-green-600">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center relative">
                  <Bell className="w-7 h-7 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Notifications
                  </h1>
                  <p className="text-gray-600">
                    Stay updated with your health alerts and reminders
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {quickStats.map((stat, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-xs text-gray-500">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Notifications Panel */}
            <div className="lg:col-span-2">
              <NotificationsPanel
                showHeader={false}
                maxHeight="calc(100vh - 280px)"
                className="shadow-lg"
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notification Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    By Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notificationTypes.map((type) => (
                    <div
                      key={type.type}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.color}`}
                      >
                        <type.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm">{type.title}</h3>
                          <span className="text-lg font-bold text-gray-900">
                            {type.count}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Settings Panel */}
              {showSettings && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <SettingsIcon className="w-5 h-5 text-gray-500" />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <button
                        onClick={() =>
                          handleSettingsChange(
                            "emailNotifications",
                            !notificationSettings.emailNotifications
                          )
                        }
                        className={`w-11 h-6 rounded-full transition-colors ${
                          notificationSettings.emailNotifications
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                            notificationSettings.emailNotifications
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Push Notifications */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Push Notifications
                      </label>
                      <button
                        onClick={() =>
                          handleSettingsChange(
                            "pushNotifications",
                            !notificationSettings.pushNotifications
                          )
                        }
                        className={`w-11 h-6 rounded-full transition-colors ${
                          notificationSettings.pushNotifications
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                            notificationSettings.pushNotifications
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Appointment Reminders */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Appointment Reminders
                      </label>
                      <button
                        onClick={() =>
                          handleSettingsChange(
                            "appointmentReminders",
                            !notificationSettings.appointmentReminders
                          )
                        }
                        className={`w-11 h-6 rounded-full transition-colors ${
                          notificationSettings.appointmentReminders
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                            notificationSettings.appointmentReminders
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Medication Reminders */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Medication Reminders
                      </label>
                      <button
                        onClick={() =>
                          handleSettingsChange(
                            "medicationReminders",
                            !notificationSettings.medicationReminders
                          )
                        }
                        className={`w-11 h-6 rounded-full transition-colors ${
                          notificationSettings.medicationReminders
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                            notificationSettings.medicationReminders
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Quiet Hours */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Quiet Hours
                        </label>
                        <button
                          onClick={() =>
                            handleSettingsChange(
                              "quietHoursEnabled",
                              !notificationSettings.quietHoursEnabled
                            )
                          }
                          className={`w-11 h-6 rounded-full transition-colors ${
                            notificationSettings.quietHoursEnabled
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                              notificationSettings.quietHoursEnabled
                                ? "translate-x-5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      {notificationSettings.quietHoursEnabled && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-600">From</span>
                            <input
                              type="time"
                              value={notificationSettings.quietHoursStart}
                              onChange={(e) =>
                                handleSettingsChange(
                                  "quietHoursStart",
                                  e.target.value
                                )
                              }
                              className="text-xs border rounded px-2 py-1"
                            />
                            <span className="text-xs text-gray-600">to</span>
                            <input
                              type="time"
                              value={notificationSettings.quietHoursEnd}
                              onChange={(e) =>
                                handleSettingsChange(
                                  "quietHoursEnd",
                                  e.target.value
                                )
                              }
                              className="text-xs border rounded px-2 py-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => console.log("Mark all read")}
                  >
                    <BellRing className="w-4 h-4 mr-2" />
                    Mark All as Read
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => console.log("Archive old")}
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive Old Notifications
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => console.log("Filter by priority")}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Show High Priority Only
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
