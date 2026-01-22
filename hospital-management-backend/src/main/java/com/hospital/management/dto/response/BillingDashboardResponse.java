package com.hospital.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for billing dashboard statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillingDashboardResponse {

    private long totalBills;
    private long paidBills;
    private long pendingBills;
    private long partialBills;
    private BigDecimal totalRevenue;
    private BigDecimal revenueToday;
    private BigDecimal revenueThisMonth;
    private BigDecimal outstandingAmount;
}
