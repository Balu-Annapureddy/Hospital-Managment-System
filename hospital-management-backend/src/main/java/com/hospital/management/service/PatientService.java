package com.hospital.management.service;

import com.hospital.management.dto.request.PatientRequest;
import com.hospital.management.dto.response.PatientResponse;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.MedicalRecord;
import com.hospital.management.entity.Patient;
import com.hospital.management.exception.DuplicateResourceException;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.MedicalRecordRepository;
import com.hospital.management.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for patient management operations
 */
@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    /**
     * Register new patient with auto-generated patient ID
     */
    @Transactional
    public PatientResponse registerPatient(PatientRequest request) {
        // Check if phone number already exists
        if (patientRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new DuplicateResourceException("Patient", "phone", request.getPhone());
        }

        // Generate unique patient ID
        String patientId = generatePatientId();

        // Create patient entity
        Patient patient = new Patient();
        patient.setPatientId(patientId);
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setEmail(request.getEmail());
        patient.setAddress(request.getAddress());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setMedicalHistory(request.getMedicalHistory());
        patient.setAllergies(request.getAllergies());
        patient.setEmergencyContact(request.getEmergencyContact());
        patient.setEmergencyPhone(request.getEmergencyPhone());

        Patient savedPatient = patientRepository.save(patient);
        return mapToBasicResponse(savedPatient);
    }

    /**
     * Update patient details
     */
    @Transactional
    public PatientResponse updatePatient(Long patientId, PatientRequest request) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        // Check if phone is being changed and if new phone already exists
        if (!patient.getPhone().equals(request.getPhone())) {
            if (patientRepository.findByPhone(request.getPhone()).isPresent()) {
                throw new DuplicateResourceException("Patient", "phone", request.getPhone());
            }
        }

        // Update fields
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setEmail(request.getEmail());
        patient.setAddress(request.getAddress());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setMedicalHistory(request.getMedicalHistory());
        patient.setAllergies(request.getAllergies());
        patient.setEmergencyContact(request.getEmergencyContact());
        patient.setEmergencyPhone(request.getEmergencyPhone());

        Patient updatedPatient = patientRepository.save(patient);
        return mapToBasicResponse(updatedPatient);
    }

    /**
     * Get patient profile with appointments and medical records
     */
    @Transactional(readOnly = true)
    public PatientResponse getPatientProfile(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        PatientResponse response = mapToBasicResponse(patient);

        // Get recent appointments (last 10)
        Pageable appointmentPageable = PageRequest.of(0, 10, Sort.by("appointmentDate").descending());
        Page<Appointment> appointments = appointmentRepository.findByPatientId(patientId, appointmentPageable);
        
        List<PatientResponse.AppointmentSummary> appointmentSummaries = appointments.getContent().stream()
                .map(apt -> new PatientResponse.AppointmentSummary(
                        apt.getId(),
                        apt.getAppointmentDate(),
                        apt.getDoctor().getFullName(),
                        apt.getStatus().name(),
                        apt.getReason()
                ))
                .collect(Collectors.toList());
        response.setRecentAppointments(appointmentSummaries);

        // Get medical records (all, ordered by date)
        List<MedicalRecord> medicalRecords = medicalRecordRepository.findByPatientIdOrderByVisitDateDesc(patientId);
        
        List<PatientResponse.MedicalRecordSummary> recordSummaries = medicalRecords.stream()
                .map(record -> new PatientResponse.MedicalRecordSummary(
                        record.getId(),
                        record.getVisitDate(),
                        record.getDoctor().getFullName(),
                        record.getDiagnosis(),
                        record.getPrescription()
                ))
                .collect(Collectors.toList());
        response.setMedicalRecords(recordSummaries);

        return response;
    }

    /**
     * Get patient by patient ID (e.g., P001)
     */
    @Transactional(readOnly = true)
    public PatientResponse getPatientByPatientId(String patientId) {
        Patient patient = patientRepository.findByPatientId(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "patientId", patientId));
        return mapToBasicResponse(patient);
    }

    /**
     * Get all patients with pagination
     */
    @Transactional(readOnly = true)
    public Page<PatientResponse> getAllPatients(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return patientRepository.findAll(pageable)
                .map(this::mapToBasicResponse);
    }

    /**
     * Search patients by name, patient ID, or phone
     */
    @Transactional(readOnly = true)
    public Page<PatientResponse> searchPatients(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return patientRepository.searchPatients(search, pageable)
                .map(this::mapToBasicResponse);
    }

    /**
     * Soft delete patient (mark as inactive - future enhancement)
     * For now, we'll just throw an exception to prevent deletion
     */
    @Transactional
    public void deletePatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));
        
        // Check if patient has appointments or medical records
        long appointmentCount = appointmentRepository.countByPatientId(patientId);
        long recordCount = medicalRecordRepository.countByPatientId(patientId);
        
        if (appointmentCount > 0 || recordCount > 0) {
            throw new IllegalStateException("Cannot delete patient with existing appointments or medical records");
        }
        
        // Soft delete: In a real system, add an 'active' field to Patient entity
        // For now, we'll actually delete if no dependencies
        patientRepository.delete(patient);
    }

    /**
     * Generate unique patient ID (P + 6-digit number)
     */
    private String generatePatientId() {
        long count = patientRepository.count();
        String patientId;
        do {
            count++;
            patientId = String.format("P%06d", count);
        } while (patientRepository.existsByPatientId(patientId));
        
        return patientId;
    }

    /**
     * Map Patient entity to basic PatientResponse DTO
     */
    private PatientResponse mapToBasicResponse(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.setId(patient.getId());
        response.setPatientId(patient.getPatientId());
        response.setFirstName(patient.getFirstName());
        response.setLastName(patient.getLastName());
        response.setFullName(patient.getFullName());
        response.setDateOfBirth(patient.getDateOfBirth());
        response.setAge(calculateAge(patient.getDateOfBirth()));
        response.setGender(patient.getGender());
        response.setPhone(patient.getPhone());
        response.setEmail(patient.getEmail());
        response.setAddress(patient.getAddress());
        response.setBloodGroup(patient.getBloodGroup());
        response.setMedicalHistory(patient.getMedicalHistory());
        response.setAllergies(patient.getAllergies());
        response.setEmergencyContact(patient.getEmergencyContact());
        response.setEmergencyPhone(patient.getEmergencyPhone());
        response.setCreatedAt(patient.getCreatedAt());
        response.setUpdatedAt(patient.getUpdatedAt());
        return response;
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
