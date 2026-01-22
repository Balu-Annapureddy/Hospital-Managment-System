package com.hospital.management.controller;

import com.hospital.management.dto.request.MedicalRecordRequest;
import com.hospital.management.dto.response.MedicalRecordResponse;
import com.hospital.management.service.MedicalRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for medical record management
 */
@RestController
@RequestMapping("/medical-records")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    /**
     * Add medical record
     * POST /api/medical-records
     * Access: DOCTOR, ADMIN
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<MedicalRecordResponse> addMedicalRecord(@Valid @RequestBody MedicalRecordRequest request) {
        MedicalRecordResponse response = medicalRecordService.addMedicalRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update medical record
     * PUT /api/medical-records/{id}
     * Access: DOCTOR, ADMIN
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<MedicalRecordResponse> updateMedicalRecord(
            @PathVariable Long id,
            @Valid @RequestBody MedicalRecordRequest request) {
        MedicalRecordResponse response = medicalRecordService.updateMedicalRecord(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get medical record by ID
     * GET /api/medical-records/{id}
     * Access: DOCTOR, ADMIN
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<MedicalRecordResponse> getMedicalRecordById(@PathVariable Long id) {
        MedicalRecordResponse response = medicalRecordService.getMedicalRecordById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get patient medical history timeline
     * GET /api/medical-records/patient/{patientId}
     * Access: DOCTOR, ADMIN
     */
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<List<MedicalRecordResponse>> getPatientMedicalHistory(@PathVariable Long patientId) {
        List<MedicalRecordResponse> records = medicalRecordService.getPatientMedicalHistory(patientId);
        return ResponseEntity.ok(records);
    }

    /**
     * Get medical records by doctor
     * GET /api/medical-records/by-doctor/{doctorId}?page=0&size=10
     * Access: DOCTOR, ADMIN
     */
    @GetMapping("/by-doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<Page<MedicalRecordResponse>> getMedicalRecordsByDoctor(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByDoctor(doctorId, page, size);
        return ResponseEntity.ok(records);
    }

    /**
     * Get all medical records with pagination
     * GET /api/medical-records?page=0&size=10
     * Access: DOCTOR, ADMIN
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<Page<MedicalRecordResponse>> getAllMedicalRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<MedicalRecordResponse> records = medicalRecordService.getAllMedicalRecords(page, size);
        return ResponseEntity.ok(records);
    }
}
