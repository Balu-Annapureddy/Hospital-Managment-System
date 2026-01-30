package com.hospital.management.dto.request;

import com.hospital.management.entity.Patient.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for patient registration and update requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+\\-\\s()]{10,20}$", message = "Phone number must be 10-20 characters")
    private String phone;

    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Pattern(regexp = "^(A|B|AB|O)[+-]?$|^$", message = "Blood group must be valid (e.g., A+, B-, O+, AB-) or empty")
    private String bloodGroup;

    @Size(max = 1000, message = "Medical history must not exceed 1000 characters")
    private String medicalHistory;

    @Size(max = 500, message = "Allergies must not exceed 500 characters")
    private String allergies;

    @Size(max = 100, message = "Emergency contact name must not exceed 100 characters")
    private String emergencyContact;

    @Pattern(regexp = "^[0-9+\\-\\s()]{10,20}$|^$", message = "Emergency phone must be 10-20 characters or empty")
    private String emergencyPhone;
}

