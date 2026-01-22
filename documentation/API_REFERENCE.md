# Hospital Management System - API Quick Reference

**Base URL:** `http://localhost:8080/api`

---

## 🔐 Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response: {
  "token": "eyJhbGc...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "Admin User",
    "email": "admin@hospital.com",
    "role": "ADMIN"
  }
}
```

### Register User
```http
POST /auth/register
Content-Type: application/json
Authorization: Bearer {token}

{
  "username": "doctor1",
  "password": "password123",
  "fullName": "Dr. John Smith",
  "email": "john.smith@hospital.com",
  "phone": "1234567890",
  "role": "DOCTOR"
}
```

---

## 👥 Patient Management

### Register Patient
```http
POST /patients
Authorization: Bearer {token}
Roles: NURSE, ADMIN

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "phone": "9876543210",
  "email": "john.doe@example.com",
  "address": "123 Main St",
  "bloodGroup": "O+",
  "medicalHistory": "None",
  "allergies": "None",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "9876543211"
}
```

### Get Patient Profile
```http
GET /patients/{id}
Authorization: Bearer {token}
Roles: All authenticated
```

### Search Patients
```http
GET /patients/search?query=john&page=0&size=10
Authorization: Bearer {token}
Roles: All authenticated
```

---

## 📅 Appointment Management

### Schedule Appointment
```http
POST /appointments
Authorization: Bearer {token}
Roles: NURSE, DOCTOR, ADMIN

{
  "patientId": 1,
  "doctorId": 2,
  "appointmentDate": "2024-01-15T10:00:00",
  "reason": "Regular checkup",
  "notes": "Patient requested morning slot"
}
```

### Update Appointment Status
```http
PUT /appointments/{id}/status
Authorization: Bearer {token}
Roles: NURSE, DOCTOR, ADMIN

{
  "status": "COMPLETED",
  "notes": "Checkup completed successfully"
}
```

### Get Today's Appointments
```http
GET /appointments/today
Authorization: Bearer {token}
Roles: All authenticated
```

### Get Doctor's Appointments
```http
GET /appointments/by-doctor/{doctorId}?page=0&size=10
Authorization: Bearer {token}
Roles: All authenticated
```

---

## 📋 Medical Records

### Add Medical Record
```http
POST /medical-records
Authorization: Bearer {token}
Roles: DOCTOR, ADMIN

{
  "patientId": 1,
  "appointmentId": 5,
  "doctorId": 2,
  "diagnosis": "Common cold",
  "prescription": "Rest and fluids, Paracetamol 500mg",
  "treatmentNotes": "Follow up in 1 week if symptoms persist",
  "labResults": "Normal",
  "visitDate": "2024-01-15T10:30:00"
}
```

### Get Patient Medical History
```http
GET /medical-records/patient/{patientId}
Authorization: Bearer {token}
Roles: DOCTOR, ADMIN

Response: Timeline of all medical records, newest first
```

---

## 💰 Billing & Payments

### Generate Bill
```http
POST /bills
Authorization: Bearer {token}
Roles: BILLING, ADMIN

{
  "patientId": 1,
  "appointmentId": 5,
  "items": [
    {
      "description": "Consultation Fee",
      "amount": 500.00
    },
    {
      "description": "Lab Test - Blood Test",
      "amount": 300.00
    },
    {
      "description": "Medicines",
      "amount": 200.00
    }
  ],
  "billDate": "2024-01-15T11:00:00"
}
```

### Process Payment
```http
POST /bills/{id}/payment
Authorization: Bearer {token}
Roles: BILLING, ADMIN

{
  "amount": 500.00,
  "paymentDate": "2024-01-16T10:00:00"
}
```

### Get Unpaid Bills
```http
GET /bills/unpaid
Authorization: Bearer {token}
Roles: BILLING, ADMIN
```

### Get Revenue Statistics
```http
GET /bills/revenue/stats
Authorization: Bearer {token}
Roles: BILLING, ADMIN

Response: {
  "totalRevenue": 50000.00,
  "outstandingAmount": 15000.00
}
```

---

## 📊 Dashboards

### Admin Dashboard
```http
GET /dashboard/admin
Authorization: Bearer {token}
Roles: ADMIN

Response: {
  "totalPatients": 150,
  "todayAppointments": 12,
  "scheduledAppointments": 25,
  "completedAppointments": 300,
  "cancelledAppointments": 15,
  "pendingBills": 20,
  "totalRevenue": 50000.00,
  "outstandingAmount": 15000.00,
  "totalDoctors": 10,
  "totalNurses": 15,
  "totalBillingStaff": 5
}
```

### Doctor Dashboard
```http
GET /dashboard/doctor/me
Authorization: Bearer {token}
Roles: DOCTOR

Response: {
  "todayAppointments": 8,
  "upcomingAppointments": 15,
  "completedAppointments": 120,
  "totalPatientsTreated": 150,
  "medicalRecordsCreated": 120
}
```

### Billing Dashboard
```http
GET /dashboard/billing
Authorization: Bearer {token}
Roles: BILLING, ADMIN

Response: {
  "totalBills": 200,
  "paidBills": 150,
  "pendingBills": 30,
  "partialBills": 20,
  "totalRevenue": 50000.00,
  "revenueToday": 2000.00,
  "revenueThisMonth": 15000.00,
  "outstandingAmount": 10000.00
}
```

---

## 🔑 Common Query Parameters

### Pagination
```
?page=0&size=10
```

### Date Filtering
```
?date=2024-01-15
```

### Search
```
?query=john
```

---

## 📝 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 500 | Internal Server Error |

---

## 🎯 Enum Values

### User Roles
- `ADMIN`
- `DOCTOR`
- `NURSE`
- `BILLING`

### Gender
- `MALE`
- `FEMALE`
- `OTHER`

### Appointment Status
- `SCHEDULED`
- `COMPLETED`
- `CANCELLED`

### Payment Status
- `PAID`
- `PENDING`
- `PARTIAL`

---

## 🔧 Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Get Patients Example
```bash
curl -X GET http://localhost:8080/api/patients?page=0&size=10 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📦 Postman Collection

Import this into Postman for easy testing:

**Environment Variables:**
- `baseUrl`: `http://localhost:8080/api`
- `token`: (Set after login)

**Collections:**
1. Authentication
2. Patient Management
3. Appointment Management
4. Medical Records
5. Billing & Payments
6. Dashboards

---

**Last Updated:** January 22, 2026  
**API Version:** 1.0.0
