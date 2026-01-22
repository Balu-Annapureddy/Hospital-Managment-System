package com.hospital.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for doctor dashboard statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDashboardResponse {

    private long todayAppointments;
    private long upcomingAppointments;
    private long completedAppointments;
    private long totalPatientsTreated;
    private long medicalRecordsCreated;
}
