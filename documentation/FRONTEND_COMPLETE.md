# Hospital Management System - Frontend Complete

The React frontend (Phase 3) is now 100% complete and ready to use.

## 🚀 Quick Start

### 1. Prerequisite
Ensure the Spring Boot backend is running at `http://localhost:8080`.

### 2. Startup Instructions
Navigate to the frontend directory and start the development server:
```bash
cd hospital-management-frontend
npm run dev
```
By default, the app will be available at `http://localhost:5173`.

### 3. Login Credentials
| Role | Username | Password |
|------|----------|----------|
| ADMIN | admin | admin123 |
| DOCTOR | doctor1 | password123 |
| NURSE | nurse1 | password123 |
| BILLING | billing1 | password123 |

---

## 🏗 Key Components Built

- **AuthContext:** Manages JWT tokens and role-based state.
- **MainLayout:** Sidebar, Topbar, and responsive wrapper.
- **AdminDashboard:** Revenue charts and system stats.
- **PatientProfile:** Clinical timeline and medical summary.
- **DataTable:** Reusable paginated table with role actions.
- **ConfirmDialog:** Reusable confirmation UI for deletions/cancellations.

---

## 🎨 Design System

We adhered to strict "Hospital Grade" UI principles:
- **Calm Palette:** `#1976d2` (Primary Blue), `#2e7d32` (Secondary Green).
- **Typography:** Professional Roboto/Inter fonts.
- **Minimalism:** Zero visual noise, focused on data clarity.

---

**Next Phase Recommendation:** 
Perform end-to-end integration testing of clinical workflows (Register → Schedule → Record → Bill).
