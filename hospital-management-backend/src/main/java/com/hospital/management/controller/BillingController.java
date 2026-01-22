package com.hospital.management.controller;

import com.hospital.management.dto.request.BillRequest;
import com.hospital.management.dto.request.PaymentRequest;
import com.hospital.management.dto.response.BillResponse;
import com.hospital.management.entity.Bill.PaymentStatus;
import com.hospital.management.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for billing and payment management
 */
@RestController
@RequestMapping("/bills")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BillingController {

    @Autowired
    private BillingService billingService;

    /**
     * Generate new bill
     * POST /api/bills
     * Access: BILLING, ADMIN
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('BILLING', 'ADMIN')")
    public ResponseEntity<BillResponse> generateBill(@Valid @RequestBody BillRequest request) {
        BillResponse response = billingService.generateBill(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Process payment for a bill
     * POST /api/bills/{id}/payment
     * Access: BILLING, ADMIN
     */
    @PostMapping("/{id}/payment")
    @PreAuthorize("hasAnyRole('BILLING', 'ADMIN')")
    public ResponseEntity<BillResponse> processPayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request) {
        BillResponse response = billingService.processPayment(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get bill by ID
     * GET /api/bills/{id}
     * Access: BILLING, ADMIN
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('BILLING', 'ADMIN')")
    public ResponseEntity<BillResponse> getBillById(@PathVariable Long id) {
        BillResponse response = billingService.getBillById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get bill by bill number
     * GET /api/bills/by-bill-number/{billNumber}
     * Access: BILLING, ADMIN
     */
    @GetMapping("/by-bill-number/{billNumber}")
    @PreAuthorize("hasAnyRole('BILLING', 'ADMIN')")
    public ResponseEntity<BillResponse> getBillByBillNumber(@PathVariable String billNumber) {
        BillResponse response = billingService.getBillByBillNumber(billNumber);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all bills with pagination
     * GET /api/bills?page=0&size=10
     * Access: BILLING, ADMIN
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('BILLING', 'ADMIN')")
    public ResponseEntity<Page<BillResponse>> getAllBills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<BillResponse> bills = billingService.getAllBills(page, size);
        return ResponseEntity.ok(bills);
    }

    /**
     * Get bills by patient
     * GET /api/bills/by-patient/{patientId}?page=0&size=10
     * Access: BILLING, ADMIN
     */
    @GetMapping("/by-patient/{patientId}")
    @PreAuthorize("hasAnyRole('BILLING', 'ADMIN')")
    public ResponseEntity<Page<BillResponse>> getBillsByPatient(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<BillResponse> bills = billingService.getBillsByPatient(patientId, page, size);
        return ResponseEntity.ok(bills);
    }

    /**
     * Get bills by payment status
     * GET /api/bills/by-status/{status}?page=0&size=10
     * Access: BILLING, ADMIN
     */
    @GetMapping("/by-status/{status}")
    @PreAuthorize("hasAnyRole('BILLING', 'ADMIN')")
    public ResponseEntity<Page<BillResponse>> getBillsByPaymentStatus(
            @PathVariable PaymentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<BillResponse> bills = billingService.getBillsByPaymentStatus(status, page, size);
        return ResponseEntity.ok(bills);
    }

    /**
     * Get all unpaid bills
     * GET /api/bills/unpaid
     * Access: BILLING, ADMIN
     */
    @GetMapping("/unpaid")
    @PreAuthorize("hasAnyRole('BILLING', 'ADMIN')")
    public ResponseEntity<List<BillResponse>> getUnpaidBills() {
        List<BillResponse> bills = billingService.getUnpaidBills();
        return ResponseEntity.ok(bills);
    }

    /**
     * Get revenue statistics
     * GET /api/bills/revenue/stats
     * Access: BILLING, ADMIN
     */
    @GetMapping("/revenue/stats")
    @PreAuthorize("hasAnyRole('BILLING', 'ADMIN')")
    public ResponseEntity<Map<String, BigDecimal>> getRevenueStats() {
        Map<String, BigDecimal> stats = new HashMap<>();
        stats.put("totalRevenue", billingService.calculateTotalRevenue());
        stats.put("outstandingAmount", billingService.calculateOutstandingAmount());
        return ResponseEntity.ok(stats);
    }
}
