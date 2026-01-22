package com.hospital.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Bill entity representing patient bills and payments
 */
@Entity
@Table(name = "bills", indexes = {
    @Index(name = "idx_bill_number", columnList = "bill_number"),
    @Index(name = "idx_patient", columnList = "patient_id"),
    @Index(name = "idx_payment_status", columnList = "payment_status")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_number", nullable = false, unique = true, length = 20)
    private String billNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 10, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "outstanding_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal outstandingAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(columnDefinition = "JSON")
    private String items;

    @Column(name = "bill_date", nullable = false)
    private LocalDateTime billDate;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Payment status enum
     */
    public enum PaymentStatus {
        PAID,
        PENDING,
        PARTIAL
    }

    /**
     * Update payment status based on amounts
     */
    public void updatePaymentStatus() {
        if (paidAmount.compareTo(totalAmount) >= 0) {
            this.paymentStatus = PaymentStatus.PAID;
            this.outstandingAmount = BigDecimal.ZERO;
        } else if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {
            this.paymentStatus = PaymentStatus.PARTIAL;
            this.outstandingAmount = totalAmount.subtract(paidAmount);
        } else {
            this.paymentStatus = PaymentStatus.PENDING;
            this.outstandingAmount = totalAmount;
        }
    }
}
