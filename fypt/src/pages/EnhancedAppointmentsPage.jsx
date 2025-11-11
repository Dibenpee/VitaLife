import { useState, useEffect } from 'react';
import { useAppointments, useAuth } from '../hooks';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Sidebar from '../components/SideBar';
import vitalife from '../assets/vitalife.svg';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import AppointmentForm from '../components/appointments/AppointmentForm';
import AppointmentDetails from '../components/appointments/AppointmentDetails';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Plus,
  Filter,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  List,
  Grid,
  Bell
} from 'lucide-react';

const EnhancedAppointmentsPage = () => {
  const { appointments, loading, fetchAppointments } = useAppointments();
  const { user } = useAuth();
  const [view, setView] = useState('calendar'); // calendar, list
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateNew = () => {
    setEditingAppointment(null);
    setShowForm(true);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingAppointment(null);
    fetchAppointments();
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  const getFilteredAppointments = () => {
    if (!appointments) return [];

    let filtered = appointments;

    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(apt => apt.status === filter);
    }

    // Date range filter
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    if (dateRange !== 'all') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        switch (dateRange) {
          case 'today':
            return aptDate.toDateString() === new Date().toDateString();
          case 'week':
            return aptDate >= startOfWeek && aptDate <= endOfWeek;
          case 'month':
            return aptDate >= startOfMonth && aptDate <= endOfMonth;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  };

  const getStatsCards = () => {
    if (!appointments) return [];

    const total = appointments.length;
    const scheduled = appointments.filter(apt => apt.status === 'scheduled').length;
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
    const completed = appointments.filter(apt => apt.status === 'completed').length;

    return [
      {
        title: 'Total Appointments',
        value: total,
        icon: Calendar,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        change: 0
      },
      {
        title: 'Scheduled',
        value: scheduled,
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        change: 0
      },
      {
        title: 'Confirmed',
        value: confirmed,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        change: 0
      },
      {
        title: 'Completed',
        value: completed,
        icon: CheckCircle,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        change: 0
      }
    ];
  };

  const getUpcomingAppointments = () => {
    if (!appointments) return [];
    
    const now = new Date();
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate > now && (apt.status === 'scheduled' || apt.status === 'confirmed');
      })
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, 5);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enhanced Appointments</h1>
            <p className="text-gray-600 mt-1">
              Advanced appointment management with calendar view, scheduling, and reminders
            </p>
          </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={view === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('calendar')}
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </div>
          <Button
            onClick={handleCreateNew}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getStatsCards().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.change !== 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className={`h-3 w-3 ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`text-xs ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change > 0 ? '+' : ''}{stat.change}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {getFilteredAppointments().length} appointments found
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {view === 'calendar' ? (
            <AppointmentCalendar
              onAppointmentSelect={handleAppointmentSelect}
              onCreateNew={handleCreateNew}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  Appointments List
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getFilteredAppointments().length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No appointments found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No appointments match your current filters.
                    </p>
                    <Button onClick={handleCreateNew}>
                      Schedule New Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getFilteredAppointments().map((apt) => {
                      const { date, time } = formatDateTime(apt.appointmentDate);
                      return (
                        <div
                          key={apt.id}
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleAppointmentSelect(apt)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-sm text-gray-600">{date}</div>
                                <div className="text-lg font-semibold text-gray-900">{time}</div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">{apt.patientName}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Stethoscope className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">Dr. {apt.doctorName}</span>
                                </div>
                                <div className="text-sm text-gray-600">{apt.reason}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-2 ${getStatusColor(apt.status)}`}>
                                {apt.status}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {apt.type} • {apt.duration} min
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {getUpcomingAppointments().length === 0 ? (
                <div className="text-center py-6">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getUpcomingAppointments().map((apt) => {
                    const { date, time } = formatDateTime(apt.appointmentDate);
                    return (
                      <div
                        key={apt.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleAppointmentSelect(apt)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{apt.patientName}</span>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {date} at {time}
                        </div>
                        <div className="text-sm text-gray-600">
                          Dr. {apt.doctorName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={handleCreateNew}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button
                  onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {view === 'calendar' ? <List className="h-4 w-4 mr-2" /> : <CalendarIcon className="h-4 w-4 mr-2" />}
                  Switch to {view === 'calendar' ? 'List' : 'Calendar'} View
                </Button>
                <Button
                  onClick={() => {
                    fetchAppointments();
                  }}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={loading}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AppointmentForm
        appointment={editingAppointment}
        onSave={handleFormSave}
        onCancel={() => {
          setShowForm(false);
          setEditingAppointment(null);
        }}
        isOpen={showForm}
      />

      <AppointmentDetails
        appointment={selectedAppointment}
        onEdit={handleEdit}
        onClose={() => {
          setShowDetails(false);
          setSelectedAppointment(null);
        }}
        isOpen={showDetails}
      />
      </div>
    </div>
  );
};

export default EnhancedAppointmentsPage;