package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.UserDTO;
import com.quitq.ecommerce.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        logger.info("Request to get all users");
        List<UserDTO> users = userService.getAllUsers();
        logger.info("Returning {} users", users.size());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        logger.info("Request to get user by id: {}", id);
        UserDTO userDTO = userService.getUserById(id);
        logger.info("Returning user with id: {}", id);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
        logger.info("Request to update user with id: {} using data: {}", id, userDTO);
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        logger.info("User updated successfully with id: {}", updatedUser.getId());
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        logger.info("Request to delete user with id: {}", id);
        userService.deleteUser(id);
        logger.info("User with id: {} deleted successfully", id);
        return ResponseEntity.ok().build();
    }
}
