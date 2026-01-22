package com.hospital.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for Hospital Management System
 * 
 * @author Hospital Management Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class HospitalManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("Hospital Management System Started!");
        System.out.println("API Base URL: http://localhost:8080/api");
        System.out.println("========================================\n");
    }
}
