# VitaLife API - Executive Summary

## What is VitaLife API?

VitaLife API is a comprehensive health management backend system built with .NET 9.0. It provides a complete RESTful API for managing user accounts, medical records, appointments, AI-powered health assistance, and real-time notifications.

---

## 📊 API Statistics

- **Total Endpoints**: 29
- **Feature Areas**: 7
- **Database Tables**: 6 main entities
- **Authentication**: JWT Bearer Token
- **Framework**: .NET 9.0 with Minimal APIs

---

## 🔑 Key Features

### 1. **Authentication & User Management** (6 endpoints)
Complete user lifecycle management with secure JWT authentication.
- User registration and login
- Token refresh mechanism
- Profile viewing and updates
- Password management

### 2. **Medical Records** (5 endpoints)
Comprehensive medical record management system.
- CRUD operations for health records
- Document scanning integration
- External portal data import
- Record categorization (Lab results, Prescriptions, Diagnoses)

### 3. **AI Health Assistant** (5 endpoints)
Intelligent health assistance powered by AI.
- Natural language health queries
- Medical record analysis
- Automated record summarization
- Personalized health recommendations
- Conversational AI with session context

### 4. **Appointment Management** (5 endpoints)
Full-featured appointment booking system.
- Book appointments with healthcare providers
- View appointment history
- Reschedule existing appointments
- Cancel appointments

### 5. **Chat System** (4 endpoints)
Persistent messaging for user-AI interactions.
- Save and retrieve chat messages
- Session-based conversation history
- Star/mark important messages
- Message deletion

### 6. **System Logs** (2 endpoints)
Activity tracking and audit trail.
- Log user actions and events
- Retrieve filtered logs by date and user
- System monitoring and debugging

### 7. **Push Notifications** (2 endpoints)
Web push notification support.
- Subscription management
- Targeted notification delivery
- VAPID-based secure push

---

## 🏗 Architecture

### Technology Stack
- **Backend**: ASP.NET Core 9.0 (Minimal APIs)
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **API Docs**: OpenAPI 3.0 with Scalar UI
- **Push**: Web Push with VAPID authentication

### Design Patterns
- **Minimal APIs**: Lightweight, fast endpoint definitions
- **Service Layer**: Business logic separation
- **Repository Pattern**: Data access abstraction via EF Core
- **Dependency Injection**: Constructor injection for all services

### Project Structure
```
vitalife-api/
├── DTOs/          # Data Transfer Objects
├── Models/        # Database Entities
├── Endpoints/     # API Route Definitions
├── Services/      # Business Logic
├── Interfaces/    # Service Contracts
├── Data/          # DbContext
└── Migrations/    # Database Migrations
```

---

## 📡 API Endpoints Overview

### Authentication (`/api/auth/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/signup` | Register new user |
| POST | `/login` | Authenticate & get token |
| POST | `/refresh` | Refresh JWT token |
| GET | `/Display` | Get user profile |
| PUT | `/UpdateProf` | Update profile |
| PUT | `/UpdatePassword` | Change password |

### Medical Records (`/api/records/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/all` | List user records |
| GET | `/{id}` | Get single record |
| POST | `/add` | Create new record |
| POST | `/scan` | Scan document |
| POST | `/PortalMagic` | Import from portal |

### AI Assistant (`/api/assistant/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/message` | General AI chat |
| POST | `/RecordAnalysis/{rid}` | Analyze record |
| POST | `/SummaryRecords/{rid}` | Summarize records |
| POST | `/AIChat/{sessId}` | Session-based chat |
| POST | `/Reccomendations/{nid}` | Get recommendations |

### Appointments (`/api/Appointment/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/Get` | List appointments |
| GET | `/Get/{id}` | Get appointment |
| POST | `/Book` | Book appointment |
| POST | `/Update` | Reschedule |
| DELETE | `/Cancel` | Cancel appointment |

### Chat (`/api/chat/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/add` | Save message |
| GET | `/get` | Retrieve messages |
| DELETE | `/delete` | Delete message |
| PUT | `/Star` | Mark important |

### System Logs (`/api/logs/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/add` | Log event |
| GET | `/fetch` | Get logs |

### Notifications (`/api/notif/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| PUT | `/toggle` | Subscribe/Unsubscribe |
| GET | `/get` | Send notification |

---

## 🔐 Security

### Authentication Flow
1. User calls `/api/auth/signup` to register
2. User calls `/api/auth/login` to authenticate
3. API returns JWT token
4. Frontend stores token securely
5. All subsequent requests include: `Authorization: Bearer <token>`
6. Token can be refreshed via `/api/auth/refresh`

### Security Features
- JWT Bearer Token authentication
- Password hashing with salt
- SQL Server with parameterized queries
- CORS configuration for frontend origin
- HTTPS enforcement
- Connection retry logic for resilience

---

## 💾 Data Models

### Core Entities

**User**
- NID (National ID) - Primary Key
- Profile information (name, email, age, gender, blood type)
- Notification subscription status

**Record**
- Medical records with categorization
- Associated with user via NID
- Timestamped entries

**Appointment**
- Scheduled healthcare appointments
- Links user with doctor
- Date/time management

