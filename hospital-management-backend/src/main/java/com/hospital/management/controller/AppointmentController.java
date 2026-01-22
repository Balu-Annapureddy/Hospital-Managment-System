package com.hospital.management.controller;

import com.hospital.management.dto.request.AppointmentRequest;
import com.hospital.management.dto.request.AppointmentStatusRequest;
import com.hospital.management.dto.response.AppointmentResponse;
import com.hospital.management.entity.Appointment.AppointmentStatus;
import com.hospital.management.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for appointment management
 */
@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    /**
     * Schedule new appointment
     * POST /api/appointments
     * Access: NURSE, DOCTOR, ADMIN
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('NURSE', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<AppointmentResponse> scheduleAppointment(@Valid @RequestBody AppointmentRequest request) {
        AppointmentResponse response = appointmentService.scheduleAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update appointment status
     * PUT /api/appointments/{id}/status
     * Access: NURSE, DOCTOR, ADMIN
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('NURSE', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusRequest request) {
        AppointmentResponse response = appointmentService.updateAppointmentStatus(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get appointment by ID
     * GET /api/appointments/{id}
     * Access: All authenticated users
     */
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable Long id) {
        AppointmentResponse response = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all appointments with pagination
     * GET /api/appointments?page=0&size=10
     * Access: All authenticated users
     */
    @GetMapping
    public ResponseEntity<Page<AppointmentResponse>> getAllAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AppointmentResponse> appointments = appointmentService.getAllAppointments(page, size);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get appointments by date
     * GET /api/appointments/by-date?date=2024-01-15
     * Access: All authenticated users
     */
    @GetMapping("/by-date")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDate(date);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get today's appointments
     * GET /api/appointments/today
     * Access: All authenticated users
     */
    @GetMapping("/today")
    public ResponseEntity<List<AppointmentResponse>> getTodaysAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getTodaysAppointments();
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get appointments by doctor
     * GET /api/appointments/by-doctor/{doctorId}?page=0&size=10
     * Access: All authenticated users
     */
    @GetMapping("/by-doctor/{doctorId}")
    public ResponseEntity<Page<AppointmentResponse>> getAppointmentsByDoctor(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AppointmentResponse> appointments = appointmentService.getAppointmentsByDoctor(doctorId, page, size);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get today's appointments for a specific doctor
     * GET /api/appointments/today/by-doctor/{doctorId}
     * Access: All authenticated users
     */
    @GetMapping("/today/by-doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getTodaysAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<AppointmentResponse> appointments = appointmentService.getTodaysAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get appointments by patient
     * GET /api/appointments/by-patient/{patientId}?page=0&size=10
     * Access: All authenticated users
     */
    @GetMapping("/by-patient/{patientId}")
    public ResponseEntity<Page<AppointmentResponse>> getAppointmentsByPatient(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AppointmentResponse> appointments = appointmentService.getAppointmentsByPatient(patientId, page, size);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get appointments by status
     * GET /api/appointments/by-status/{status}?page=0&size=10
     * Access: All authenticated users
     */
    @GetMapping("/by-status/{status}")
    public ResponseEntity<Page<AppointmentResponse>> getAppointmentsByStatus(
            @PathVariable AppointmentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AppointmentResponse> appointments = appointmentService.getAppointmentsByStatus(status, page, size);
        return ResponseEntity.ok(appointments);
    }
}
