package com.hospital.management.service;

import com.hospital.management.dto.response.AdminDashboardResponse;
import com.hospital.management.dto.response.BillingDashboardResponse;
import com.hospital.management.dto.response.DoctorDashboardResponse;
import com.hospital.management.entity.Appointment.AppointmentStatus;
import com.hospital.management.entity.Bill.PaymentStatus;
import com.hospital.management.entity.User;
import com.hospital.management.entity.User.UserRole;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;

/**
 * Service for dashboard and reporting operations
 */
@Service
public class DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    /**
     * Get admin dashboard statistics
     */
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        AdminDashboardResponse response = new AdminDashboardResponse();

        // Patient statistics
        response.setTotalPatients(patientRepository.count());

        // Appointment statistics
        response.setTodayAppointments(appointmentRepository.countTodaysAppointments());
        response.setScheduledAppointments(appointmentRepository.countByStatus(AppointmentStatus.SCHEDULED));
        response.setCompletedAppointments(appointmentRepository.countByStatus(AppointmentStatus.COMPLETED));
        response.setCancelledAppointments(appointmentRepository.countByStatus(AppointmentStatus.CANCELLED));

        // Billing statistics
        response.setPendingBills(billRepository.countByPaymentStatus(PaymentStatus.PENDING) + 
                                 billRepository.countByPaymentStatus(PaymentStatus.PARTIAL));
        response.setTotalRevenue(billRepository.calculateTotalRevenue());
        response.setOutstandingAmount(billRepository.calculateOutstandingAmount());

        // User statistics
        response.setTotalDoctors(userRepository.findByRoleAndActiveTrue(UserRole.DOCTOR).size());
        response.setTotalNurses(userRepository.findByRoleAndActiveTrue(UserRole.NURSE).size());
        response.setTotalBillingStaff(userRepository.findByRoleAndActiveTrue(UserRole.BILLING).size());

        return response;
    }

    /**
     * Get doctor dashboard statistics
     */
    @Transactional(readOnly = true)
    public DoctorDashboardResponse getDoctorDashboard(Long doctorId) {
        // Verify doctor exists
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        if (doctor.getRole() != UserRole.DOCTOR) {
            throw new IllegalArgumentException("User is not a doctor");
        }

        DoctorDashboardResponse response = new DoctorDashboardResponse();

        // Today's appointments
        response.setTodayAppointments(appointmentRepository.findTodaysAppointmentsByDoctor(doctorId).size());

        // Upcoming appointments (scheduled status)
        long upcomingCount = appointmentRepository.findByDoctorIdAndStatus(
                doctorId, AppointmentStatus.SCHEDULED, 
                org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE)
        ).getTotalElements();
        response.setUpcomingAppointments(upcomingCount);

        // Completed appointments
        long completedCount = appointmentRepository.findByDoctorIdAndStatus(
                doctorId, AppointmentStatus.COMPLETED,
                org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE)
        ).getTotalElements();
        response.setCompletedAppointments(completedCount);

        // Total appointments (all time)
        response.setTotalPatientsTreated(appointmentRepository.countByDoctorId(doctorId));

        // Medical records created
        response.setMedicalRecordsCreated(medicalRecordRepository.countByDoctorId(doctorId));

        return response;
    }

    /**
     * Get current user's doctor dashboard
     */
    @Transactional(readOnly = true)
    public DoctorDashboardResponse getMyDoctorDashboard() {
        User currentUser = getCurrentUser();
        
        if (currentUser.getRole() != UserRole.DOCTOR) {
            throw new IllegalArgumentException("Current user is not a doctor");
        }

        return getDoctorDashboard(currentUser.getId());
    }

    /**
     * Get billing dashboard statistics
     */
    @Transactional(readOnly = true)
    public BillingDashboardResponse getBillingDashboard() {
        BillingDashboardResponse response = new BillingDashboardResponse();

        // Bill counts by status
        response.setTotalBills(billRepository.count());
        response.setPaidBills(billRepository.countByPaymentStatus(PaymentStatus.PAID));
        response.setPendingBills(billRepository.countByPaymentStatus(PaymentStatus.PENDING));
        response.setPartialBills(billRepository.countByPaymentStatus(PaymentStatus.PARTIAL));

        // Revenue statistics
        response.setTotalRevenue(billRepository.calculateTotalRevenue());
        response.setOutstandingAmount(billRepository.calculateOutstandingAmount());

        // Today's revenue
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        response.setRevenueToday(billRepository.calculateRevenueByDateRange(startOfDay, endOfDay));

        // This month's revenue
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = currentMonth.atEndOfMonth().atTime(LocalTime.MAX);
        response.setRevenueThisMonth(billRepository.calculateRevenueByDateRange(startOfMonth, endOfMonth));

        return response;
    }

    /**
     * Get current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }
}
