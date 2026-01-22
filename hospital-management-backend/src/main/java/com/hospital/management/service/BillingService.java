package com.hospital.management.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.management.dto.request.BillRequest;
import com.hospital.management.dto.request.PaymentRequest;
import com.hospital.management.dto.response.BillResponse;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Bill;
import com.hospital.management.entity.Bill.PaymentStatus;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.User;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.BillRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for billing and payment operations
 */
@Service
public class BillingService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Generate bill from appointment and treatments
     */
    @Transactional
    public BillResponse generateBill(BillRequest request) {
        // Validate patient exists
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", request.getPatientId()));

        // Validate appointment if provided
        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", request.getAppointmentId()));
            
            // Validate appointment belongs to patient
            if (!appointment.getPatient().getId().equals(request.getPatientId())) {
                throw new IllegalArgumentException("Appointment does not belong to the specified patient");
            }
        }

        // Calculate total amount from items
        BigDecimal totalAmount = request.getItems().stream()
                .map(BillRequest.BillItem::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Generate unique bill number
        String billNumber = generateBillNumber();

        // Get current user as creator
        User createdBy = getCurrentUser();

        // Convert items to JSON string
        String itemsJson = convertItemsToJson(request.getItems());

        // Create bill
        Bill bill = new Bill();
        bill.setBillNumber(billNumber);
        bill.setPatient(patient);
        bill.setAppointment(appointment);
        bill.setTotalAmount(totalAmount);
        bill.setPaidAmount(BigDecimal.ZERO);
        bill.setOutstandingAmount(totalAmount);
        bill.setPaymentStatus(PaymentStatus.PENDING);
        bill.setItems(itemsJson);
        bill.setBillDate(request.getBillDate());
        bill.setCreatedBy(createdBy);

        Bill savedBill = billRepository.save(bill);
        return mapToResponse(savedBill);
    }

    /**
     * Process payment for a bill
     */
    @Transactional
    public BillResponse processPayment(Long billId, PaymentRequest request) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", billId));

        // Validate payment amount doesn't exceed outstanding amount
        if (request.getAmount().compareTo(bill.getOutstandingAmount()) > 0) {
            throw new IllegalArgumentException("Payment amount cannot exceed outstanding amount");
        }

        // Update payment details
        BigDecimal newPaidAmount = bill.getPaidAmount().add(request.getAmount());
        bill.setPaidAmount(newPaidAmount);
        bill.setPaymentDate(request.getPaymentDate());

        // Update payment status
        bill.updatePaymentStatus();

        Bill updatedBill = billRepository.save(bill);
        return mapToResponse(updatedBill);
    }

    /**
     * Get bill by ID
     */
    @Transactional(readOnly = true)
    public BillResponse getBillById(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", billId));
        return mapToResponse(bill);
    }

    /**
     * Get bill by bill number
     */
    @Transactional(readOnly = true)
    public BillResponse getBillByBillNumber(String billNumber) {
        Bill bill = billRepository.findByBillNumber(billNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "billNumber", billNumber));
        return mapToResponse(bill);
    }

    /**
     * Get all bills with pagination
     */
    @Transactional(readOnly = true)
    public Page<BillResponse> getAllBills(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("billDate").descending());
        return billRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get bills by patient
     */
    @Transactional(readOnly = true)
    public Page<BillResponse> getBillsByPatient(Long patientId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("billDate").descending());
        return billRepository.findByPatientId(patientId, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get bills by payment status
     */
    @Transactional(readOnly = true)
    public Page<BillResponse> getBillsByPaymentStatus(PaymentStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("billDate").descending());
        return billRepository.findByPaymentStatus(status, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get all unpaid bills (PENDING or PARTIAL)
     */
    @Transactional(readOnly = true)
    public List<BillResponse> getUnpaidBills() {
        List<Bill> bills = billRepository.findPendingBills();
        return bills.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Calculate total revenue
     */
    @Transactional(readOnly = true)
    public BigDecimal calculateTotalRevenue() {
        return billRepository.calculateTotalRevenue();
    }

    /**
     * Calculate outstanding amount
     */
    @Transactional(readOnly = true)
    public BigDecimal calculateOutstandingAmount() {
        return billRepository.calculateOutstandingAmount();
    }

    /**
     * Generate unique bill number (B + 6-digit number)
     */
    private String generateBillNumber() {
        long count = billRepository.count();
        String billNumber;
        do {
            count++;
            billNumber = String.format("B%06d", count);
        } while (billRepository.findByBillNumber(billNumber).isPresent());
        
        return billNumber;
    }

    /**
     * Convert bill items to JSON string
     */
    private String convertItemsToJson(List<BillRequest.BillItem> items) {
        try {
            return objectMapper.writeValueAsString(items);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert items to JSON", e);
        }
    }

    /**
     * Parse JSON string to bill items
     */
    @SuppressWarnings("unchecked")
    private List<BillResponse.BillItem> parseItemsFromJson(String itemsJson) {
        try {
            List<BillRequest.BillItem> requestItems = objectMapper.readValue(
                    itemsJson, 
                    objectMapper.getTypeFactory().constructCollectionType(List.class, BillRequest.BillItem.class)
            );
            
            return requestItems.stream()
                    .map(item -> new BillResponse.BillItem(item.getDescription(), item.getAmount()))
                    .collect(Collectors.toList());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse items from JSON", e);
        }
    }

    /**
     * Map Bill entity to BillResponse DTO
     */
    private BillResponse mapToResponse(Bill bill) {
        BillResponse response = new BillResponse();
        response.setId(bill.getId());
        response.setBillNumber(bill.getBillNumber());
        
        // Patient info
        Patient patient = bill.getPatient();
        BillResponse.PatientInfo patientInfo = new BillResponse.PatientInfo(
                patient.getId(),
                patient.getPatientId(),
                patient.getFullName(),
                patient.getPhone()
        );
        response.setPatient(patientInfo);
        
        // Appointment info (optional)
        if (bill.getAppointment() != null) {
            Appointment appointment = bill.getAppointment();
            BillResponse.AppointmentInfo appointmentInfo = new BillResponse.AppointmentInfo(
                    appointment.getId(),
                    appointment.getAppointmentDate(),
                    appointment.getDoctor().getFullName()
            );
            response.setAppointment(appointmentInfo);
        }
        
        response.setTotalAmount(bill.getTotalAmount());
        response.setPaidAmount(bill.getPaidAmount());
        response.setOutstandingAmount(bill.getOutstandingAmount());
        response.setPaymentStatus(bill.getPaymentStatus().name());
        response.setItems(parseItemsFromJson(bill.getItems()));
        response.setBillDate(bill.getBillDate());
        response.setPaymentDate(bill.getPaymentDate());
        response.setCreatedByName(bill.getCreatedBy().getFullName());
        response.setCreatedAt(bill.getCreatedAt());
        response.setUpdatedAt(bill.getUpdatedAt());
        
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
