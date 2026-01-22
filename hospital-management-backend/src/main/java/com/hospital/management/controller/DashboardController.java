package com.hospital.management.controller;

import com.hospital.management.dto.response.AdminDashboardResponse;
import com.hospital.management.dto.response.BillingDashboardResponse;
import com.hospital.management.dto.response.DoctorDashboardResponse;
import com.hospital.management.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for dashboard and reporting
 */
@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Get admin dashboard statistics
     * GET /api/dashboard/admin
     * Access: ADMIN only
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        AdminDashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(response);
    }

    /**
     * Get doctor dashboard statistics by doctor ID
     * GET /api/dashboard/doctor/{doctorId}
     * Access: DOCTOR, ADMIN
     */
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<DoctorDashboardResponse> getDoctorDashboard(@PathVariable Long doctorId) {
        DoctorDashboardResponse response = dashboardService.getDoctorDashboard(doctorId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get current user's doctor dashboard
     * GET /api/dashboard/doctor/me
     * Access: DOCTOR only
     */
    @GetMapping("/doctor/me")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorDashboardResponse> getMyDoctorDashboard() {
        DoctorDashboardResponse response = dashboardService.getMyDoctorDashboard();
        return ResponseEntity.ok(response);
    }

    /**
     * Get billing dashboard statistics
     * GET /api/dashboard/billing
     * Access: BILLING, ADMIN
     */
    @GetMapping("/billing")
    @PreAuthorize("hasAnyRole('BILLING', 'ADMIN')")
    public ResponseEntity<BillingDashboardResponse> getBillingDashboard() {
        BillingDashboardResponse response = dashboardService.getBillingDashboard();
        return ResponseEntity.ok(response);
    }
}
