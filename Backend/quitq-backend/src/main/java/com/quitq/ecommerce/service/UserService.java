package com.quitq.ecommerce.service;

import com.quitq.ecommerce.dto.UserDTO;
import com.quitq.ecommerce.entity.User;
import com.quitq.ecommerce.exception.ResourceNotFoundException;
import com.quitq.ecommerce.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

        private static final Logger log = LoggerFactory.getLogger(UserService.class);

    public UserDTO registerUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new ResourceNotFoundException("Email already exists");
        }

        String roleString = userDTO.getRole();
        if (roleString == null || roleString.isEmpty()) {
            throw new ResourceNotFoundException("Role is required");
        }
        User.Role role;
        try {
            role = User.Role.valueOf(roleString.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid role: " + roleString + ". Valid roles: USER, SELLER, ADMIN");
        }

        User user = new User(
                userDTO.getName(),
                userDTO.getEmail(),
                passwordEncoder.encode(userDTO.getPassword()),
                role,
                userDTO.getContactNumber(),
                userDTO.getGender(),
                userDTO.getAddress()
        );

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public UserDTO loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResourceNotFoundException("Invalid password for user: " + email);
        }
        return convertToDTO(user);
    }


public List<UserDTO> getAllUsers() {
    System.out.println("Fetching all users from repository");
    List<User> users = userRepository.findAll();
    System.out.println("Found " + users.size() + " users");
    return users.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return convertToDTO(user);
    }

public UserDTO updateUser(Long id, UserDTO userDTO) {
    try {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));


        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        String roleString = userDTO.getRole();
        if (roleString != null && !roleString.isEmpty()) {
            try {
                user.setRole(User.Role.valueOf(roleString.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResourceNotFoundException("Invalid role: " + roleString + ". Valid roles: USER, SELLER, ADMIN");
            }
        }

        user.setContactNumber(userDTO.getContactNumber());
        user.setGender(userDTO.getGender());
        user.setAddress(userDTO.getAddress());
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    } catch (Exception e) {
        log.error("Failed to update user with ID {}: {}", id, e.getMessage(), e);
        throw e;
    }
}


    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        userRepository.delete(user);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        dto.setContactNumber(user.getContactNumber());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}