**UserMsg**
- Chat messages
- Session-based grouping
- Importance flagging

**Notification**
- Push notification data
- Subscription endpoints
- VAPID credentials

**LogEvent**
- System activity logs
- User action tracking

---

## 🚀 Getting Started

### For Backend Developers

1. Install .NET 9.0 SDK
2. Configure SQL Server connection in `appsettings.json`
3. Run `dotnet restore` and `dotnet build`
4. Run `dotnet ef database update` (or it runs automatically)
5. Start with `dotnet run`
6. Access Scalar docs at `https://localhost:5500/scalar/v1`

### For Frontend Developers

1. Read **FRONTEND_QUICK_REFERENCE.md** for quick start
2. Review **API_DOCUMENTATION.md** for complete reference
3. Configure API base URL: `https://localhost:5500`
4. Implement authentication flow
5. Use provided JavaScript/React examples
6. Test with Scalar UI or Postman

---

## 📚 Documentation Files

### 1. README.md
Complete project documentation including:
- Technology stack details
- Installation and setup guide
- Project structure explanation
- Development guidelines
- Security best practices
- Roadmap and future enhancements

### 2. API_DOCUMENTATION.md
Comprehensive API reference with:
- All 29 endpoints with detailed descriptions
- Request/response examples for each endpoint
- Complete data model specifications
- Authentication and authorization guide
- Error handling and status codes
- Configuration requirements
- Environment setup instructions

### 3. FRONTEND_QUICK_REFERENCE.md
Quick reference for frontend developers:
- Endpoint quick reference tables
- Common request body templates
- JavaScript fetch examples
- React/Axios integration code
- Best practices and tips
- Common issues and solutions
- Testing methods

---

## 🎯 Use Cases

### For Healthcare Providers
- Manage patient records digitally
- Schedule and track appointments
- Access patient history quickly

### For Patients
- View personal health records
- Book and manage appointments
- Get AI-powered health insights
- Ask health-related questions to AI assistant
- Receive medication and appointment reminders

### For Developers
- Well-documented RESTful API
- Clean architecture and separation of concerns
- Easy integration with frontend applications
- Extensible design for future features

---

## 📈 Integration Example

### Basic Frontend Integration (React)

```javascript
// 1. Setup API client
const API_BASE = 'https://localhost:5500';

// 2. Login
const login = async (nid, password) => {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nid, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// 3. Fetch records with auth
const getRecords = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/api/records/all?x=${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// 4. Chat with AI
const askAI = async (message, sessionId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/api/assistant/message`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sessId: sessionId,
      message: message,
      timestamp: new Date().toISOString(),
      author: 'user',
      imp: false
    })
  });
  const data = await response.json();
  return data.reply;
};
```

---

## 🔄 API Versioning & Compatibility

- **Current Version**: 1.0
- **API Style**: RESTful with JSON
- **Backward Compatibility**: Maintained for stable endpoints
- **Deprecation**: Announced in advance with migration guide

---

## 🌐 CORS Configuration

Currently configured for:
- **Allowed Origin**: `https://127.0.0.1:3000`
- **Allowed Methods**: All (GET, POST, PUT, DELETE)
- **Allowed Headers**: All

To allow different origins, modify `Program.cs`.

---

## 📞 Support & Resources

### Documentation
- **README.md** - Full project documentation
- **API_DOCUMENTATION.md** - Complete API reference
- **FRONTEND_QUICK_REFERENCE.md** - Quick reference guide

### Interactive Tools
- **Scalar UI**: `https://localhost:5500/scalar/v1` (Development)
- **OpenAPI Spec**: `https://localhost:5500/openapi/v1.json`

### Testing
- Use Scalar UI for interactive testing
- Import OpenAPI spec into Postman
- Use provided cURL examples

---

## 🎓 Key Takeaways for Frontend Developers

1. **Authentication is JWT-based** - Get token from `/api/auth/login`, include in all requests
2. **NID is the user identifier** - Not an integer ID, it's a National ID string
3. **All dates use ISO 8601 format** - Use `new Date().toISOString()`
4. **Responses vary by endpoint** - Check documentation for exact format
5. **Handle 401 errors** - Redirect to login when token expires
6. **Session IDs for AI chat** - Generate unique IDs for conversation context
7. **CORS is configured** - Frontend must run on `https://127.0.0.1:3000` or update CORS
8. **Comprehensive error handling** - Check both status codes and error messages

---

## 🚦 Next Steps

### For Implementation
1. Review the FRONTEND_QUICK_REFERENCE.md
2. Set up your development environment
3. Test authentication flow with Scalar UI
4. Implement user login/signup in your UI
5. Build out feature-specific pages (records, appointments, etc.)
6. Integrate AI assistant for enhanced UX
7. Implement push notifications

### For Production
1. Configure proper SSL certificates
2. Set up production database
3. Move secrets to Azure Key Vault
4. Configure proper CORS for production domain
5. Enable logging and monitoring
6. Implement rate limiting
7. Set up CI/CD pipeline

---

**Document Version**: 1.0  
**API Version**: .NET 9.0  
**Last Updated**: 2024

---

*This executive summary provides a high-level overview. Refer to the detailed documentation files for complete information.*
