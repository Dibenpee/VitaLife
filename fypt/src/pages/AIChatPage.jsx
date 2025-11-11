import { useState, useEffect } from "react";
import { useAuth, useAI, useChat } from "../hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Sidebar from "../components/SideBar";
import vitalife from "../assets/vitalife.svg";
import ChatInterface from "../components/chat/ChatInterface";
import {
  Brain,
  Sparkles,
  FileText,
  BarChart3,
  Pill,
  AlertTriangle,
  TrendingUp,
  Stethoscope,
  Target,
  Activity,
  Bell,
} from "lucide-react";

const AIChatPage = () => {
  const { user } = useAuth();
  const {
    loading: aiLoading,
    getHealthInsights,
    generateHealthSummary,
    getPersonalizedRecommendations,
    askQuestion,
  } = useAI();
  const { messagesCount, todayMessages } = useChat(user?.nid);

  const [quickActions, setQuickActions] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Quick action templates
  const quickActionTemplates = [
    {
      id: "health-summary",
      title: "Get Health Summary",
      description: "Generate a comprehensive overview of your health status",
      icon: FileText,
      prompt:
        "Please provide a comprehensive summary of my current health status based on my medical records.",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "medication-review",
      title: "Medication Review",
      description: "Check for drug interactions and medication analysis",
      icon: Pill,
      prompt:
        "Can you review all my current medications and check for any potential interactions or concerns?",
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      id: "risk-assessment",
      title: "Health Risk Assessment",
      description: "Analyze potential health risks based on your profile",
      icon: AlertTriangle,
      prompt:
        "Please perform a health risk assessment based on my medical history, current conditions, and lifestyle factors.",
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      id: "recommendations",
      title: "Personalized Recommendations",
      description: "Get tailored health advice and recommendations",
      icon: Target,
      prompt:
        "What personalized health recommendations do you have for me based on my current health profile?",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "trends-analysis",
      title: "Health Trends",
      description: "Analyze trends in your health metrics over time",
      icon: TrendingUp,
      prompt:
        "Can you analyze the trends in my health metrics and lab results over the past few months?",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "symptoms-check",
      title: "Symptoms Analysis",
      description: "Analyze symptoms and get preliminary insights",
      icon: Stethoscope,
      prompt:
        "I'd like to discuss some symptoms I've been experiencing. Can you help me understand what they might indicate?",
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
  ];

  const commonQuestions = [
    "What do my latest blood test results mean?",
    "Should I be concerned about my blood pressure readings?",
    "What exercises are safe for my current condition?",
    "How can I improve my cholesterol levels?",
    "What are the side effects of my current medications?",
    "When should I schedule my next check-up?",
  ];

  useEffect(() => {
    // Initialize quick actions based on user's health profile
    setQuickActions(quickActionTemplates);

    // Generate AI suggestions based on recent activity
    const suggestions = commonQuestions.slice(0, 3);
    setAiSuggestions(suggestions);
  }, [user]);

  const handleQuickAction = (action) => {
    // This would trigger sending the prompt to the chat
    // The ChatInterface component should handle receiving external messages
    const event = new CustomEvent("sendChatMessage", {
      detail: { message: action.prompt },
    });
    window.dispatchEvent(event);
    setShowQuickActions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    const event = new CustomEvent("sendChatMessage", {
      detail: { message: suggestion },
    });
    window.dispatchEvent(event);
  };

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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Health Assistant
                </h1>
                <p className="text-gray-600">
                  Your personal AI companion for health insights and medical
                  guidance
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Activity className="w-4 h-4" />
                {messagesCount || 0} total conversations
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {todayMessages?.length || 0} messages today
              </span>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface
              height="calc(100vh - 200px)"
              showHeader={false}
              className="shadow-lg"
            />
          </div>

          {/* Sidebar with Quick Actions and Suggestions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {showQuickActions && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      onClick={() => handleQuickAction(action)}
                      className={`w-full p-4 h-auto flex items-start gap-3 border ${action.color} hover:opacity-80`}
                    >
                      <action.icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-green-500" />
                  Suggested Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full p-3 h-auto text-left text-sm text-gray-700 hover:bg-gray-100 justify-start"
                  >
                    <span className="text-blue-500 mr-2">•</span>
                    {suggestion}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Medical record analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-green-500" />
                    <span>Drug interaction checking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    <span>Health trend analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span>Personalized recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Risk assessments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-indigo-500" />
                    <span>Symptom analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">i</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">
                      Privacy & Security
                    </p>
                    <p className="text-blue-700 text-xs leading-relaxed">
                      Your health conversations are encrypted and secure. The AI
                      provides educational information and should not replace
                      professional medical advice.
                    </p>
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

export default AIChatPage;
