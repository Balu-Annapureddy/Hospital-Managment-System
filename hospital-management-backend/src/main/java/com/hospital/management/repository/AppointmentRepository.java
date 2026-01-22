package com.hospital.management.repository;

import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Appointment.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Appointment entity
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /**
     * Find appointments by patient ID
     */
    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);

    /**
     * Find appointments by doctor ID
     */
    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);

    /**
     * Find appointments by status
     */
    Page<Appointment> findByStatus(AppointmentStatus status, Pageable pageable);

    /**
     * Find appointments by doctor and status
     */
    Page<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status, Pageable pageable);

    /**
     * Find appointments by date range
     */
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate")
    Page<Appointment> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                      @Param("endDate") LocalDateTime endDate, 
                                      Pageable pageable);

    /**
     * Find today's appointments
     */
    @Query("SELECT a FROM Appointment a WHERE DATE(a.appointmentDate) = CURRENT_DATE")
    List<Appointment> findTodaysAppointments();

    /**
     * Find today's appointments by doctor
     */
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND DATE(a.appointmentDate) = CURRENT_DATE")
    List<Appointment> findTodaysAppointmentsByDoctor(@Param("doctorId") Long doctorId);

    /**
     * Count appointments by status
     */
    long countByStatus(AppointmentStatus status);

    /**
     * Count today's appointments
     */
    @Query("SELECT COUNT(a) FROM Appointment a WHERE DATE(a.appointmentDate) = CURRENT_DATE")
    long countTodaysAppointments();

    /**
     * Count appointments by doctor
     */
    long countByDoctorId(Long doctorId);
}
