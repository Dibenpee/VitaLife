import { useState } from "react";
import { useAppointments } from "../../hooks";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  FileText,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Repeat,
  MessageSquare,
  History,
  X,
} from "lucide-react";

const AppointmentDetails = ({ appointment, onEdit, onClose, isOpen }) => {
  const { updateAppointment, cancelAppointment, loading } = useAppointments();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [notes, setNotes] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);

  if (!isOpen || !appointment) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "no-show":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "text-green-600";
      case "normal":
        return "text-blue-600";
      case "high":
        return "text-yellow-600";
      case "urgent":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getTimeUntilAppointment = () => {
    const now = new Date();
    const aptTime = new Date(appointment.appointmentDate);
    const diffMs = aptTime - now;

    if (diffMs < 0) {
      return "Past appointment";
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} days, ${hours} hours`;
    } else if (hours > 0) {
      return `${hours} hours, ${minutes} minutes`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateAppointment(appointment.id, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelAppointment(appointment.id);
      setShowCancelConfirm(false);
      onClose();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const handleAddNote = async () => {
    if (!notes.trim()) return;

    try {
      const updatedNotes = appointment.notes
        ? `${appointment.notes}\n\n[${new Date().toLocaleString()}] ${notes}`
        : `[${new Date().toLocaleString()}] ${notes}`;

      await updateAppointment(appointment.id, { notes: updatedNotes });
      setNotes("");
      setShowAddNote(false);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const { date, time } = formatDateTime(appointment.appointmentDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">Appointment Details</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {date} at {time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium border",
                  getStatusColor(appointment.status)
                )}
              >
                {appointment.status}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Until Appointment */}
          {appointment.status !== "completed" &&
            appointment.status !== "cancelled" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Time Until Appointment</span>
                </div>
                <p className="text-blue-700 mt-1 text-lg font-semibold">
                  {getTimeUntilAppointment()}
                </p>
              </div>
            )}

          {/* Main Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Appointment Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Patient</p>
                    <p className="font-medium">{appointment.patientName}</p>
                    {appointment.patientPhone && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Phone className="h-4 w-4" />
                        {appointment.patientPhone}
                      </p>
                    )}
                    {appointment.patientEmail && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Mail className="h-4 w-4" />
                        {appointment.patientEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Stethoscope className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium">Dr. {appointment.doctorName}</p>
                    {appointment.doctorSpecialty && (
                      <p className="text-sm text-gray-600">
                        {appointment.doctorSpecialty}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Reason</p>
                    <p className="font-medium">{appointment.reason}</p>
                  </div>
                </div>

                {appointment.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{appointment.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Additional Details
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="font-medium capitalize">
                    {appointment.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Priority</span>
                  <span
                    className={cn(
                      "font-medium capitalize",
                      getPriorityColor(appointment.priority)
                    )}
                  >
                    {appointment.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">
                    {appointment.duration} minutes
                  </span>
                </div>

                {appointment.isRecurring && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <Repeat className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800 text-sm font-medium">
                      Recurring {appointment.recurringPattern}
                    </span>
                  </div>
                )}

                {appointment.reminderEnabled && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <Bell className="h-4 w-4 text-green-600" />
                    <span className="text-green-800 text-sm font-medium">
                      Reminder set for {appointment.reminderTime}h before
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {(appointment.notes || showAddNote) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Notes</h3>
                {!showAddNote && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddNote(true)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Add Note
                  </Button>
                )}
              </div>

              {appointment.notes && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {appointment.notes}
                  </pre>
                </div>
              )}

              {showAddNote && (
                <div className="space-y-3">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleAddNote}
                      size="sm"
                      disabled={!notes.trim() || loading}
                    >
                      Add Note
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddNote(false);
                        setNotes("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {appointment.status === "scheduled" && (
                  <Button
                    onClick={() => handleStatusUpdate("confirmed")}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                    disabled={loading}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirm
                  </Button>
                )}

                {(appointment.status === "scheduled" ||
                  appointment.status === "confirmed") && (
                  <Button
                    onClick={() => handleStatusUpdate("completed")}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                    disabled={loading}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete
                  </Button>
                )}

                {appointment.status !== "cancelled" &&
                  appointment.status !== "completed" && (
                    <Button
                      onClick={() => setShowCancelConfirm(true)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      disabled={loading}
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </Button>
                  )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onEdit(appointment)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Cancel Confirmation */}
          {showCancelConfirm && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
                <div className="flex-1">
                  <h4 className="text-red-800 font-medium mb-2">
                    Cancel Appointment
                  </h4>
                  <p className="text-red-700 text-sm mb-4">
                    Are you sure you want to cancel this appointment? This
                    action cannot be undone.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleCancel}
                      size="sm"
                      variant="destructive"
                      disabled={loading}
                    >
                      {loading ? "Cancelling..." : "Yes, Cancel"}
                    </Button>
                    <Button
                      onClick={() => setShowCancelConfirm(false)}
                      size="sm"
                      variant="outline"
                      disabled={loading}
                    >
                      Keep Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentDetails;
