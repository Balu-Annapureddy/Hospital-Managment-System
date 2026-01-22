package com.hospital.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for admin dashboard statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalPatients;
    private long todayAppointments;
    private long scheduledAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
    private long pendingBills;
    private BigDecimal totalRevenue;
    private BigDecimal outstandingAmount;
    private long totalDoctors;
    private long totalNurses;
    private long totalBillingStaff;
}
