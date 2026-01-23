# Project Execution Guide

## 1. Prerequisites

Ensure the following are installed:

- **Java JDK 17**
  [Download from Adoptium](https://adoptium.net/)
  *Verify:* `java -version`

- **Apache Maven** (Optional, script handles this)
  [Download Maven](https://maven.apache.org/download.cgi)
  *Verify:* `mvn -version`

- **MySQL Server**
  [Download MySQL](https://dev.mysql.com/downloads/mysql/)
  *Verify:* `mysql --version`

- **Node.js (LTS)**
  [Download Node.js](https://nodejs.org/)
  *Verify:* `node -v`

## 2. Database Setup

1. Start your MySQL server.
2. Create the database:
   ```sql
   CREATE DATABASE hospital_management;
   ```
3. Update database credentials in the configuration file if yours are different from `root`/`root`:
   - File: `hospital-management-backend/src/main/resources/application.properties`
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

## 3. Starting the Application (Recommended)

We have created a **single startup script** that handles everything (Maven download, compilation, and starting the server).

**Open a terminal in the project root and run:**

```powershell
.\start_project.ps1
```

**This script will:**
1. ✅ check for Maven (and download it if missing).
2. ✅ compile the backend code automatically.
3. ✅ start the backend server on port 8080.

## 4. Manual Startup (Optional)

If you prefer to run things manually:

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

## 5. Accessing the App

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8080/api](http://localhost:8080/api)

**Default Login:**
- **Username:** `admin`
- **Password:** `admin123`

## 6. Troubleshooting

- **Port 8080 is in use:** Stop any other running Java processes or change `server.port` in `application.properties`.
- **Database Connection Error:** Check if MySQL is running and credentials in `application.properties` match your local setup.
- **Java version error:** Ensure `JAVA_HOME` is set to JDK 17. The `start_project.ps1` script attempts to auto-configure this for recognized paths.
