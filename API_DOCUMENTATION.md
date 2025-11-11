# VitaLife API - Backend Documentation for Frontend Developers

## Overview
VitaLife API is a .NET 9.0 backend service for a health management system. It provides endpoints for user authentication, medical records management, appointments, AI assistant features, chat functionality, logging, and push notifications.

**Base URL**: `https://localhost:5500` (Development)  
**CORS Allowed Origin**: `https://127.0.0.1:3000`  
**Authentication**: JWT Bearer Token

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Configuration](#configuration)

---

## Technology Stack

- **Framework**: ASP.NET Core 9.0 (Minimal APIs)
- **Database**: SQL Server with Entity Framework Core 9.0
- **Authentication**: JWT Bearer Tokens
- **API Documentation**: Scalar (OpenAPI)
- **Push Notifications**: WebPush with VAPID authentication
- **Key Packages**:
  - Microsoft.EntityFrameworkCore.SqlServer (9.0.10)
  - Microsoft.AspNetCore.Authentication.JwtBearer (9.0.5)
  - Lib.Net.Http.WebPush (3.3.1)
  - Scalar.AspNetCore (2.3.1)

---

## Project Structure

```
vitalife-api/
├── DTOs/                    # Data Transfer Objects for API requests/responses
├── Data/                    # Database context and migrations
├── Endpoints/              # API endpoint definitions
├── Interfaces/             # Service interfaces
├── Migrations/             # Entity Framework migrations
├── Models/                 # Database entity models
├── Services/               # Business logic implementation
├── Program.cs              # Application configuration and startup
└── appsettings.json        # Configuration settings
```

### Key Files
- **Program.cs**: Main application configuration with DI container setup
- **Endpoints/**: Each file contains related endpoint mappings
- **Services/**: Implementation of business logic for each feature area
- **Models/**: Database entity definitions
- **DTOs/**: Request/Response objects for API communication

---

## Authentication & Authorization

### Authentication Scheme
- **Type**: JWT Bearer Token
- **Scheme Name**: "Reg"
- **Audience**: `vitalife-api`
- **Authority**: `https://localhost:5500`

### How to Authenticate
1. Call `/api/auth/signup` to create a new account
2. Call `/api/auth/login` to get a JWT token
3. Include token in subsequent requests: `Authorization: Bearer <token>`
4. Use `/api/auth/refresh` to refresh expired tokens

### Protected vs Public Endpoints
- All endpoints require authentication unless otherwise noted
- The authentication middleware is configured but specific endpoint authorization is handled in service layer

---

## API Endpoints

### 1. Authentication & User Management (`/api/auth/`)

#### POST `/api/auth/signup`
Register a new user account.

**Request Body**:
```json
{
  "nid": "string",        // National ID (required)
  "email": "string",      // Email address (required)
  "password": "string",   // Password (required)
  "phone": 0,            // Phone number
  "authCode": "string"   // Authorization code
}
```

**Response**: User registration confirmation

---

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body**:
```json
{
  "nid": "string",        // National ID (required)
  "password": "string"    // Password (required)
}
```

**Headers** (Optional):
- `Authorization: Bearer <old_token>` - Include old token for token migration

**Response**:
```json
{
  "nid": "string",
  "name": "string",
  "email": "string",
  "token": "string",      // JWT Bearer token
  "salt": "string"
}
```

**Status Codes**:
- `200 OK`: Successful authentication
- `401 Unauthorized`: Invalid credentials

---

#### POST `/api/auth/refresh`
Refresh an existing JWT token.

**Request Body**:
```json
{
  "nid": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "salt": "string",
  "token": "string"      // Current token
}
```

**Response**: New JWT token or 401 if invalid

---

#### GET `/api/auth/Display`
Get user display information.

**Query Parameters**:
- `nid` (optional): National ID
- `name` (optional): User name

**Response**:
```json
{
  "nid": "string",
  "name": "string",
  "email": "string",
  // Additional profile fields
}
```

**Status Codes**:
- `200 OK`: User found
- `404 Not Found`: User not found

---

#### PUT `/api/auth/UpdateProf`
Update user profile information.

**Request Body**:
```json
{
  "nid": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "salt": "string",
  "token": "string"
}
```

**Response**: Updated user profile

---

#### PUT `/api/auth/UpdatePassword`
Update user password.

**Query Parameters**:
- `op`: Old password (required)
- `np`: New password (required)

**Request Body**: UserDTO object

**Response**: Password update confirmation

---

### 2. Medical Records (`/api/records/`)

#### GET `/api/records/all`
Retrieve all records for a user.

**Query Parameters**:
- `x`: User identifier (integer)

**Response**:
```json
[
  {
    "rid": 0,
    "title": "string",
    "description": "string",
    "type": "string",
    "assocNID": "string",
    "entryTime": "2024-01-01T00:00:00Z"
  }
]
```

**Status Codes**:
- `200 OK`: Records retrieved
- `404 Not Found`: No records found

---

#### GET `/api/records/{id}`
Get a specific medical record by ID.

**Path Parameters**:
- `id`: Record ID (integer)

**Response**: Single RecordDTO object or 404

---

#### POST `/api/records/add`
Add a new medical record.

**Request Body**:
```json
{
  "rid": 0,
  "title": "string",
  "description": "string",
  "type": "string",
  "assocNID": "string",        // Associated user NID (required)
  "entryTime": "2024-01-01T00:00:00Z"
}
```

**Response**:
```json
{
  "rid": 123,
  "title": "string",
  // ... other fields
}
```

**Status**: `201 Created` with `Location` header

---

#### POST `/api/records/scan`
Scan and add a document.

**Request Body**: Record object

**Response**:
```json
{
  "message": "added doc 123"
}
```

---

#### POST `/api/records/PortalMagic`
Import records from external portal.

**Query Parameters**:
- `porId`: Portal ID (integer)

**Request Body**: UserDTO

**Response**:
```json
{
  "message": "found 5 documents and added."
}
```

**Status Codes**:
- `200 OK`: Records imported
- `404 Not Found`: No records found

---

### 3. AI Assistant (`/api/assistant/`)

#### POST `/api/assistant/message`
Send a message to the AI assistant.

**Request Body**:
```json
{
  "sessId": "string",
  "message": "string",
  "timestamp": "2024-01-01T00:00:00Z",
  "author": "string",
  "imp": false
}
```

**Response**:
```json
{
  "reply": "AI generated response"
}
```

---

#### POST `/api/assistant/RecordAnalysis/{rid}`
Get AI analysis of a specific record.

**Path Parameters**:
- `rid`: Record ID (integer)

**Query Parameters**:
- `q`: Question/query string

**Request Body**: RecordDTO object

**Response**:
```json
{
  "reply": "Analysis of the record"
}
```

**Status Codes**:
- `200 OK`: Analysis generated
- `404 Not Found`: Record not found

---

#### POST `/api/assistatn/SummaryRecords/{rid}`
Get AI summary of records.

**Path Parameters**:
- `rid`: Record ID (integer)

**Request Body**: RecordDTO object

**Response**:
```json
{
  "reply": "Summary of records"
}
```

---

#### POST `/api/assistant/AIChat/{sessId}`
Chat with AI using session context.

**Path Parameters**:
- `sessId`: Session ID (string)

**Query Parameters**:
- `dt`: DateTime for context

**Response**:
```json
{
  "reply": "AI chat response"
}
```

---

#### POST `/api/assistant/Reccomendations/{nid}`
Get AI recommendations for a user.

**Path Parameters**:
- `nid`: National ID (string)

**Response**:
```json
{
  "reply": "Personalized recommendations"
}
```

---

### 4. Appointments (`/api/Appointment/`)

#### GET `/api/Appointment/Get`
Get all appointments for a user.

**Query Parameters**:
- `nid` (optional): National ID (defaults to "1001")

**Response**:
```json
{
  "reply": [
    {
      "appoId": 0,
      "nid": "string",
      "doctorName": "string",
      "date": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### GET `/api/Appointment/Get/{id}`
Get a specific appointment by ID.

**Path Parameters**:
- `id`: Appointment ID (integer)

**Response**: AppoDTO object or 404

---

#### POST `/api/Appointment/Book`
Book a new appointment.

**Request Body**:
```json
{
  "appoId": 0,
  "nid": "string",
  "doctorName": "string",
  "date": "2024-01-01T00:00:00Z"
}
```

**Response**: Created appointment object

**Status Codes**:
- `200 OK`: Appointment booked
- `404 Not Found`: Booking failed

---

#### POST `/api/Appointment/Update`
Reschedule an existing appointment.

**Query Parameters**:
- `id`: Appointment ID (integer)
- `newd`: New date/time

**Response**: Updated appointment or 404

---

#### DELETE `/api/Appointment/Cancel`
Cancel an appointment.

**Query Parameters**:
- `id`: Appointment ID (integer)

**Response**: Cancellation confirmation or 404

---

### 5. Chat (`/api/chat/`)

#### POST `/api/chat/add`
Save a chat message.

**Request Body**:
```json
{
  "sessId": "string",
  "message": "string",
  "timestamp": "2024-01-01T00:00:00Z",
  "author": "string",
  "imp": false
}
```

**Response**: Save confirmation

---

#### GET `/api/chat/get`
Retrieve chat messages.

**Query Parameters**:
- `ssid`: Session ID (string)
- `cnt`: Count of messages (integer, negative = all)

**Response**:
```json
{
  "message": "Got all"
}
```

---

#### DELETE `/api/chat/delete`
Delete a chat message.

**Query Parameters**:
- `ssid`: Session ID (string)
- `stamp`: Timestamp of message to delete

**Response**: Deletion confirmation

---

#### PUT `/api/chat/Star`
Mark a message as important.

**Query Parameters**:
- `ssid`: Session ID (string)
- `stamp`: Timestamp of message

**Response**: Update confirmation

---

### 6. System Logs (`/api/logs/`)

#### POST `/api/logs/add`
Add a system log entry.

**Request Body**:
```json
{
  "id": 0,
  "nid": "string",
  "title": "string",
  "description": "string",
  "type": 0,
  "created": "2024-01-01T00:00:00Z"
}
```

**Response**: Log creation confirmation

---

#### GET `/api/logs/fetch`
Fetch system logs.

**Query Parameters**:
- `n`: User NID (string)
- `c`: Count (integer, default: 0)
- `d`: Date filter (DateTime, optional)

**Response**:
```json
{
  "message": "Log found [log data]"
}
```

**Status Codes**:
- `200 OK`: Logs found
- `404 Not Found`: No logs found

---

### 7. Notifications (`/api/notif/`)

#### PUT `/api/notif/toggle`
Toggle notification subscription.

**Query Parameters**:
- `i`: User identifier (string)
- `d`: Subscription status (boolean)

**Response**: Subscription status update

---

#### GET `/api/notif/get`
Send a push notification.

**Query Parameters**:
- `i`: User identifier (string)
- `m`: Message content (string)

**Response**:
- `200 OK`: "notif sent."
- `404 Not Found`: "error"

---

## Data Models

### User
```csharp
{
  "nid": "string",          // Primary Key - National ID
  "name": "string",
  "email": "string",
  "password": "string",     // Hashed
  "salt": "string",         // For password hashing
  "age": 0,
  "notifSub": true,        // Notification subscription status
  "gender": "M/F",         // Single character
  "bloodType": "string"
}
```

### Record
```csharp
{
  "rid": 0,                 // Primary Key - Record ID
  "title": "string",
  "description": "string",
  "type": "string",         // e.g., "Lab", "Prescription", "Diagnosis"
  "assocNID": "string",     // Foreign Key to User
  "entryTime": "DateTime"
}
```

### Appointment
```csharp
{
  "appoId": 0,              // Primary Key
  "nid": "string",          // Foreign Key to User
  "doctorName": "string",
  "date": "DateTime"
}
```

### UserMsg (Chat Message)
```csharp
{
  "sessId": "string",       // Primary Key - Session ID
  "message": "string",
  "timestamp": "DateTime",
  "author": "string",       // "user" or "assistant"
  "imp": false              // Important/starred flag
}
```

### Notification
```csharp
{
  "id": 0,                  // Primary Key
  "nid": "string",          // Foreign Key to User
  "message": "string",
  "endpoint": "string",     // Push notification endpoint
  "type": 0,                // Notification type
  "timeStamp": "DateTime",
  "p256DH": "string",       // Push encryption key
  "auth": "string",         // Push auth secret
  "urgent": false
}
```

### LogEvent
```csharp
{
  "id": 0,                  // Primary Key
  "nid": "string",          // Foreign Key to User
  "title": "string",
  "description": "string",
  "type": 0,                // Log type enum
  "created": "DateTime"
}
```

---

## Error Handling

### Standard HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Response Format
Success responses vary by endpoint but typically include:
```json
{
  "reply": "data or message",
  "message": "status message"
}
```

Error responses:
```json
{
  "error": "error description"
}
```

---

## Configuration

### Connection String
The API requires a SQL Server database. Configure in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=SERVER_NAME;Database=VitaLifeDB;User Id=admin;Password=admin;TrustServerCertificate=True;"
  }
}
```

### External API Keys
```json
{
  "Groq": {
    "ApiKey": "your-api-key-here"
  }
}
```

### CORS Configuration
Currently configured to allow:
- **Origin**: `https://127.0.0.1:3000`
- **Methods**: All
- **Headers**: All

To change CORS settings, modify `Program.cs`:
```csharp
policy.WithOrigins("https://127.0.0.1:3000")
```

### Push Notifications (VAPID)
VAPID keys are configured in `Program.cs`:
- **Public Key**: `BDyESLNihWI7gTh2LKSxlVb1ojeDrtOBF3xBjwGdRZ6v0p0A8kHHuQ_-zTAyTZKMMxB4AEZrgA1RoPgIDQwOBBs`
- **Private Key**: `AkfJ-7cac9VM4B0avx6sBl22haQCe6wg5KmiPKQ_7LQ`

⚠️ **Security Note**: These keys should be moved to configuration files and not hardcoded in production.

---

## Development Setup

### Prerequisites
1. .NET 9.0 SDK
2. SQL Server (local or remote)
3. Visual Studio 2022 or VS Code

### Running the API
```bash
cd vitalife-api
dotnet restore
dotnet build
dotnet run
```

### API Documentation
When running in Development mode, Scalar API documentation is available at:
- `/scalar/v1` - Interactive API documentation
- `/openapi/v1.json` - OpenAPI specification

### Database Migrations
The API automatically runs migrations on startup. To manually manage migrations:
```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

---

## Important Notes for Frontend Developers

### 1. **NID (National ID) as Primary Key**
   - Users are identified by their National ID (`NID`), not an integer ID
   - Always use `NID` for user-related operations

### 2. **DateTime Handling**
   - All dates are in ISO 8601 format
   - The API handles DateTime with timezone information
   - Example: `"2024-01-01T00:00:00Z"`

### 3. **Authentication Flow**
   ```
   1. User signs up → POST /api/auth/signup
   2. User logs in → POST /api/auth/login (get token)
   3. Store token securely (localStorage/sessionStorage)
   4. Include in all requests: Authorization: Bearer <token>
   5. Refresh token when needed → POST /api/auth/refresh
   ```

### 4. **Session Management**
   - Chat and AI assistant features use session IDs (`sessId`)
   - Generate unique session IDs on the frontend
   - Maintain session context for continued conversations

### 5. **Error Handling**
   - Always check HTTP status codes
   - Parse error messages from response body
   - Handle 401 errors by redirecting to login

### 6. **API Endpoint Conventions**
   - Most endpoints return data in a wrapper object with `reply` or `message` property
   - Check the specific endpoint documentation for exact response format

### 7. **Record Types**
   Common record types include:
   - "Lab" - Laboratory results
   - "Prescription" - Medication prescriptions
   - "Diagnosis" - Medical diagnoses
   - "Scan" - Scanned documents
   - (Others as defined by business logic)

### 8. **Notification Subscription**
   - Users can toggle notification subscriptions
   - Push notifications use Web Push API standard
   - Frontend needs to implement service worker for push notifications

### 9. **AI Assistant Integration**
   - Multiple AI endpoints for different purposes
   - Session-based for context retention
   - Can analyze records and provide recommendations

### 10. **Retry Logic**
   - Database operations have built-in retry logic (5 retries, 10s delay)
   - Frontend should handle temporary failures gracefully

---

## Service Layer Overview

The API uses a service-based architecture with the following services:

1. **IUserService** - User authentication, registration, and profile management
2. **IRecordService** - Medical records CRUD operations
3. **IAssistantService** - AI assistant functionality
4. **IAppoService** - Appointment management
5. **IJwtService** - JWT token generation and refresh
6. **IChatService** - Chat message persistence
7. **ILogService** - System logging
8. **INotifService** - Push notification management

All services are registered as scoped dependencies in the DI container.

---

## Support & Contact

For API issues or questions:
- Check the Scalar documentation at `/scalar/v1` (in development mode)
- Review the OpenAPI spec at `/openapi/v1.json`
- Contact the backend development team

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**API Version**: .NET 9.0
