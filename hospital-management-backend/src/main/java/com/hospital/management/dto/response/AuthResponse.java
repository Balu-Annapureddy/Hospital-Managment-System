package com.hospital.management.dto.response;

import com.hospital.management.entity.User.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private UserInfo user;

    public AuthResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }

    /**
     * User information DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String username;
        private String fullName;
        private String email;
        private UserRole role;
    }
}
