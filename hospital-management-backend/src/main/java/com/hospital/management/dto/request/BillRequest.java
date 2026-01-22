package com.hospital.management.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for bill creation request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private Long appointmentId; // Optional

    @NotNull(message = "Bill items are required")
    @Size(min = 1, message = "At least one bill item is required")
    private List<BillItem> items;

    @NotNull(message = "Bill date is required")
    private LocalDateTime billDate;

    /**
     * Nested class for bill items
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillItem {
        
        @NotNull(message = "Item description is required")
        @Size(max = 200, message = "Description must not exceed 200 characters")
        private String description;

        @NotNull(message = "Item amount is required")
        @Positive(message = "Amount must be positive")
        private BigDecimal amount;
    }
}
