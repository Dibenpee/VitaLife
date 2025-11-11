import { useState, useEffect } from "react";
import { useAuth } from "../hooks";
import { logService } from "../services";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Sidebar from "../components/SideBar";
import vitalife from "../assets/vitalife.svg";
import LogsViewer from "../components/logs/LogsViewer";
import {
  Terminal,
  Activity,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Bug,
  Server,
  Database,
  Shield,
  Clock,
  TrendingUp,
  BarChart3,
  Download,
  Settings,
  Bell,
} from "lucide-react";

const SystemLogsPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logStats, setLogStats] = useState({});
  const [systemHealth, setSystemHealth] = useState({});

  // Load logs on component mount
  useEffect(() => {
    loadLogs();
  }, []);

  // Load all logs
  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all logs - you might want to limit this in production
      const allLogs = await logService.getAllLogs();
      setLogs(allLogs);

      // Calculate statistics
      const stats = calculateLogStats(allLogs);
      setLogStats(stats);

      // Calculate system health metrics
      const health = calculateSystemHealth(allLogs);
      setSystemHealth(health);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate log statistics
  const calculateLogStats = (logs) => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return logs.reduce((stats, log) => {
      const logDate = new Date(log.timestamp);
      const level = log.level?.toLowerCase() || "unknown";

      // Overall counts
      stats.total = (stats.total || 0) + 1;
      stats.byLevel = stats.byLevel || {};
      stats.byLevel[level] = (stats.byLevel[level] || 0) + 1;

      // Time-based counts
      if (logDate >= last24Hours) {
        stats.last24Hours = (stats.last24Hours || 0) + 1;
      }
      if (logDate >= lastWeek) {
        stats.lastWeek = (stats.lastWeek || 0) + 1;
      }

      return stats;
    }, {});
  };

  // Calculate system health metrics
  const calculateSystemHealth = (logs) => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentLogs = logs.filter(
      (log) => new Date(log.timestamp) >= last24Hours
    );
    const errorLogs = recentLogs.filter(
      (log) => log.level?.toLowerCase() === "error"
    );
    const warningLogs = recentLogs.filter(
      (log) => log.level?.toLowerCase() === "warning"
    );

    // Simple health scoring
    const errorRate =
      recentLogs.length > 0 ? errorLogs.length / recentLogs.length : 0;
    const warningRate =
      recentLogs.length > 0 ? warningLogs.length / recentLogs.length : 0;

    let healthScore = 100;
    healthScore -= errorRate * 50; // Errors heavily impact score
    healthScore -= warningRate * 20; // Warnings moderately impact score
    healthScore = Math.max(0, Math.min(100, healthScore));

    let status = "excellent";
    if (healthScore < 60) status = "poor";
    else if (healthScore < 80) status = "fair";
    else if (healthScore < 95) status = "good";

    return {
      score: Math.round(healthScore),
      status,
      errorCount: errorLogs.length,
      warningCount: warningLogs.length,
      totalEvents: recentLogs.length,
    };
  };

  // Handle log refresh
  const handleRefresh = () => {
    loadLogs();
  };

  // Handle log export
  const handleExport = async (exportData) => {
    console.log("Exporting logs:", exportData);
    // Additional export logic if needed
  };

  // Handle clear logs
  const handleClearLogs = async () => {
    try {
      // If you have a clear logs endpoint
      await logService.clearOldLogs?.(30); // Clear logs older than 30 days
      await loadLogs(); // Reload logs
    } catch (err) {
      console.error("Failed to clear logs:", err);
      alert("Failed to clear logs: " + err.message);
    }
  };

  // Quick stats cards
  const quickStats = [
    {
      title: "Total Logs",
      value: logStats.total || 0,
      icon: Terminal,
      color: "text-blue-600 bg-blue-50",
      description: "All time events",
    },
    {
      title: "Last 24 Hours",
      value: logStats.last24Hours || 0,
      icon: Clock,
      color: "text-green-600 bg-green-50",
      description: "Recent activity",
    },
    {
      title: "Error Rate",
      value: `${(
        ((logStats.byLevel?.error || 0) / (logStats.total || 1)) *
        100
      ).toFixed(1)}%`,
      icon: AlertCircle,
      color: "text-red-600 bg-red-50",
      description: "Critical issues",
    },
    {
      title: "System Health",
      value: `${systemHealth.score || 0}%`,
      icon: Activity,
      color:
        systemHealth.status === "excellent"
          ? "text-green-600 bg-green-50"
          : systemHealth.status === "good"
          ? "text-blue-600 bg-blue-50"
          : systemHealth.status === "fair"
          ? "text-yellow-600 bg-yellow-50"
          : "text-red-600 bg-red-50",
      description: systemHealth.status || "Unknown",
    },
  ];

  // Log level distribution
  const logLevelStats = [
    {
      level: "error",
      label: "Errors",
      count: logStats.byLevel?.error || 0,
      icon: AlertCircle,
      color: "text-red-600 bg-red-50",
    },
    {
      level: "warning",
      label: "Warnings",
      count: logStats.byLevel?.warning || 0,
      icon: AlertTriangle,
      color: "text-orange-600 bg-orange-50",
    },
    {
      level: "info",
      label: "Information",
      count: logStats.byLevel?.info || 0,
      icon: Info,
      color: "text-blue-600 bg-blue-50",
    },
    {
      level: "success",
      label: "Success",
      count: logStats.byLevel?.success || 0,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      level: "debug",
      label: "Debug",
      count: logStats.byLevel?.debug || 0,
      icon: Bug,
      color: "text-purple-600 bg-purple-50",
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
                {user?.name?.charAt(0) || 'U'}
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
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Terminal className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    System Logs
                  </h1>
                  <p className="text-gray-600">
                    Monitor system events, errors, and application activity
                  </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Log Settings
              </Button>
              <Button onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
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
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Logs Viewer */}
          <div className="lg:col-span-2">
            <LogsViewer
              logs={logs}
              loading={loading}
              error={error}
              onRefresh={handleRefresh}
              onExportLogs={handleExport}
              onClearLogs={handleClearLogs}
              showHeader={false}
              maxHeight="calc(100vh - 320px)"
              enableAutoRefresh={true}
              autoRefreshInterval={30000}
              className="shadow-lg"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-green-500" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div
                    className={`text-4xl font-bold mb-2 ${
                      systemHealth.status === "excellent"
                        ? "text-green-600"
                        : systemHealth.status === "good"
                        ? "text-blue-600"
                        : systemHealth.status === "fair"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {systemHealth.score || 0}%
                  </div>
                  <p className="text-sm text-gray-600 capitalize">
                    {systemHealth.status || "Unknown"} Health
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Events (24h):</span>
                    <span className="font-medium">
                      {systemHealth.totalEvents || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Errors:</span>
                    <span className="font-medium text-red-600">
                      {systemHealth.errorCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warnings:</span>
                    <span className="font-medium text-orange-600">
                      {systemHealth.warningCount || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Log Level Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Log Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {logLevelStats.map((stat) => (
                  <div
                    key={stat.level}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {stat.label}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {stat.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${stat.color
                            .replace("text-", "bg-")
                            .replace(" bg-", "-500 bg-")}`}
                          style={{
                            width: `${
                              logStats.total
                                ? (stat.count / logStats.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 border border-green-200">
                  <Server className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      API Server
                    </p>
                    <p className="text-xs text-green-700">Online</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Database
                    </p>
                    <p className="text-xs text-blue-700">Connected</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 border border-green-200">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Security
                    </p>
                    <p className="text-xs text-green-700">Protected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogsPage;
