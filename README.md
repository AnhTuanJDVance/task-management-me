# Task Management Backend

A backend system for task and project management with workspace-based authorization, real-time communication, file attachments, authentication, asynchronous processing, and supporting infrastructure.

The project is built with **Node.js, TypeScript, Express.js, PostgreSQL, TypeORM, Redis, RabbitMQ, and Socket.IO**.

---

## 🚀 Tech Stack

| Technology | Purpose                                      |
| ---------- | -------------------------------------------- |
| Node.js    | Backend runtime                              |
| TypeScript | Type-safe application development            |
| Express.js | REST API framework                           |
| PostgreSQL | Relational database                          |
| TypeORM    | ORM and database access                      |
| JWT        | Authentication and token-based authorization |
| Redis      | OTP and temporary authentication data        |
| RabbitMQ   | Asynchronous message processing              |
| Socket.IO  | Real-time communication                      |
| Zod        | Request validation                           |
| Multer     | File upload handling                         |
| Docker     | Containerized development environment        |

---

# ✨ Core Features

## Authentication & Authorization

The authentication system supports:

* User registration
* User login
* JWT access tokens
* JWT refresh tokens
* Refresh token rotation / management
* Logout
* Forgot password with OTP
* Password reset
* Authentication middleware
* Workspace-based authorization

### Authentication Flow

The REST API uses JWT-based authentication.

```text
Client
   │
   │ Login
   ▼
Auth Controller
   │
   ▼
Auth Service
   │
   ├── Validate credentials
   ├── Generate access token
   └── Generate refresh token
   │
   ▼
Client
```

Protected requests provide the access token through the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

The authentication middleware verifies the token and attaches the authenticated user to the request:

```text
HTTP Request
     │
     ▼
Auth Middleware
     │
     ├── Verify JWT
     ├── Extract user ID
     └── Attach req.user
     │
     ▼
Controller
```

Controllers therefore do not need to decode JWTs themselves.

---

## Password Reset

Forgot-password uses **Redis + OTP**.

```text
Client
  │
  │ Request password reset
  ▼
Auth Service
  │
  ├── Find user
  ├── Generate OTP
  ├── Store OTP in Redis
  └── Publish email job
          │
          ▼
      RabbitMQ
          │
          ▼
      Mail Worker
          │
          ▼
        Email
```

The OTP is stored with an expiration time in Redis.

When the user submits the OTP and a new password:

```text
Client
  │
  │ OTP + new password
  ▼
Auth Service
  │
  ├── Validate OTP
  ├── Hash new password
  ├── Update user
  └── Delete OTP from Redis
```

Deleting the OTP after successful use prevents the same OTP from being reused.

---

# 🏢 Workspace-Based Authorization

The system uses **Workspace** as the main authorization boundary.

The relationship is:

```text
Workspace
   │
   ├── Members
   │
   └── Projects
          │
          └── Tasks
```

A user must be a member of the corresponding workspace before accessing workspace-owned resources.

For example, when accessing a project:

```text
Request
  │
  ▼
Find Project
  │
  ▼
Get Project Workspace
  │
  ▼
Check Workspace Membership
  │
  ├── Not a member → 403
  │
  └── Member → Continue
```

This authorization model is reused across project, task, and attachment operations.

---

# 📁 Project Management

Projects belong to a workspace.

Supported operations include:

* Create project
* List projects by workspace
* Get project details
* Update project
* Delete project

Creating a project requires the authenticated user to be a member of the target workspace.

```text
User
 │
 │ Workspace membership
 ▼
Workspace
 │
 └── Project
```

Projects also serve as the parent resource for tasks and attachments.

---

# ✅ Task Management

Tasks belong to projects.

A task contains information such as:

* Title
* Description
* Status
* Priority
* Assignee
* Creator
* Start date
* Due date
* Estimated hours
* Position
* Labels
* Comments
* Attachments

The ownership hierarchy is:

```text
Workspace
    │
    └── Project
          │
          └── Task
```

This allows authorization to be resolved through the task's project and workspace.

---

# 📎 File Attachments

Files are associated with projects and optionally with tasks.

```text
Project
   │
   ├── Project-level Attachment
   │
   └── Task
        │
        └── Task-level Attachment
```

An attachment always belongs to a project.

A task association is optional.

When a task is provided during upload, the service verifies that:

```text
task.project.id === project.id
```

This prevents an attachment from being associated with a task belonging to another project.

### Upload Flow

```text
Client
  │
  │ multipart/form-data
  ▼
Multer
  │
  ├── Store file
  └── Extract file metadata
  │
  ▼
Attachment Service
  │
  ├── Validate project
  ├── Validate workspace membership
  ├── Validate task if provided
  └── Create attachment record
  │
  ▼
PostgreSQL
```

### Download Authorization

Files are not exposed as unrestricted public resources.

The download endpoint verifies:

1. The attachment exists.
2. Its project exists.
3. The authenticated user belongs to the project's workspace.
4. The physical file exists.

Only after authorization succeeds is the file returned to the client.

```text
GET /api/attachments/:id/download
```

This prevents users from downloading files simply by knowing an attachment ID.

---

# 💬 Real-Time Chat

Real-time communication is implemented using **Socket.IO**.

The system supports:

* Direct conversations
* Group conversations
* Joining conversation rooms
* Leaving conversation rooms
* Sending direct messages
* Sending group messages
* Retrieving group messages
* Real-time message broadcasting

