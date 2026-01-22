package com.hospital.management.service;

import com.hospital.management.dto.request.AppointmentRequest;
import com.hospital.management.dto.request.AppointmentStatusRequest;
import com.hospital.management.dto.response.AppointmentResponse;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Appointment.AppointmentStatus;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.User;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for appointment management operations
 */
@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Schedule new appointment
     */
    @Transactional
    public AppointmentResponse scheduleAppointment(AppointmentRequest request) {
        // Validate patient exists
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", request.getPatientId()));

        // Validate doctor exists and has DOCTOR role
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", request.getDoctorId()));
        
        if (doctor.getRole() != User.UserRole.DOCTOR) {
            throw new IllegalArgumentException("Selected user is not a doctor");
        }

        // Get current user as creator
        User createdBy = getCurrentUser();

        // Create appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointment.setCreatedBy(createdBy);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(savedAppointment);
    }

    /**
     * Update appointment status
     */
    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long appointmentId, AppointmentStatusRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        // Validate status transition
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot modify completed appointment");
        }
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new IllegalStateException("Cannot modify cancelled appointment");
        }

        appointment.setStatus(request.getStatus());
        if (request.getNotes() != null && !request.getNotes().isEmpty()) {
            appointment.setNotes(request.getNotes());
        }

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(updatedAppointment);
    }

    /**
     * Get appointment by ID
     */
    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));
        return mapToResponse(appointment);
    }

    /**
     * Get all appointments with pagination
     */
    @Transactional(readOnly = true)
    public Page<AppointmentResponse> getAllAppointments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());
        return appointmentRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get appointments by date
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        
        Pageable pageable = PageRequest.of(0, 1000, Sort.by("appointmentDate").ascending());
        Page<Appointment> appointments = appointmentRepository.findByDateRange(startOfDay, endOfDay, pageable);
        
        return appointments.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get today's appointments
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getTodaysAppointments() {
        List<Appointment> appointments = appointmentRepository.findTodaysAppointments();
        return appointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get appointments by doctor
     */
    @Transactional(readOnly = true)
    public Page<AppointmentResponse> getAppointmentsByDoctor(Long doctorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());
        return appointmentRepository.findByDoctorId(doctorId, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get today's appointments for a specific doctor
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getTodaysAppointmentsByDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findTodaysAppointmentsByDoctor(doctorId);
        return appointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get appointments by patient
     */
    @Transactional(readOnly = true)
    public Page<AppointmentResponse> getAppointmentsByPatient(Long patientId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());
        return appointmentRepository.findByPatientId(patientId, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get appointments by status
     */
    @Transactional(readOnly = true)
    public Page<AppointmentResponse> getAppointmentsByStatus(AppointmentStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());
        return appointmentRepository.findByStatus(status, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Map Appointment entity to AppointmentResponse DTO
     */
    private AppointmentResponse mapToResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        
        // Patient info
        Patient patient = appointment.getPatient();
        AppointmentResponse.PatientInfo patientInfo = new AppointmentResponse.PatientInfo(
                patient.getId(),
                patient.getPatientId(),
                patient.getFullName(),
                patient.getPhone(),
                calculateAge(patient.getDateOfBirth())
        );
        response.setPatient(patientInfo);
        
        // Doctor info
        User doctor = appointment.getDoctor();
        AppointmentResponse.DoctorInfo doctorInfo = new AppointmentResponse.DoctorInfo(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getEmail(),
                doctor.getPhone()
        );
        response.setDoctor(doctorInfo);
        
        response.setAppointmentDate(appointment.getAppointmentDate());
        response.setStatus(appointment.getStatus().name());
        response.setReason(appointment.getReason());
        response.setNotes(appointment.getNotes());
        response.setCreatedByName(appointment.getCreatedBy().getFullName());
        response.setCreatedAt(appointment.getCreatedAt());
        response.setUpdatedAt(appointment.getUpdatedAt());
        
        return response;
    }

    /**
     * Get current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    /**
     * Calculate age from date of birth
     */
    private Integer calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return null;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }
}
