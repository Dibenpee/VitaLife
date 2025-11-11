import { useState, useEffect } from 'react';
import { useAppointments } from '../../hooks';
import { cn } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Plus,
  Filter,
  Search,
  MapPin
} from 'lucide-react';

const AppointmentCalendar = ({ onAppointmentSelect, onCreateNew }) => {
  const { appointments, loading, fetchAppointments } = useAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments) {
      let filtered = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        const matchesSearch = !searchTerm || 
          apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.reason?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      });
      setFilteredAppointments(filtered);
    }
  }, [appointments, searchTerm, statusFilter]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    if (!date || !filteredAppointments) return [];
    
    return filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date && selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading calendar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button
              onClick={onCreateNew}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
                className="p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
                className="p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('day')}
            >
              Day
            </Button>
          </div>
        </div>

        {view === 'month' && (
          <div className="grid grid-cols-7 gap-1">
            {/* Week day headers */}
            {weekDays.map(day => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-gray-600 border-b"
              >
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayAppointments = date ? getAppointmentsForDate(date) : [];
              
              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-32 p-2 border border-gray-100 cursor-pointer transition-colors",
                    date ? "hover:bg-gray-50" : "",
                    isToday(date) ? "bg-blue-50 border-blue-200" : "",
                    isSelected(date) ? "bg-blue-100 border-blue-300" : ""
                  )}
                  onClick={() => date && setSelectedDate(date)}
                >
                  {date && (
                    <>
                      <div className={cn(
                        "text-sm font-medium mb-2",
                        isToday(date) ? "text-blue-600" : "text-gray-900"
                      )}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 3).map((apt, aptIndex) => (
                          <div
                            key={aptIndex}
                            className={cn(
                              "text-xs p-1 rounded border cursor-pointer truncate",
                              getStatusColor(apt.status)
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentSelect(apt);
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(apt.appointmentDate)}
                            </div>
                            <div className="truncate">
                              {apt.doctorName || apt.patientName}
                            </div>
                          </div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayAppointments.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {view === 'week' && (
          <div className="text-center text-gray-500 py-8">
            Week view coming soon...
          </div>
        )}

        {view === 'day' && selectedDate && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <div className="space-y-2">
              {getAppointmentsForDate(selectedDate).map((apt) => (
                <div
                  key={apt.id}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                    getStatusColor(apt.status)
                  )}
                  onClick={() => onAppointmentSelect(apt)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {formatTime(apt.appointmentDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{apt.patientName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          <span>{apt.doctorName}</span>
                        </div>
                      </div>
                      {apt.reason && (
                        <p className="text-sm text-gray-600">{apt.reason}</p>
                      )}
                      {apt.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{apt.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium capitalize">
                      {apt.status}
                    </div>
                  </div>
                </div>
              ))}
              {getAppointmentsForDate(selectedDate).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No appointments scheduled for this day.
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendar;