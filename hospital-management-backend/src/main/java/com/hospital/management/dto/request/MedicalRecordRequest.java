package com.hospital.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for creating medical record request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private Long appointmentId; // Optional - can create record without appointment

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotBlank(message = "Diagnosis is required")
    @Size(max = 2000, message = "Diagnosis must not exceed 2000 characters")
    private String diagnosis;

    @Size(max = 2000, message = "Prescription must not exceed 2000 characters")
    private String prescription;

    @Size(max = 2000, message = "Treatment notes must not exceed 2000 characters")
    private String treatmentNotes;

    @Size(max = 2000, message = "Lab results must not exceed 2000 characters")
    private String labResults;

    @NotNull(message = "Visit date is required")
    private LocalDateTime visitDate;
}
