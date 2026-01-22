package com.hospital.management.repository;

import com.hospital.management.entity.Bill;
import com.hospital.management.entity.Bill.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Bill entity
 */
@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    /**
     * Find bill by bill number
     */
    Optional<Bill> findByBillNumber(String billNumber);

    /**
     * Find bills by patient ID
     */
    Page<Bill> findByPatientId(Long patientId, Pageable pageable);

    /**
     * Find bills by payment status
     */
    Page<Bill> findByPaymentStatus(PaymentStatus paymentStatus, Pageable pageable);

    /**
     * Find bills by patient and payment status
     */
    Page<Bill> findByPatientIdAndPaymentStatus(Long patientId, PaymentStatus paymentStatus, Pageable pageable);

    /**
     * Find pending bills
     */
    @Query("SELECT b FROM Bill b WHERE b.paymentStatus IN ('PENDING', 'PARTIAL')")
    List<Bill> findPendingBills();

    /**
     * Count bills by payment status
     */
    long countByPaymentStatus(PaymentStatus paymentStatus);

    /**
     * Calculate total revenue
     */
    @Query("SELECT COALESCE(SUM(b.paidAmount), 0) FROM Bill b")
    BigDecimal calculateTotalRevenue();

    /**
     * Calculate outstanding amount
     */
    @Query("SELECT COALESCE(SUM(b.outstandingAmount), 0) FROM Bill b WHERE b.paymentStatus IN ('PENDING', 'PARTIAL')")
    BigDecimal calculateOutstandingAmount();

    /**
     * Calculate revenue for date range
     */
    @Query("SELECT COALESCE(SUM(b.paidAmount), 0) FROM Bill b WHERE b.billDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateRevenueByDateRange(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);

    /**
     * Get daily revenue for a month
     */
    @Query("SELECT DATE(b.billDate) as date, COALESCE(SUM(b.paidAmount), 0) as amount " +
           "FROM Bill b WHERE YEAR(b.billDate) = :year AND MONTH(b.billDate) = :month " +
           "GROUP BY DATE(b.billDate) ORDER BY DATE(b.billDate)")
    List<Object[]> getDailyRevenueByMonth(@Param("year") int year, @Param("month") int month);
}
