// Data models matching the backend API

export interface User {
  nid: string;           // Primary Key - National ID
  name: string;
  email: string;
  password?: string;     // Only for requests, not responses
  salt?: string;         // For password hashing
  age: number;
  notifSub: boolean;     // Notification subscription status
  gender: 'M' | 'F';     // Single character
  bloodType: string;
  token?: string;        // JWT token
}

export interface Record {
  rid: number;           // Primary Key - Record ID
  title: string;
  description: string;
  type: string;          // e.g., "Lab", "Prescription", "Diagnosis"
  assocNID: string;      // Foreign Key to User
  entryTime: string;     // ISO 8601 DateTime string
}

export interface Appointment {
  appoId: number;        // Primary Key
  nid: string;           // Foreign Key to User
  doctorName: string;
  date: string;          // ISO 8601 DateTime string
}

export interface UserMsg {
  sessId: string;        // Primary Key - Session ID
  message: string;
  timestamp: string;     // ISO 8601 DateTime string
  author: string;        // "user" or "assistant"
  imp: boolean;          // Important/starred flag
}

export interface Notification {
  id: number;            // Primary Key
  nid: string;           // Foreign Key to User
  message: string;
  endpoint: string;      // Push notification endpoint
  type: number;          // Notification type
  timeStamp: string;     // ISO 8601 DateTime string
  p256DH: string;        // Push encryption key
  auth: string;          // Push auth secret
  urgent: boolean;
}

export interface LogEvent {
  id: number;            // Primary Key
  nid: string;           // Foreign Key to User
  title: string;
  description: string;
  type: number;          // Log type enum
  created: string;       // ISO 8601 DateTime string
}

// DTOs for API requests
export interface SignupRequest {
  nid: string;
  email: string;
  password: string;
  phone?: number;
  authCode?: string;
}

export interface LoginRequest {
  nid: string;
  password: string;
}

export interface LoginResponse {
  nid: string;
  name: string;
  email: string;
  token: string;
  salt: string;
}

export interface CreateRecordRequest {
  rid: number;
  title: string;
  description: string;
  type: string;
  assocNID: string;
  entryTime: string;
}

export interface AIMessageRequest {
  sessId: string;
  message: string;
  timestamp: string;
  author: string;
  imp: boolean;
}

export interface AIResponse {
  reply: string;
}

export interface BookAppointmentRequest {
  appoId: number;
  nid: string;
  doctorName: string;
  date: string;
}

// Common API response wrapper
export interface ApiResponse<T = any> {
  reply?: T;
  message?: string;
  error?: string;
}

// Record types constants
export const RECORD_TYPES = {
  LAB: 'Lab',
  PRESCRIPTION: 'Prescription',
  DIAGNOSIS: 'Diagnosis',
  SCAN: 'Scan',
  CHECKUP: 'Checkup',
  XRAY: 'X-Ray',
  MRI: 'MRI',
  OTHER: 'Other'
} as const;

// Blood types constants
export const BLOOD_TYPES = {
  'A_POSITIVE': 'A+',
  'A_NEGATIVE': 'A-',
  'B_POSITIVE': 'B+',
  'B_NEGATIVE': 'B-',
  'AB_POSITIVE': 'AB+',
  'AB_NEGATIVE': 'AB-',
  'O_POSITIVE': 'O+',
  'O_NEGATIVE': 'O-',
  'UNKNOWN': 'Unknown'
} as const;