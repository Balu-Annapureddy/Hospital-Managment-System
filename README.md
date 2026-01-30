# Hospital Management System

A comprehensive full-stack hospital management application built with **Spring Boot** (backend) and **React** (frontend).

## 🚀 Features

- **User Authentication** - Role-based access control (Admin, Doctor, Nurse, Billing)
- **Patient Management** - Register, update, and view patient records
- **Appointment Scheduling** - Book and manage appointments with doctors
- **Medical Records** - Maintain patient medical history and records
- **Billing System** - Generate bills, track payments, and manage outstanding amounts
- **Dashboard Analytics** - Role-specific dashboards with key metrics

---

## 🔐 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Doctor** | `doctor1` | `password123` |
| **Nurse** | `nurse1` | `password123` |
| **Billing** | `billing1` | `password123` |

---

## 📊 Sample Data

The system comes pre-loaded with sample data for testing:

- **5 Patients** - Realistic patient records with medical history
- **6 Appointments** - Mix of scheduled, upcoming, and completed appointments
- **4 Bills** - Various payment statuses (Paid, Partial, Pending)

---

## 🛠️ Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **MySQL** database
- **Maven** build tool

### Frontend
- **React 18**
- **Vite** build tool
- **Material-UI (MUI)** component library
- **Axios** for API calls
- **React Router** for navigation

---

## 📋 Prerequisites

- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher (automatically downloaded by start script)

---

## ⚙️ Setup Instructions

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE hospital_management;
```

### 2. Backend Configuration

The backend is pre-configured with default settings in `hospital-management-backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_management
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.secret=your-secret-key-here-make-it-long-and-secure-for-production
jwt.expiration=86400000
```

**Note:** Update database credentials if your MySQL setup is different.

### 3. Start the Application

#### Option 1: Using the Start Script (Recommended)

```powershell
# From project root directory
.\start_project.ps1
```

This script will:
- Download Maven if not installed
- Compile the backend
- Start the Spring Boot server
- Automatically seed sample data on first run

#### Option 2: Manual Start

**Backend:**
```bash
cd hospital-management-backend
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
cd hospital-management-frontend
npm install
npm run dev
```

---

## 🌐 Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api

---

## 📁 Project Structure

```
HospitalManagmentSystem/
├── hospital-management-backend/
│   ├── src/main/java/com/hospital/management/
│   │   ├── config/          # Security, CORS, Data initialization
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data access layer
│   │   ├── security/        # JWT authentication
│   │   └── service/         # Business logic
│   └── src/main/resources/
│       └── application.properties
│
├── hospital-management-frontend/
│   ├── src/
│   │   ├── api/             # API service layer
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   └── utils/           # Utility functions
│   └── package.json
│
└── start_project.ps1        # Automated startup script
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/users/role/{role}` - Get users by role

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Register new patient
- `GET /api/patients/{id}` - Get patient by ID
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Schedule appointment
- `GET /api/appointments/{id}` - Get appointment by ID
- `PUT /api/appointments/{id}/status` - Update appointment status

### Bills
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create new bill
- `GET /api/bills/{id}` - Get bill by ID
- `PUT /api/bills/{id}/payment` - Update payment

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard stats
- `GET /api/dashboard/doctor` - Doctor dashboard stats

---

## 👥 User Roles & Permissions

### Admin
- Full system access
- User management
- View all statistics
- Manage all records

### Doctor
- View assigned appointments
- Access patient medical records
- Update appointment status
- View patient list

### Nurse
- View appointments
- Access patient records
- Update patient information

### Billing
- Manage bills and payments
- View billing statistics
- Generate invoices
- Track outstanding payments

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - BCrypt hashing for passwords
- **Role-Based Access Control** - Endpoint protection by user role
- **CORS Configuration** - Controlled cross-origin requests

---

## 🧪 Testing

1. **Login** with any of the default credentials
2. **Navigate** through different dashboards based on role
3. **Register** a new patient
4. **Schedule** an appointment
5. **Create** a bill and process payment

---

## 📝 Notes

- Sample data is automatically seeded on first startup
- Database schema is auto-created by Hibernate
- JWT tokens expire after 24 hours
- All timestamps are stored in UTC

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Developer

Created as a comprehensive hospital management solution demonstrating full-stack development with Spring Boot and React.