---

## Socket Authentication

Socket connections are authenticated using the same JWT-based authentication system.

The client provides the access token during the Socket.IO handshake:

```javascript
const socket = io("http://localhost:3000", {
    auth: {
        token: accessToken
    }
});
```

The server verifies the token during the Socket.IO authentication middleware.

```text
Socket.IO Connection
        │
        │ handshake.auth.token
        ▼
Socket Authentication Middleware
        │
        ├── Verify JWT
        ├── Extract user ID
        └── socket.data.userId
```

After authentication, event handlers use:

```ts
socket.data.userId
```

instead of asking the client to send the user ID in every event.

This prevents the client from simply claiming to be another user.

---

## Direct Conversation

A direct conversation is created or retrieved using the authenticated user and the target receiver.

```text
User A
  │
  │ receiverId = User B
  ▼
Chat Service
  │
  ├── Find existing conversation
  └── Create conversation if necessary
  │
  ▼
Socket.IO Room
conversation:<id>
```

The socket then joins the corresponding conversation room:

```ts
socket.join(`conversation:${conversation.id}`);
```

The room is a Socket.IO concept and does not represent database membership by itself.

---

## Group Conversation

For group conversations, the client provides the conversation ID:

```json
{
    "conversationId": 10
}
```

The server then verifies:

1. The conversation exists.
2. The conversation is a group conversation.
3. The authenticated user has access to the conversation.

After authorization:

```ts
socket.join(`conversation:${conversation.id}`);
```

This separates **database-level membership** from **Socket.IO room membership**.

Joining a Socket.IO room does not create or modify database membership.

---

## Sending Messages

Once a socket has joined the appropriate room, messages are persisted and then broadcast to the room.

```text
Client
  │
  │ send-message
  ▼
Chat Gateway
  │
  ▼
Chat Service
  │
  ├── Validate conversation
  ├── Validate authorization
  └── Save message
  │
  ▼
Socket.IO Room
  │
  └── new-message
```

This keeps business logic inside the service layer while the gateway focuses on Socket.IO communication.

---

# 📨 RabbitMQ

RabbitMQ is used for asynchronous processing.

For example, password-reset emails are not sent directly inside the HTTP request.

Instead:

```text
Auth Service
    │
    │ publish
    ▼
RabbitMQ Queue
    │
    │ consume
    ▼
Mail Worker
    │
    ▼
SMTP
```

This separates the API request from email delivery.

The HTTP request only needs to publish the job, while the worker processes the email independently.

---

# 📦 Redis

Redis is used for temporary and short-lived data.

Current usage includes:

* Password reset OTP storage
* OTP expiration
* Temporary authentication-related data

Example:

```text
forgot-password:<email>
```

The OTP is stored with an expiration time, allowing Redis to automatically invalidate expired OTPs.

---

# 🏗️ Architecture

The backend follows a layered architecture:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

### Controller

Responsible for:

* Reading request data
* Calling services
* Returning HTTP responses
* Passing errors to the error middleware

Controllers do not contain business logic.

### Middleware

Responsible for cross-cutting concerns such as:

* Authentication
* Request validation
* Error handling

### Service

Contains business logic such as:

* Authorization checks
* Resource validation
* Relationship validation
* Authentication logic
* Business rules

### Repository

Responsible for database access through TypeORM.

### DTO

Defines the expected structure of request data.

### Entity

Represents database tables and relationships.

---

# 📂 Project Structure

```text
src/
├── common/
│   ├── enums/
│   ├── errors/
│   ├── rabbitmq/
│   ├── redis/
│   ├── templates/
│   ├── upload/
│   └── utils/
│
├── config/
├── database/
├── entities/
├── middlewares/
│
├── modules/
│   ├── Attachment/
│   ├── Auths/
│   ├── Chat/
│   ├── Projects/
│   └── Tasks/
│
└── socket/
```

---

# 🔒 Security

The backend implements several security mechanisms:

* Password hashing
* JWT access token authentication
* Refresh token mechanism
* Authentication middleware
* Socket.IO JWT authentication
* Workspace-level authorization
* OTP expiration
* Request validation with Zod
* Centralized error handling
* Helmet
* CORS configuration
* Authenticated file downloads

A key design principle is that **authorization is performed on the server rather than trusting identifiers supplied by the client**.

For example, clients provide a `projectId`, but the server determines the project's workspace and checks whether the authenticated user belongs to that workspace.

---

# ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=task_management

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

RABBITMQ_URL=amqp://localhost:5672

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

Never commit `.env` to the repository.

---

# ▶️ Installation

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Run the compiled application:

```bash
npm start
```

---

# 🐳 Docker

Docker configuration is included for running the backend and supporting services.

Start the environment:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

---

# 📡 API

Main REST API modules include:

```text
/api/auth
/api/projects
/api/tasks
/api/attachments
```

Real-time communication is provided through Socket.IO.

---

# 📌 Project Status

This is a backend-focused portfolio project designed to demonstrate practical backend development rather than a production deployment.

The project focuses on:

* REST API development
* Authentication and authorization
* Relational database design
* Entity relationships
* Layered backend architecture
* Redis-based temporary data
* RabbitMQ-based asynchronous processing
* Real-time communication
* File upload and protected download
* Docker-based development

The project is intentionally focused on demonstrating backend engineering fundamentals and practical system implementation.
