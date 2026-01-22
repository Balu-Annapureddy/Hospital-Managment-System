package com.hospital.management.repository;

import com.hospital.management.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Patient entity
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    /**
     * Find patient by patient ID
     */
    Optional<Patient> findByPatientId(String patientId);

    /**
     * Check if patient ID exists
     */
    boolean existsByPatientId(String patientId);

    /**
     * Find patient by phone number
     */
    Optional<Patient> findByPhone(String phone);

    /**
     * Search patients by name, patient ID, or phone
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "p.patientId LIKE CONCAT('%', :search, '%') OR " +
           "p.phone LIKE CONCAT('%', :search, '%')")
    Page<Patient> searchPatients(@Param("search") String search, Pageable pageable);

    /**
     * Count total patients
     */
    @Query("SELECT COUNT(p) FROM Patient p")
    long countTotalPatients();
}
