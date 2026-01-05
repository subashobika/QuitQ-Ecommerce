package com.quitq.ecommerce.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quitq.ecommerce.dto.UserDTO;
import com.quitq.ecommerce.security.TokenBlacklist;
import com.quitq.ecommerce.service.UserService;
import com.quitq.ecommerce.config.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.hamcrest.Matchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    private UserDTO sampleUserDTO;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();

        sampleUserDTO = new UserDTO();
        sampleUserDTO.setId(1L);
        sampleUserDTO.setEmail("user@example.com");
        sampleUserDTO.setPassword("password123");
        sampleUserDTO.setRole("USER");
        sampleUserDTO.setName("Sample User");
    }

    @Test
    void registerUser_ReturnsSuccessMessage() throws Exception {
        when(userService.registerUser(any(UserDTO.class))).thenReturn(sampleUserDTO);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleUserDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Registered Successfully"));

        verify(userService).registerUser(any(UserDTO.class));
    }

    @Test
    void loginUser_ReturnsToken() throws Exception {
        when(userService.loginUser(eq("user@example.com"), eq("password123"))).thenReturn(sampleUserDTO);
        when(jwtUtil.generateToken(eq(sampleUserDTO.getEmail()), eq(sampleUserDTO.getRole()))).thenReturn("abc123token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleUserDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", is("Bearer abc123token")));

        verify(userService).loginUser(eq("user@example.com"), eq("password123"));
        verify(jwtUtil).generateToken(eq(sampleUserDTO.getEmail()), eq(sampleUserDTO.getRole()));
    }

    @Test
    void getAllUsers_ReturnsUserList() throws Exception {
        List<UserDTO> users = Collections.singletonList(sampleUserDTO);
        when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/auth/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(users.size())))
                .andExpect(jsonPath("$[0].email", is(sampleUserDTO.getEmail())));

        verify(userService).getAllUsers();
    }

    @Test
    void logout_ValidToken_ReturnsSuccess() throws Exception {
        try (var mockedTokenBlacklist = Mockito.mockStatic(TokenBlacklist.class)) {
            mockedTokenBlacklist.when(() -> TokenBlacklist.blacklistToken("validtoken"))
                    .thenAnswer(invocation -> null);

            mockMvc.perform(post("/api/auth/logout")
                            .header("Authorization", "Bearer validtoken"))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Logged out successfully"));

            mockedTokenBlacklist.verify(() -> TokenBlacklist.blacklistToken("validtoken"), times(1));
        }
    }

    @Test
    void logout_NoToken_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("No valid token provided"));
    }
}
