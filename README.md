# DevPulse API

Internal Tech Issue & Feature Tracker API built with Node.js, TypeScript, Express.js and PostgreSQL.

## Features

- User signup and login
- JWT based authentication
- Contributor and maintainer role authorization
- Create and view issues
- Maintainer can update, delete and change issue status
- Contributor can update own open issues only
- Maintainer metrics route
- Raw SQL with native `pg` driver
- Modular Module-9 style project structure

## Technology Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- pg
- Raw SQL
- bcrypt
- jsonwebtoken

## Folder Structure

```txt

├── src
│   ├── app.ts
│   ├── server.ts
│   ├── config
│   │   └── index.ts
│   ├── db
│   │   └── index.ts
│   ├── middleware
│   │   ├── auth.ts
│   │   ├── globalErrorHandler.ts
│   │   ├── logger.ts
│   │   └── notFound.ts
│   ├── modules
│   │   ├── auth
│   │   ├── issues
│   │   └── metrics
│   ├── types
│   │   └── index.ts
│   └── utility
├── package.json
└── tsconfig.json
```


```



## API Endpoints

### Public

```txt
GET  /
GET  /health
GET  /api/issues
GET  /api/issues/:id
POST /api/auth/signup
POST /api/auth/login
```

### Protected

```txt
POST   /api/issues
PATCH  /api/issues/:id
PATCH  /api/issues/:id/status
DELETE /api/issues/:id
GET    /api/metrics
```

## Authorization Header

```txt
Authorization: <JWT_TOKEN>
```

## Signup Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "maintainer"
}
```

## Login Body

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

## Create Issue Body

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

## Database Schema Summary

### users

- id
- name
- email
- password
- role
- created_at
- updated_at

### issues

- id
- title
- description
- type
- status
- reporter_id
- created_at
- updated_at
