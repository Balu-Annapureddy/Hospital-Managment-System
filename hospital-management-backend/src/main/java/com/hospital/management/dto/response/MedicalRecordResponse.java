package com.hospital.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for medical record response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordResponse {

    private Long id;
    private PatientInfo patient;
    private DoctorInfo doctor;
    private AppointmentInfo appointment;
    private String diagnosis;
    private String prescription;
    private String treatmentNotes;
    private String labResults;
    private LocalDateTime visitDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Nested DTO for patient information
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatientInfo {
        private Long id;
        private String patientId;
        private String name;
        private Integer age;
        private String bloodGroup;
    }

    /**
     * Nested DTO for doctor information
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorInfo {
        private Long id;
        private String name;
        private String email;
    }

    /**
     * Nested DTO for appointment information (optional)
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentInfo {
        private Long id;
        private LocalDateTime appointmentDate;
        private String status;
    }
}
