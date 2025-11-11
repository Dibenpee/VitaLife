# VitaLife API - Frontend Quick Reference

## Quick Start

**Base URL**: `https://localhost:5500`  
**Auth**: Bearer Token (JWT)  
**Content-Type**: `application/json`

---

## Authentication Flow

```javascript
// 1. Login
POST /api/auth/login
Body: { "nid": "1001", "password": "password" }
Response: { "token": "jwt-token-here", "nid": "1001", "name": "User Name" }

// 2. Store token
localStorage.setItem('token', response.token);

// 3. Use token in requests
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
}
```

---

## Endpoint Quick Reference

### 🔐 Auth & User
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login & get token | No |
| POST | `/api/auth/refresh` | Refresh token | Yes |
| GET | `/api/auth/Display?nid={nid}` | Get user profile | Yes |
| PUT | `/api/auth/UpdateProf` | Update profile | Yes |
| PUT | `/api/auth/UpdatePassword?op={old}&np={new}` | Change password | Yes |

### 📋 Medical Records
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/records/all?x={userId}` | Get all user records | Yes |
| GET | `/api/records/{id}` | Get single record | Yes |
| POST | `/api/records/add` | Add new record | Yes |
| POST | `/api/records/scan` | Scan document | Yes |
| POST | `/api/records/PortalMagic?porId={id}` | Import from portal | Yes |

### 🤖 AI Assistant
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/assistant/message` | Chat with AI | Yes |
| POST | `/api/assistant/RecordAnalysis/{rid}?q={question}` | Analyze record | Yes |
| POST | `/api/assistatn/SummaryRecords/{rid}` | Summarize records | Yes |
| POST | `/api/assistant/AIChat/{sessId}?dt={datetime}` | Session chat | Yes |
| POST | `/api/assistant/Reccomendations/{nid}` | Get recommendations | Yes |

### 📅 Appointments
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/Appointment/Get?nid={nid}` | List appointments | Yes |
| GET | `/api/Appointment/Get/{id}` | Get appointment | Yes |
| POST | `/api/Appointment/Book` | Book appointment | Yes |
| POST | `/api/Appointment/Update?id={id}&newd={date}` | Reschedule | Yes |
| DELETE | `/api/Appointment/Cancel?id={id}` | Cancel appointment | Yes |

### 💬 Chat
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/chat/add` | Save message | Yes |
| GET | `/api/chat/get?ssid={sessId}&cnt={count}` | Get messages | Yes |
| DELETE | `/api/chat/delete?ssid={sessId}&stamp={time}` | Delete message | Yes |
| PUT | `/api/chat/Star?ssid={sessId}&stamp={time}` | Star message | Yes |

### 📝 System Logs
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/logs/add` | Add log entry | Yes |
| GET | `/api/logs/fetch?n={nid}&c={count}&d={date}` | Get logs | Yes |

### 🔔 Notifications
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| PUT | `/api/notif/toggle?i={nid}&d={status}` | Toggle subscription | Yes |
| GET | `/api/notif/get?i={nid}&m={message}` | Send push notif | Yes |

---

## Common Request Bodies

### Login
```json
{
  "nid": "1001",
  "password": "password123"
}
```

### Signup
```json
{
  "nid": "1002",
  "email": "user@example.com",
  "password": "securepassword",
  "phone": 1234567890,
  "authCode": "ABC123"
}
```

### UserDTO (for updates)
```json
{
  "nid": "1001",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashedpassword",
  "salt": "salt123",
  "token": "current-jwt-token"
}
```

### Add Record
```json
{
  "rid": 0,
  "title": "Blood Test Results",
  "description": "Annual checkup blood work",
  "type": "Lab",
  "assocNID": "1001",
  "entryTime": "2024-01-15T10:30:00Z"
}
```

### Book Appointment
```json
{
  "appoId": 0,
  "nid": "1001",
  "doctorName": "Dr. Smith",
  "date": "2024-02-01T14:00:00Z"
}
```

### Chat Message
```json
{
  "sessId": "session-123",
  "message": "What are my test results?",
  "timestamp": "2024-01-15T10:30:00Z",
  "author": "user",
  "imp": false
}
```

### Log Entry
```json
{
  "id": 0,
  "nid": "1001",
  "title": "User Login",
  "description": "User logged in successfully",
  "type": 1,
  "created": "2024-01-15T10:30:00Z"
}
```

---

## Response Formats

### Success (varies by endpoint)
```json
{
  "reply": "data or array",
  "message": "Operation successful"
}
```

### Error
```json
{
  "error": "Error description"
}
```

### Created Resource
```
Status: 201 Created
Location: /api/records/123
Body: { created resource }
```

---

## Status Codes to Handle

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request data |
| 401 | Unauthorized | Redirect to login |
| 404 | Not Found | Show "not found" message |
| 500 | Server Error | Show error message, retry |

---

## JavaScript Examples

### Fetch with Auth
```javascript
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`https://localhost:5500${url}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (response.status === 401) {
    // Redirect to login
    window.location.href = '/login';
    return null;
  }
  
  return response.json();
}
```

