package com.hospital.management.repository;

import com.hospital.management.entity.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for MedicalRecord entity
 */
@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    /**
     * Find medical records by patient ID
     */
    List<MedicalRecord> findByPatientIdOrderByVisitDateDesc(Long patientId);

    /**
     * Find medical records by patient ID with pagination
     */
    Page<MedicalRecord> findByPatientId(Long patientId, Pageable pageable);

    /**
     * Find medical records by doctor ID
     */
    Page<MedicalRecord> findByDoctorId(Long doctorId, Pageable pageable);

    /**
     * Find medical record by appointment ID
     */
    List<MedicalRecord> findByAppointmentId(Long appointmentId);

    /**
     * Count medical records by patient
     */
    long countByPatientId(Long patientId);

    /**
     * Count medical records by doctor
     */
    long countByDoctorId(Long doctorId);
}
