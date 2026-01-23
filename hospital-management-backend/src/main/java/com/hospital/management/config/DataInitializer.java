package com.hospital.management.config;

import com.hospital.management.entity.User;
import com.hospital.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Data initializer to seed default users on first startup
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

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

        // Create Admin User
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

        // Create Doctor
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

        // Create Nurse
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

        // Create Billing Staff
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

        System.out.println("\n✅ Seed data initialized successfully!");
        System.out.println("\n📋 Default Login Credentials:");
        System.out.println("  Admin:   admin / admin123");
        System.out.println("  Doctor:  doctor1 / password123");
        System.out.println("  Nurse:   nurse1 / password123");
        System.out.println("  Billing: billing1 / password123\n");
    }
}
