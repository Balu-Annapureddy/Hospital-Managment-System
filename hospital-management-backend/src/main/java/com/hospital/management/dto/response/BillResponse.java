package com.hospital.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for bill response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillResponse {

    private Long id;
    private String billNumber;
    private PatientInfo patient;
    private AppointmentInfo appointment;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal outstandingAmount;
    private String paymentStatus;
    private List<BillItem> items;
    private LocalDateTime billDate;
    private LocalDateTime paymentDate;
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
        private String doctorName;
    }

    /**
     * Nested DTO for bill items
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillItem {
        private String description;
        private BigDecimal amount;
    }
}
