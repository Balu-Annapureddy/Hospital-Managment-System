package com.hospital.management.config;

import com.hospital.management.entity.*;
import com.hospital.management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data initializer to seed default users and sample data on first startup
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if users already exist
        if (userRepository.count() > 0) {
            System.out.println("✅ Database already initialized. Skipping seed data.");
            return;
        }

        System.out.println("🔄 Initializing database with seed data...");

        // Create Users
        User admin = createAdmin();
        User doctor1 = createDoctor();
        User nurse1 = createNurse();
        User billing1 = createBilling();

        // Create Sample Patients
        List<Patient> patients = createSamplePatients();

        // Create Sample Appointments
        createSampleAppointments(patients, doctor1);

        // Create Sample Bills
        createSampleBills(patients, admin);

        System.out.println("\n✅ Seed data initialized successfully!");
        System.out.println("\n📋 Default Login Credentials:");
        System.out.println("  Admin:   admin / admin123");
        System.out.println("  Doctor:  doctor1 / password123");
        System.out.println("  Nurse:   nurse1 / password123");
        System.out.println("  Billing: billing1 / password123");
        System.out.println("\n📊 Sample Data Created:");
        System.out.println("  Patients: " + patients.size());
        System.out.println("  Appointments: 6");
        System.out.println("  Bills: 4\n");
    }

    private User createAdmin() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("Admin User");
        admin.setEmail("admin@hospital.com");
        admin.setPhone("1234567890");
        admin.setRole(User.UserRole.ADMIN);
        admin.setActive(true);
        userRepository.save(admin);
        System.out.println("  ✓ Created admin user");
        return admin;
    }

    private User createDoctor() {
        User doctor1 = new User();
        doctor1.setUsername("doctor1");
        doctor1.setPassword(passwordEncoder.encode("password123"));
        doctor1.setFullName("Dr. John Smith");
        doctor1.setEmail("john.smith@hospital.com");
        doctor1.setPhone("1234567891");
        doctor1.setRole(User.UserRole.DOCTOR);
        doctor1.setActive(true);
        userRepository.save(doctor1);
        System.out.println("  ✓ Created doctor user");
        return doctor1;
    }

    private User createNurse() {
        User nurse1 = new User();
        nurse1.setUsername("nurse1");
        nurse1.setPassword(passwordEncoder.encode("password123"));
        nurse1.setFullName("Nurse Mary Johnson");
        nurse1.setEmail("mary.johnson@hospital.com");
        nurse1.setPhone("1234567892");
        nurse1.setRole(User.UserRole.NURSE);
        nurse1.setActive(true);
        userRepository.save(nurse1);
        System.out.println("  ✓ Created nurse user");
        return nurse1;
    }

    private User createBilling() {
        User billing1 = new User();
        billing1.setUsername("billing1");
        billing1.setPassword(passwordEncoder.encode("password123"));
        billing1.setFullName("Billing Staff - Sarah Williams");
        billing1.setEmail("sarah.williams@hospital.com");
        billing1.setPhone("1234567893");
        billing1.setRole(User.UserRole.BILLING);
        billing1.setActive(true);
        userRepository.save(billing1);
        System.out.println("  ✓ Created billing user");
        return billing1;
    }

    private List<Patient> createSamplePatients() {
        List<Patient> patients = new ArrayList<>();

        // Patient 1
        Patient p1 = new Patient();
        p1.setPatientId("P001");
        p1.setFirstName("Alice");
        p1.setLastName("Johnson");
        p1.setDateOfBirth(LocalDate.of(1990, 5, 15));
        p1.setGender(Patient.Gender.FEMALE);
        p1.setPhone("5551234567");
        p1.setEmail("alice.johnson@email.com");
        p1.setAddress("123 Main St, City, State 12345");
        p1.setBloodGroup("A+");
        p1.setMedicalHistory("Diabetes Type 2");
        p1.setAllergies("Penicillin");
        p1.setEmergencyContact("Bob Johnson");
        p1.setEmergencyPhone("5559876543");
        patients.add(patientRepository.save(p1));

        // Patient 2
        Patient p2 = new Patient();
        p2.setPatientId("P002");
        p2.setFirstName("Robert");
        p2.setLastName("Smith");
        p2.setDateOfBirth(LocalDate.of(1985, 8, 22));
        p2.setGender(Patient.Gender.MALE);
        p2.setPhone("5552345678");
        p2.setEmail("robert.smith@email.com");
        p2.setAddress("456 Oak Ave, City, State 12345");
        p2.setBloodGroup("O+");
        p2.setMedicalHistory("Hypertension");
        p2.setAllergies("None");
        p2.setEmergencyContact("Jane Smith");
        p2.setEmergencyPhone("5558765432");
        patients.add(patientRepository.save(p2));

        // Patient 3
        Patient p3 = new Patient();
        p3.setPatientId("P003");
        p3.setFirstName("Emily");
        p3.setLastName("Davis");
        p3.setDateOfBirth(LocalDate.of(1995, 3, 10));
        p3.setGender(Patient.Gender.FEMALE);
        p3.setPhone("5553456789");
        p3.setEmail("emily.davis@email.com");
        p3.setAddress("789 Pine Rd, City, State 12345");
        p3.setBloodGroup("B+");
        p3.setAllergies("Latex");
        p3.setEmergencyContact("Michael Davis");
        p3.setEmergencyPhone("5557654321");
        patients.add(patientRepository.save(p3));

        // Patient 4
        Patient p4 = new Patient();
        p4.setPatientId("P004");
        p4.setFirstName("Michael");
        p4.setLastName("Brown");
        p4.setDateOfBirth(LocalDate.of(1978, 11, 30));
        p4.setGender(Patient.Gender.MALE);
        p4.setPhone("5554567890");
        p4.setEmail("michael.brown@email.com");
        p4.setAddress("321 Elm St, City, State 12345");
        p4.setBloodGroup("AB+");
        p4.setMedicalHistory("Asthma");
        p4.setAllergies("Aspirin");
        p4.setEmergencyContact("Lisa Brown");
        p4.setEmergencyPhone("5556543210");
        patients.add(patientRepository.save(p4));

        // Patient 5
        Patient p5 = new Patient();
        p5.setPatientId("P005");
        p5.setFirstName("Sarah");
        p5.setLastName("Wilson");
        p5.setDateOfBirth(LocalDate.of(2000, 7, 18));
        p5.setGender(Patient.Gender.FEMALE);
        p5.setPhone("5555678901");
        p5.setEmail("sarah.wilson@email.com");
        p5.setAddress("654 Maple Dr, City, State 12345");
        p5.setBloodGroup("O-");
        p5.setEmergencyContact("Tom Wilson");
        p5.setEmergencyPhone("5555432109");
        patients.add(patientRepository.save(p5));

        System.out.println("  ✓ Created " + patients.size() + " sample patients");
        return patients;
    }

    private void createSampleAppointments(List<Patient> patients, User doctor) {
        LocalDateTime now = LocalDateTime.now();

        // Today's appointments
        createAppointment(patients.get(0), doctor, now.plusHours(2), "Regular checkup", Appointment.AppointmentStatus.SCHEDULED);
        createAppointment(patients.get(1), doctor, now.plusHours(4), "Follow-up consultation", Appointment.AppointmentStatus.SCHEDULED);
        
        // Upcoming appointments
        createAppointment(patients.get(2), doctor, now.plusDays(1).withHour(10).withMinute(0), "Blood pressure monitoring", Appointment.AppointmentStatus.SCHEDULED);
        createAppointment(patients.get(3), doctor, now.plusDays(2).withHour(14).withMinute(30), "Asthma review", Appointment.AppointmentStatus.SCHEDULED);
        
        // Past appointments
        createAppointment(patients.get(4), doctor, now.minusDays(1), "Annual physical exam", Appointment.AppointmentStatus.COMPLETED);
        createAppointment(patients.get(0), doctor, now.minusDays(7), "Diabetes management", Appointment.AppointmentStatus.COMPLETED);

        System.out.println("  ✓ Created 6 sample appointments");
    }

    private void createAppointment(Patient patient, User doctor, LocalDateTime dateTime, String reason, Appointment.AppointmentStatus status) {
        Appointment apt = new Appointment();
        apt.setPatient(patient);
        apt.setDoctor(doctor);
        apt.setAppointmentDate(dateTime);
        apt.setReason(reason);
        apt.setStatus(status);
        apt.setNotes("Sample appointment");
        appointmentRepository.save(apt);
    }

    private void createSampleBills(List<Patient> patients, User createdBy) {
        // Bill 1 - Paid
        createBill(patients.get(0), "B001", 150.00, 150.00, Bill.PaymentStatus.PAID, LocalDateTime.now().minusDays(5), createdBy);
        
        // Bill 2 - Partially Paid
        createBill(patients.get(1), "B002", 300.00, 150.00, Bill.PaymentStatus.PARTIAL, null, createdBy);
        
        // Bill 3 - Pending
        createBill(patients.get(2), "B003", 200.00, 0.00, Bill.PaymentStatus.PENDING, null, createdBy);
        
        // Bill 4 - Paid
        createBill(patients.get(3), "B004", 450.00, 450.00, Bill.PaymentStatus.PAID, LocalDateTime.now().minusDays(2), createdBy);

        System.out.println("  ✓ Created 4 sample bills");
    }

    private void createBill(Patient patient, String billNumber, double totalAmount, double paidAmount, Bill.PaymentStatus status, LocalDateTime paymentDate, User createdBy) {
        Bill bill = new Bill();
        bill.setPatient(patient);
        bill.setBillNumber(billNumber);
        bill.setBillDate(LocalDateTime.now().minusDays(10));
        bill.setTotalAmount(BigDecimal.valueOf(totalAmount));
        bill.setPaidAmount(BigDecimal.valueOf(paidAmount));
        bill.setOutstandingAmount(BigDecimal.valueOf(totalAmount - paidAmount));
        bill.setPaymentStatus(status);
        bill.setPaymentDate(paymentDate);
        bill.setCreatedBy(createdBy);
        bill.setItems("Consultation, Lab Tests, Medications");
        billRepository.save(bill);
    }
}

