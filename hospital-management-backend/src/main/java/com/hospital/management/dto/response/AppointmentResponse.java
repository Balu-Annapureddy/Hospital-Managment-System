package com.hospital.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for appointment response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {

    private Long id;
    private PatientInfo patient;
    private DoctorInfo doctor;
    private LocalDateTime appointmentDate;
    private String status;
    private String reason;
    private String notes;
    private String createdByName;
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
        private String phone;
        private Integer age;
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
        private String phone;
    }
}
