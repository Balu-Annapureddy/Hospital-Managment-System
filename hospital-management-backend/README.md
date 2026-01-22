# Hospital Management System - Backend

## Spring Boot REST API

Professional hospital management system backend built with Spring Boot 3.x, Spring Security, JWT authentication, and MySQL.

## Technology Stack

- **Java:** 17+
- **Framework:** Spring Boot 3.2.1
- **Security:** Spring Security + JWT
- **Database:** MySQL 8.x
- **ORM:** Spring Data JPA (Hibernate)
- **Build Tool:** Maven
- **Additional:** Lombok, Bean Validation

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control (ADMIN, DOCTOR, NURSE, BILLING)
- ✅ RESTful API design
- ✅ Global exception handling
- ✅ Input validation
- ✅ CORS configuration
- ✅ Audit fields (created_at, updated_at)

## Project Structure

```
src/main/java/com/hospital/management/
├── config/              # Configuration classes
│   └── SecurityConfig.java
├── controller/          # REST controllers
│   └── AuthController.java
├── dto/                 # Data Transfer Objects
│   ├── request/
│   └── response/
├── entity/              # JPA entities
│   ├── User.java
│   ├── Patient.java
│   ├── Appointment.java
│   ├── MedicalRecord.java
│   └── Bill.java
├── exception/           # Custom exceptions
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── DuplicateResourceException.java
├── repository/          # JPA repositories
├── security/            # Security components
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
├── service/             # Business logic
│   └── AuthService.java
└── HospitalManagementApplication.java
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup Instructions

### 1. Database Setup

Create MySQL database:
```sql
CREATE DATABASE hospital_management;
```

### 2. Configure Database

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_management
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build Project

```bash
mvn clean install
```

### 4. Run Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/register` | Register new user | Public |
| GET | `/auth/health` | Health check | Public |

### Example Requests

**Login:**
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

**Register:**
```json
POST /api/auth/register
{
  "username": "doctor1",
  "password": "password123",
  "fullName": "Dr. John Smith",
  "email": "john.smith@hospital.com",
  "phone": "1234567890",
  "role": "DOCTOR"
}
```

## User Roles

- **ADMIN:** Full system access
- **DOCTOR:** Patient records, appointments, medical records
- **NURSE:** Patient registration, appointment scheduling
- **BILLING:** Bill creation, payment processing

## Security

- JWT tokens expire after 24 hours (configurable)
- Passwords are encrypted using BCrypt
- Role-based endpoint protection
- CORS enabled for frontend integration

## Development

### Running Tests
```bash
mvn test
```

### Package for Production
```bash
mvn clean package
```

## Next Steps

- [ ] Implement remaining controllers (Patient, Appointment, Medical Records, Billing)
- [ ] Add service layer for business logic
- [ ] Create comprehensive test suite
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement logging
- [ ] Add database migration scripts

## License

This project is for educational purposes (BTech Final Year Project).

---

**Status:** Authentication module complete ✅  
**Last Updated:** January 22, 2026
