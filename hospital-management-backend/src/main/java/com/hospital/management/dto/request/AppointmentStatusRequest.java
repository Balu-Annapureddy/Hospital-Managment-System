package com.hospital.management.dto.request;

import com.hospital.management.entity.Appointment.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating appointment status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentStatusRequest {

    @NotNull(message = "Status is required")
    private AppointmentStatus status;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
