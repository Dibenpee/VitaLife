import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import vitalife from "../../assets/vitalife.svg";
import {
  TextField,
  EmailField,
  PhoneField,
  DateField,
  SelectField,
  PasswordField,
} from "../../components/Fields";
import {
  User,
  Heart,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const NewUser = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",

    // Medical Info
    bloodType: "",
    allergies: "",
    medications: "",
    emergencyContact: "",
    emergencyPhone: "",
    primaryDoctor: "",
    insuranceProvider: "",
    policyNumber: "",

    // Security
    password: "",
    confirmPassword: "",

    // Preferences
    notifications: {
      email: true,
      sms: false,
      reminders: true,
      reports: true,
    },
    privacy: {
      shareData: false,
      analytics: true,
    },
  });

  const totalSteps = 3;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Registration Data:", formData);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
            ${
              currentStep >= step
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-500"
            }
          `}
          >
            {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`
              w-12 h-1 mx-2
              ${currentStep > step ? "bg-green-600" : "bg-gray-200"}
            `}
            />
          )}
        </div>
      ))}
    </div>
  );

  const stepTitles = {
    1: "Personal Information",
    2: "Security Setup",
    3: "Preferences & Privacy",
  };

  const stepDescriptions = {
    1: "Let's start with your basic information",
    2: "Secure your account with a strong password",
    3: "Customize your VitaLife experience",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <img src={vitalife} alt="VitaLife logo" className="w-10 h-auto" />
            <h1 className="text-2xl font-bold text-gray-900">
              Vita<span className="text-green-600">Life</span>
            </h1>
          </div>
          <p className="text-gray-600">
            Welcome! Let's get your health records organized.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <StepIndicator />

          <Card className="p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {stepTitles[currentStep]}
              </h2>
              <p className="text-gray-600">{stepDescriptions[currentStep]}</p>
            </div>

            <div className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      icon={User}
                      placeholder="Enter your first name"
                      required
                    />

                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      icon={User}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <EmailField
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PhoneField
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />

                    <DateField
                      label="Date of Birth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <SelectField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                      {
                        value: "prefer-not-to-say",
                        label: "Prefer not to say",
                      },
                    ]}
                    placeholder="Select your gender"
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">
                        Security Information
                      </h3>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      Create a strong password to protect your medical records.
                      Your password should be at least 8 characters long.
                    </p>
                  </div>

                  <PasswordField
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    required
                    helper="Minimum 8 characters with letters, numbers, and symbols"
                  />

                  <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    error={
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                        ? "Passwords do not match"
                        : ""
                    }
                    success={
                      formData.confirmPassword &&
                      formData.password === formData.confirmPassword
                        ? "Passwords match"
                        : ""
                    }
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">
                        Almost Done!
                      </h3>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Customize your experience and privacy settings. You can
                      change these later in your account settings.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      Notification Preferences
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="notifications.email"
                          checked={formData.notifications.email}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            Email Notifications
                          </span>
                          <p className="text-xs text-gray-500">
                            Receive important updates via email
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="notifications.sms"
                          checked={formData.notifications.sms}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            SMS Notifications
                          </span>
                          <p className="text-xs text-gray-500">
                            Receive text message alerts
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="notifications.reminders"
                          checked={formData.notifications.reminders}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            Appointment Reminders
                          </span>
                          <p className="text-xs text-gray-500">
                            Get reminded about upcoming appointments
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      Privacy Settings
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="privacy.shareData"
                          checked={formData.privacy.shareData}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            Share Anonymized Data
                          </span>
                          <p className="text-xs text-gray-500">
                            Help improve healthcare research (optional)
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="privacy.analytics"
                          checked={formData.privacy.analytics}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            Usage Analytics
                          </span>
                          <p className="text-xs text-gray-500">
                            Help us improve VitaLife with usage data
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </div>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Registration</span>
                </Button>
              )}
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
