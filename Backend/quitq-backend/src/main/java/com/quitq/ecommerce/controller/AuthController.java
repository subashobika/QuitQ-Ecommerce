package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.UserDTO;
import com.quitq.ecommerce.exception.ResourceNotFoundException;
import com.quitq.ecommerce.security.TokenBlacklist;
import com.quitq.ecommerce.service.UserService;
import com.quitq.ecommerce.config.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserDTO userDTO) {
        logger.info("Registration attempt for email: {}", userDTO.getEmail());

        if ("ADMIN".equalsIgnoreCase(userDTO.getRole())) {
            logger.warn("Attempt to register as ADMIN denied for email: {}", userDTO.getEmail());
            return ResponseEntity.badRequest().body("Admin registration is not allowed");
        }

        UserDTO registeredUser = userService.registerUser(userDTO);
        logger.info("User registered successfully: {}", registeredUser.getEmail());
        return ResponseEntity.ok("Registered Successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserDTO userDTO) {
        logger.info("Login attempt for email: {}", userDTO.getEmail());
        try {
            UserDTO loggedInUser = userService.loginUser(userDTO.getEmail(), userDTO.getPassword());
            String token = jwtUtil.generateToken(loggedInUser.getEmail(), loggedInUser.getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("token", "Bearer " + token);
            response.put("user", loggedInUser);

            logger.info("User logged in successfully: {}", loggedInUser.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            logger.error("Login failed for email: {}, error: {}", userDTO.getEmail(), ex.getMessage());
            throw ex;
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        logger.info("Fetching all users");
        List<UserDTO> users = userService.getAllUsers();
        logger.info("Number of users fetched: {}", users.size());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        logger.info("Logout attempt received");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            TokenBlacklist.blacklistToken(token);
            SecurityContextHolder.clearContext();
            logger.info("User logged out successfully, token blacklisted");
            return ResponseEntity.ok("Logged out successfully");
        }

        logger.warn("Logout attempt without valid Authorization header");
        return ResponseEntity.badRequest().body("No valid token provided");
    }

    public static class JwtResponse {
        private String token;

        public JwtResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }
}
