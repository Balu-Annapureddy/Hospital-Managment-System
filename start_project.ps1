# FIX_AND_RUN.ps1
# This script creates a portable Maven environment, compiles the backend, and runs it.

$ErrorActionPreference = "Stop"
$MavenVersion = "3.9.6"
$MavenUrl = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip"
$InstallDir = "$env:USERPROFILE\.gemini_maven"
$MavenHome = "$InstallDir\apache-maven-$MavenVersion"
$ProjectDir = "$PSScriptRoot\hospital-management-backend"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   HOSPITAL MANAGEMENT SYSTEM - SETUP   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check/Download Maven
if (-not (Test-Path "$MavenHome\bin\mvn.cmd")) {
    Write-Host "Downloading Maven $MavenVersion..." -ForegroundColor Yellow
    if (-not (Test-Path $InstallDir)) { New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null }
    
    $ZipPath = "$InstallDir\maven.zip"
    Invoke-WebRequest -Uri $MavenUrl -OutFile $ZipPath
    
    Write-Host "Extracting Maven..." -ForegroundColor Yellow
    Expand-Archive -Path $ZipPath -DestinationPath $InstallDir -Force
    Remove-Item $ZipPath
    Write-Host "Maven installed successfully." -ForegroundColor Green
} else {
    Write-Host "Maven is already installed." -ForegroundColor Green
}

# 2. Compile Backend
Write-Host "`nCompiling Backend Project (this may take 1-2 minutes)..." -ForegroundColor Yellow
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
$env:PATH = "$MavenHome\bin;$env:JAVA_HOME\bin;$env:PATH"
Set-Location $ProjectDir

try {
    cmd /c "mvn clean install -DskipTests > build_log.txt 2>&1"
    if ($LASTEXITCODE -ne 0) { 
        Get-Content build_log.txt | Select-Object -Last 50
        throw "Compilation failed. See build_log.txt for details." 
    }
    Write-Host "Backend compiled successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error compiling project: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

# 3. Run Backend
Write-Host "`nStarting Backend Server..." -ForegroundColor Cyan
Write-Host "Once started, you can login at http://localhost:5173" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host "------------------------------------------" -ForegroundColor Gray

cmd /c "mvn spring-boot:run"
