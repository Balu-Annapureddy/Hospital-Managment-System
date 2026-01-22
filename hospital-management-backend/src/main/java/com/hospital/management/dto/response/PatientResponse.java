package com.hospital.management.dto.response;

import com.hospital.management.entity.Patient.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for patient response with full profile information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {

    private Long id;
    private String patientId;
    private String firstName;
    private String lastName;
    private String fullName;
    private LocalDate dateOfBirth;
    private Integer age;
    private Gender gender;
    private String phone;
    private String email;
    private String address;
    private String bloodGroup;
    private String medicalHistory;
    private String allergies;
    private String emergencyContact;
    private String emergencyPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Extended profile information
    private List<AppointmentSummary> recentAppointments;
    private List<MedicalRecordSummary> medicalRecords;

    /**
     * Nested DTO for appointment summary
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentSummary {
        private Long id;
        private LocalDateTime appointmentDate;
        private String doctorName;
        private String status;
        private String reason;
    }

    /**
     * Nested DTO for medical record summary
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicalRecordSummary {
        private Long id;
        private LocalDateTime visitDate;
        private String doctorName;
        private String diagnosis;
        private String prescription;
    }
}