### Login Example
```javascript
async function login(nid, password) {
  try {
    const response = await fetch('https://localhost:5500/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nid, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('nid', data.nid);
      return data;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

### Get Records Example
```javascript
async function getUserRecords(userId) {
  const data = await fetchWithAuth(`/api/records/all?x=${userId}`);
  return data; // Array of records or null
}
```

### Book Appointment Example
```javascript
async function bookAppointment(nid, doctorName, date) {
  const data = await fetchWithAuth('/api/Appointment/Book', {
    method: 'POST',
    body: JSON.stringify({
      appoId: 0,
      nid,
      doctorName,
      date: date.toISOString()
    })
  });
  return data;
}
```

### Chat with AI Example
```javascript
async function sendMessageToAI(message, sessionId) {
  const data = await fetchWithAuth('/api/assistant/message', {
    method: 'POST',
    body: JSON.stringify({
      sessId: sessionId,
      message: message,
      timestamp: new Date().toISOString(),
      author: 'user',
      imp: false
    })
  });
  return data?.reply; // AI response
}
```

---

## React/Axios Examples

### Axios Instance Setup
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5500',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for 401 handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Using the API Instance
```javascript
import api from './api';

// Login
const login = async (nid, password) => {
  const { data } = await api.post('/api/auth/login', { nid, password });
  localStorage.setItem('token', data.token);
  return data;
};

// Get records
const getRecords = async (userId) => {
  const { data } = await api.get(`/api/records/all?x=${userId}`);
  return data;
};

// Add record
const addRecord = async (record) => {
  const { data } = await api.post('/api/records/add', record);
  return data;
};
```

---

## Important Data Types

### User
- `nid`: string (Primary Key - National ID)
- `name`: string
- `email`: string
- `age`: number
- `gender`: 'M' | 'F'
- `bloodType`: string
- `notifSub`: boolean

### Record
- `rid`: number (Primary Key)
- `title`: string
- `description`: string
- `type`: string (e.g., "Lab", "Prescription")
- `assocNID`: string (User's NID)
- `entryTime`: ISO 8601 DateTime string

### Appointment
- `appoId`: number (Primary Key)
- `nid`: string (User's NID)
- `doctorName`: string
- `date`: ISO 8601 DateTime string

---

## Tips & Best Practices

1. **Always handle 401 errors** - Redirect to login when token expires
2. **Store NID with token** - You'll need it for many endpoints
3. **Use ISO 8601 for dates** - `new Date().toISOString()`
4. **Generate unique session IDs** - For chat features (e.g., UUID)
5. **Validate before submit** - Check required fields client-side
6. **Show loading states** - API calls may take time
7. **Parse error responses** - Check both status code and error message
8. **Use HTTPS only** - API requires secure connections
9. **Implement retry logic** - For network failures
10. **Cache user data** - Reduce API calls where appropriate

---

## Environment Variables (.env)

```env
REACT_APP_API_URL=https://localhost:5500
REACT_APP_VAPID_PUBLIC_KEY=BDyESLNihWI7gTh2LKSxlVb1ojeDrtOBF3xBjwGdRZ6v0p0A8kHHuQ_-zTAyTZKMMxB4AEZrgA1RoPgIDQwOBBs
```

---

## Testing the API

### Using cURL
```bash
# Login
curl -X POST https://localhost:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nid":"1001","password":"password"}'

# Get records (with token)
curl -X GET "https://localhost:5500/api/records/all?x=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import OpenAPI spec from `/openapi/v1.json`
2. Set up Bearer token in Authorization tab
3. Test endpoints interactively

### Using Scalar (Built-in)
- Navigate to `https://localhost:5500/scalar/v1` in development mode
- Interactive API documentation and testing interface

---

## Common Issues & Solutions

### CORS Error
- **Problem**: Frontend can't reach API
- **Solution**: Ensure frontend runs on `https://127.0.0.1:3000` or update CORS in `Program.cs`

### 401 Unauthorized
- **Problem**: Token expired or invalid
- **Solution**: Refresh token using `/api/auth/refresh` or re-login

### SSL Certificate Error
- **Problem**: Self-signed certificate not trusted
- **Solution**: Accept certificate in browser or configure proper SSL

### DateTime Format Error
- **Problem**: Date not accepted by API
- **Solution**: Use `new Date().toISOString()` for proper format

---

**Quick Reference Version**: 1.0  
**Last Updated**: 2024
