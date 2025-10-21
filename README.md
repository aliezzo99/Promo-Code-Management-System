# Promo Code Management System

A multi-tenant Promo Code Management System with complete tenant data isolation, built with Spring Boot, Angular, PostgreSQL, and Keycloak.

## Features

- **Multi-tenant Architecture**: Schema-per-tenant approach with complete data isolation
- **Promo Code Management**: Create, update, delete, and manage promo codes
- **Role-based Access Control**: Admin (full access) and Business (read-only) roles
- **Reporting**: Filter and view promo code usage statistics
- **Secure Authentication**: Keycloak-based authentication and authorization

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.5+
- PostgreSQL (multi-schema)
- Keycloak (Authentication & Authorization)

### Frontend
- Angular (LTS)
- TypeScript

## Prerequisites

- Docker & Docker Compose
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Promo Code Management System"
```

### 2. Start All Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Keycloak (port 8080)
- Backend API (port 8081)
- Frontend (port 4200)

### 3. Configure Keycloak

1. Access Keycloak Admin Console: http://localhost:8080
2. Login with credentials:
   - Username: `admin`
   - Password: `admin`

3. Create a Realm:
   - Name: `promo-system`

4. Create Client:
   - Client ID: `promo-backend`
   - Client Protocol: `openid-connect`
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:8081/*`
   - Web Origins: `*`
   - Save and note the client secret from the Credentials tab

5. Create another Client for Frontend:
   - Client ID: `promo-frontend`
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:4200/*`
   - Web Origins: `*`

6. Create Roles:
   - Go to Realm Roles
   - Create role: `ADMIN`
   - Create role: `BUSINESS`

7. Create Users:
   - Create user with username `admin-user`
     - Set password in Credentials tab
     - Assign `ADMIN` role in Role Mappings
     - Add attribute: `tenant_id` = `tenant1`
   - Create user with username `business-user`
     - Set password in Credentials tab
     - Assign `BUSINESS` role in Role Mappings
     - Add attribute: `tenant_id` = `tenant1`

### 4. Update Backend Configuration

Edit `backend/src/main/resources/application.yml` and update the Keycloak client secret:

```yaml
keycloak:
  credentials:
    secret: <your-client-secret-from-step-4>
```

### 5. Restart Backend

```bash
docker-compose restart backend
```

### 6. Access the Application

- Frontend: http://localhost:4200
- Backend API: http://localhost:8081
- Keycloak: http://localhost:8080

## API Endpoints

### Promo Codes
- `POST /api/promo-codes` - Create promo code (Admin only)
- `GET /api/promo-codes` - List all promo codes
- `GET /api/promo-codes/{id}` - Get promo code by ID
- `PUT /api/promo-codes/{id}` - Update promo code (Admin only)
- `DELETE /api/promo-codes/{id}` - Delete promo code (Admin only)

### Reporting
- `GET /api/promo-codes/report` - Get promo codes with usage statistics
  - Query params: `status`, `code`, `startDate`, `endDate`

## Project Structure

```
.
├── backend/                 # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/               # Angular application
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Multi-Tenancy

The system uses a schema-per-tenant approach where:
- Each tenant has its own PostgreSQL schema
- Tenant identification is derived from the `tenant_id` attribute in Keycloak token
- Complete data isolation between tenants
- Schemas are created automatically on first access

## Roles & Permissions

- **ADMIN**: Full access - Create, Read, Update, Delete promo codes
- **BUSINESS**: Read-only access - View promo codes and reports

## Stopping the System

```bash
docker-compose down
```

To remove all data:

```bash
docker-compose down -v
```

## Development

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Troubleshooting

1. **Keycloak connection issues**: Ensure Keycloak is fully started before starting the backend
2. **Database connection issues**: Check PostgreSQL logs with `docker-compose logs postgres`
3. **Port conflicts**: Ensure ports 4200, 5432, 8080, 8081 are available

## License

MIT
