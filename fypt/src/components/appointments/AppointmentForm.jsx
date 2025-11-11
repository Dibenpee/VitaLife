import { useState, useEffect } from "react";
import { useAppointments, useAuth } from "../../hooks";
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
  Repeat,
  Bell,
  Save,
  X,
  AlertCircle,
  Plus,
} from "lucide-react";

const AppointmentForm = ({ appointment, onSave, onCancel, isOpen }) => {
  const { createAppointment, updateAppointment, loading, doctors } =
    useAppointments();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    notes: "",
    location: "",
    type: "consultation",
    priority: "normal",
    duration: 30,
    status: "scheduled",
    isRecurring: false,
    recurringPattern: "weekly",
    recurringEndDate: "",
    reminderEnabled: true,
    reminderTime: 24, // hours before
    patientPhone: "",
    patientEmail: "",
    patientName: "",
  });
  const [errors, setErrors] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (appointment) {
      const aptDate = new Date(appointment.appointmentDate);
      setFormData({
        ...appointment,
        appointmentDate: aptDate.toISOString().split("T")[0],
        appointmentTime: aptDate.toTimeString().slice(0, 5),
        reminderEnabled: appointment.reminderEnabled ?? true,
        reminderTime: appointment.reminderTime ?? 24,
        isRecurring: appointment.isRecurring ?? false,
      });
    } else {
      // Reset form for new appointment
      setFormData((prev) => ({
        ...prev,
        patientId: user?.role === "patient" ? user.id : "",
        appointmentDate: new Date().toISOString().split("T")[0],
      }));
    }
  }, [appointment, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const appointmentDateTime = new Date(
        `${formData.appointmentDate}T${formData.appointmentTime}`
      );

      const appointmentData = {
        ...formData,
        appointmentDate: appointmentDateTime.toISOString(),
      };

      if (appointment) {
        await updateAppointment(appointment.id, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }

      onSave();
    } catch (error) {
      console.error("Error saving appointment:", error);
      setErrors({ submit: "Failed to save appointment. Please try again." });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctorId) {
      newErrors.doctorId = "Doctor is required";
    }
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Date is required";
    }
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Time is required";
    }
    if (!formData.reason) {
      newErrors.reason = "Reason is required";
    }
    if (!formData.patientName && user?.role !== "patient") {
      newErrors.patientName = "Patient name is required";
    }

    // Validate appointment is in the future
    if (formData.appointmentDate && formData.appointmentTime) {
      const appointmentDateTime = new Date(
        `${formData.appointmentDate}T${formData.appointmentTime}`
      );
      if (appointmentDateTime <= new Date()) {
        newErrors.appointmentTime = "Appointment must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const appointmentTypes = [
    { value: "consultation", label: "Consultation" },
    { value: "follow-up", label: "Follow-up" },
    { value: "checkup", label: "Checkup" },
    { value: "procedure", label: "Procedure" },
    { value: "surgery", label: "Surgery" },
    { value: "emergency", label: "Emergency" },
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "text-green-600" },
    { value: "normal", label: "Normal", color: "text-blue-600" },
    { value: "high", label: "High", color: "text-yellow-600" },
    { value: "urgent", label: "Urgent", color: "text-red-600" },
  ];

  const recurringPatterns = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {appointment ? "Edit Appointment" : "New Appointment"}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Basic Information
                </h3>

                {user?.role !== "patient" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patientName: e.target.value,
                        })
                      }
                      className={cn(
                        "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                        errors.patientName
                          ? "border-red-300"
                          : "border-gray-300"
                      )}
                      placeholder="Enter patient name"
                    />
                    {errors.patientName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.patientName}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Stethoscope className="h-4 w-4 inline mr-1" />
                    Doctor *
                  </label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) =>
                      setFormData({ ...formData, doctorId: e.target.value })
                    }
                    className={cn(
                      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                      errors.doctorId ? "border-red-300" : "border-gray-300"
                    )}
                  >
                    <option value="">Select a doctor</option>
                    {doctors?.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                  {errors.doctorId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.doctorId}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appointmentDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className={cn(
                        "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                        errors.appointmentDate
                          ? "border-red-300"
                          : "border-gray-300"
                      )}
                    />
                    {errors.appointmentDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.appointmentDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Time *
                    </label>
                    <select
                      value={formData.appointmentTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appointmentTime: e.target.value,
                        })
                      }
                      className={cn(
                        "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                        errors.appointmentTime
                          ? "border-red-300"
                          : "border-gray-300"
                      )}
                    >
                      <option value="">Select time</option>
                      {generateTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {new Date(`2000-01-01T${time}`).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </option>
                      ))}
                    </select>
                    {errors.appointmentTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.appointmentTime}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Reason for Visit *
                  </label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className={cn(
                      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                      errors.reason ? "border-red-300" : "border-gray-300"
                    )}
                    placeholder="Brief description of the appointment purpose"
                  />
                  {errors.reason && (
                    <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Additional Details
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {appointmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priorityLevels.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Room, building, or clinic location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes or special instructions"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Advanced Options</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recurring Appointments */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isRecurring: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="isRecurring"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      <Repeat className="h-4 w-4" />
                      Recurring Appointment
                    </label>
                  </div>

                  {formData.isRecurring && (
                    <div className="space-y-3 ml-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Repeat Pattern
                        </label>
                        <select
                          value={formData.recurringPattern}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              recurringPattern: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {recurringPatterns.map((pattern) => (
                            <option key={pattern.value} value={pattern.value}>
                              {pattern.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={formData.recurringEndDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              recurringEndDate: e.target.value,
                            })
                          }
                          min={formData.appointmentDate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reminders */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="reminderEnabled"
                      checked={formData.reminderEnabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reminderEnabled: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="reminderEnabled"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      <Bell className="h-4 w-4" />
                      Send Reminder
                    </label>
                  </div>

                  {formData.reminderEnabled && (
                    <div className="ml-6">
                      <label className="block text-sm font-medium mb-1">
                        Remind Before
                      </label>
                      <select
                        value={formData.reminderTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reminderTime: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>1 hour</option>
                        <option value={2}>2 hours</option>
                        <option value={4}>4 hours</option>
                        <option value={24}>1 day</option>
                        <option value={48}>2 days</option>
                        <option value={168}>1 week</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {appointment ? "Update" : "Create"} Appointment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentForm;
