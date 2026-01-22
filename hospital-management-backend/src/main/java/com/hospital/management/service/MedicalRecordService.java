package com.hospital.management.service;

import com.hospital.management.dto.request.MedicalRecordRequest;
import com.hospital.management.dto.response.MedicalRecordResponse;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Appointment.AppointmentStatus;
import com.hospital.management.entity.MedicalRecord;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.User;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.MedicalRecordRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;
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
 * Service for medical record management operations
 */
@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    /**
     * Add medical record for a patient
     * Business rule: If linked to appointment, appointment must be COMPLETED
     */
    @Transactional
    public MedicalRecordResponse addMedicalRecord(MedicalRecordRequest request) {
        // Validate patient exists
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", request.getPatientId()));

        // Validate doctor exists and has DOCTOR role
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", request.getDoctorId()));
        
        if (doctor.getRole() != User.UserRole.DOCTOR) {
            throw new IllegalArgumentException("Selected user is not a doctor");
        }

        // Validate appointment if provided
        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", request.getAppointmentId()));
            
            // Business rule: Can only add medical record for COMPLETED appointments
            if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
                throw new IllegalStateException("Medical records can only be added for completed appointments");
            }

            // Validate appointment belongs to the patient
            if (!appointment.getPatient().getId().equals(request.getPatientId())) {
                throw new IllegalArgumentException("Appointment does not belong to the specified patient");
            }
        }

        // Create medical record
        MedicalRecord medicalRecord = new MedicalRecord();
        medicalRecord.setPatient(patient);
        medicalRecord.setDoctor(doctor);
        medicalRecord.setAppointment(appointment);
        medicalRecord.setDiagnosis(request.getDiagnosis());
        medicalRecord.setPrescription(request.getPrescription());
        medicalRecord.setTreatmentNotes(request.getTreatmentNotes());
        medicalRecord.setLabResults(request.getLabResults());
        medicalRecord.setVisitDate(request.getVisitDate());

        MedicalRecord savedRecord = medicalRecordRepository.save(medicalRecord);
        return mapToResponse(savedRecord);
    }

    /**
     * Get medical record by ID
     */
    @Transactional(readOnly = true)
    public MedicalRecordResponse getMedicalRecordById(Long recordId) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Record", "id", recordId));
        return mapToResponse(record);
    }

    /**
     * Get patient medical history as timeline (ordered by date, newest first)
     */
    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getPatientMedicalHistory(Long patientId) {
        // Verify patient exists
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient", "id", patientId);
        }

        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdOrderByVisitDateDesc(patientId);
        return records.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get medical records by doctor
     */
    @Transactional(readOnly = true)
    public Page<MedicalRecordResponse> getMedicalRecordsByDoctor(Long doctorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("visitDate").descending());
        return medicalRecordRepository.findByDoctorId(doctorId, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get all medical records with pagination
     */
    @Transactional(readOnly = true)
    public Page<MedicalRecordResponse> getAllMedicalRecords(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("visitDate").descending());
        return medicalRecordRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    /**
     * Update medical record
     */
    @Transactional
    public MedicalRecordResponse updateMedicalRecord(Long recordId, MedicalRecordRequest request) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Record", "id", recordId));

        // Update fields
        record.setDiagnosis(request.getDiagnosis());
        record.setPrescription(request.getPrescription());
        record.setTreatmentNotes(request.getTreatmentNotes());
        record.setLabResults(request.getLabResults());
        record.setVisitDate(request.getVisitDate());

        MedicalRecord updatedRecord = medicalRecordRepository.save(record);
        return mapToResponse(updatedRecord);
    }

    /**
     * Map MedicalRecord entity to MedicalRecordResponse DTO
     */
    private MedicalRecordResponse mapToResponse(MedicalRecord record) {
        MedicalRecordResponse response = new MedicalRecordResponse();
        response.setId(record.getId());
        
        // Patient info
        Patient patient = record.getPatient();
        MedicalRecordResponse.PatientInfo patientInfo = new MedicalRecordResponse.PatientInfo(
                patient.getId(),
                patient.getPatientId(),
                patient.getFullName(),
                calculateAge(patient.getDateOfBirth()),
                patient.getBloodGroup()
        );
        response.setPatient(patientInfo);
        
        // Doctor info
        User doctor = record.getDoctor();
        MedicalRecordResponse.DoctorInfo doctorInfo = new MedicalRecordResponse.DoctorInfo(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getEmail()
        );
        response.setDoctor(doctorInfo);
        
        // Appointment info (optional)
        if (record.getAppointment() != null) {
            Appointment appointment = record.getAppointment();
            MedicalRecordResponse.AppointmentInfo appointmentInfo = new MedicalRecordResponse.AppointmentInfo(
                    appointment.getId(),
                    appointment.getAppointmentDate(),
                    appointment.getStatus().name()
            );
            response.setAppointment(appointmentInfo);
        }
        
        response.setDiagnosis(record.getDiagnosis());
        response.setPrescription(record.getPrescription());
        response.setTreatmentNotes(record.getTreatmentNotes());
        response.setLabResults(record.getLabResults());
        response.setVisitDate(record.getVisitDate());
        response.setCreatedAt(record.getCreatedAt());
        response.setUpdatedAt(record.getUpdatedAt());
        
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
