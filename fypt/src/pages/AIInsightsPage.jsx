import { useState, useEffect } from "react";
import { useAuth, useAI } from "../hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Sidebar from "../components/SideBar";
import vitalife from "../assets/vitalife.svg";
import {
  Brain,
  TrendingUp,
  Target,
  BarChart3,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  Pill,
  Calendar,
  Stethoscope,
  Sparkles,
  Zap,
  Bell,
} from "lucide-react";

const AIInsightsPage = () => {
  const { user } = useAuth();
  const {
    loading,
    getHealthInsights,
    getHealthTrends,
    getRiskAssessment,
    getPersonalizedRecommendations,
    generateHealthSummary,
  } = useAI();

  const [insights, setInsights] = useState(null);
  const [trends, setTrends] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [healthSummary, setHealthSummary] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.nid) {
      loadAIInsights();
    }
  }, [user?.nid]);

  const loadAIInsights = async () => {
    try {
      const [insightsData, trendsData, recommendationsData] = await Promise.all(
        [
          getHealthInsights(user.nid),
          getHealthTrends(user.nid),
          getPersonalizedRecommendations(user.nid),
        ]
      );

      setInsights(insightsData);
      setTrends(trendsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error("Failed to load AI insights:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "trends", label: "Health Trends", icon: TrendingUp },
    { id: "risks", label: "Risk Assessment", icon: AlertTriangle },
    { id: "recommendations", label: "Recommendations", icon: Target },
    { id: "summary", label: "Health Summary", icon: FileText },
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Health Insights
                </h1>
                <p className="text-gray-600">
                  Advanced health analytics and personalized recommendations
                  powered by AI
                </p>
              </div>
            </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">Good</p>
                    <p className="text-sm text-gray-600">Overall Health</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">85%</p>
                    <p className="text-sm text-gray-600">Health Score</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                    <p className="text-sm text-gray-600">Risk Factors</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                    <p className="text-sm text-gray-600">Recommendations</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Coming Soon Notice */}
            <Card className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Insights Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  We're building advanced AI-powered health analytics to provide
                  you with personalized insights, trend analysis, and health
                  recommendations.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span>Real-time Health Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span>Predictive Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>Personalized Recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span>Risk Assessment</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "trends" && (
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Health Trends Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Health trends analysis will show patterns in your health data
                  over time.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "risks" && (
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  AI-powered risk assessment based on your health profile and
                  medical history.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "recommendations" && (
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Get personalized health recommendations based on your unique
                  health profile.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "summary" && (
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Health Summary Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Comprehensive health summary reports generated by AI analysis.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
        </div>
      </div>
  );
};

export default AIInsightsPage;
