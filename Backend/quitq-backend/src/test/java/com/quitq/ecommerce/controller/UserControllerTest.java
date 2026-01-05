package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.UserDTO;
import com.quitq.ecommerce.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;

    private UserDTO sampleUserDTO;

    @BeforeEach
    void setUp() {
        // Initialize MockMvc
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        // Initialize sample data
        sampleUserDTO = new UserDTO();
        sampleUserDTO.setId(1L);
        sampleUserDTO.setName("Test User");
        sampleUserDTO.setEmail("test@example.com");
        sampleUserDTO.setPassword("password123");
        sampleUserDTO.setRole("USER");
        sampleUserDTO.setContactNumber("1234567890");
        sampleUserDTO.setGender("Male");
        sampleUserDTO.setAddress("123 Test St");
        sampleUserDTO.setCreatedAt(LocalDateTime.now());
        sampleUserDTO.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @WithMockUser(username = "test@example.com", roles = "USER")
    void getAllUsers_Success() throws Exception {
        when(userService.getAllUsers()).thenReturn(Collections.singletonList(sampleUserDTO));

        mockMvc.perform(get("/api/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Test User"))
                .andExpect(jsonPath("$[0].email").value("test@example.com"))
                .andExpect(jsonPath("$[0].role").value("USER"));
    }

    @Test
    @WithMockUser(username = "test@example.com", roles = "USER")
    void getUserById_Success() throws Exception {
        when(userService.getUserById(1L)).thenReturn(sampleUserDTO);

        mockMvc.perform(get("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test User"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }



    @Test
    @WithMockUser(username = "test@example.com", roles = "USER")
    void deleteUser_Success() throws Exception {
        mockMvc.perform(delete("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}