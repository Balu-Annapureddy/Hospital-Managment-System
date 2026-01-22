package com.hospital.management.controller;

import com.hospital.management.dto.request.PatientRequest;
import com.hospital.management.dto.response.PatientResponse;
import com.hospital.management.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for patient management
 */
@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PatientController {

    @Autowired
    private PatientService patientService;

    /**
     * Register new patient
     * POST /api/patients
     * Access: NURSE, ADMIN
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN')")
    public ResponseEntity<PatientResponse> registerPatient(@Valid @RequestBody PatientRequest request) {
        PatientResponse response = patientService.registerPatient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update patient details
     * PUT /api/patients/{id}
     * Access: NURSE, ADMIN
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN')")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequest request) {
        PatientResponse response = patientService.updatePatient(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get patient profile with full details
     * GET /api/patients/{id}
     * Access: All authenticated users
     */
    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getPatientProfile(@PathVariable Long id) {
        PatientResponse response = patientService.getPatientProfile(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get patient by patient ID (e.g., P001)
     * GET /api/patients/by-patient-id/{patientId}
     * Access: All authenticated users
     */
    @GetMapping("/by-patient-id/{patientId}")
    public ResponseEntity<PatientResponse> getPatientByPatientId(@PathVariable String patientId) {
        PatientResponse response = patientService.getPatientByPatientId(patientId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all patients with pagination
     * GET /api/patients?page=0&size=10
     * Access: All authenticated users
     */
    @GetMapping
    public ResponseEntity<Page<PatientResponse>> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PatientResponse> patients = patientService.getAllPatients(page, size);
        return ResponseEntity.ok(patients);
    }

    /**
     * Search patients by name, patient ID, or phone
     * GET /api/patients/search?query=john&page=0&size=10
     * Access: All authenticated users
     */
    @GetMapping("/search")
    public ResponseEntity<Page<PatientResponse>> searchPatients(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PatientResponse> patients = patientService.searchPatients(query, page, size);
        return ResponseEntity.ok(patients);
    }

    /**
     * Delete patient (soft delete with validation)
     * DELETE /api/patients/{id}
     * Access: ADMIN only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Patient deleted successfully");
        response.put("patientId", id.toString());
        
        return ResponseEntity.ok(response);
    }
}
