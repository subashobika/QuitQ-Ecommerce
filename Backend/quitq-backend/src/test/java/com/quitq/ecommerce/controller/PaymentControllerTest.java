package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.PaymentDTO;
import com.quitq.ecommerce.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        // Set up MockMvc with standalone controller
        mockMvc = MockMvcBuilders.standaloneSetup(paymentController).build();

        // Mock SecurityContextHolder to simulate an authenticated user
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken("test@example.com", null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    void processPayment_Success() throws Exception {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setId(1L);
        paymentDTO.setOrderId(100L);
        paymentDTO.setAmount(200.00);
        paymentDTO.setStatus("COMPLETED");
        paymentDTO.setPaymentMethod("Credit Card"); // Added to satisfy @NotNull constraint

        when(paymentService.getUserIdByEmail("test@example.com")).thenReturn(1L);
        when(paymentService.processPayment(anyLong(), any(PaymentDTO.class))).thenReturn(paymentDTO);

        mockMvc.perform(post("/api/payments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderId\": 100, \"amount\": 200.00, \"status\": \"COMPLETED\", \"paymentMethod\": \"Credit Card\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.orderId").value(100))
                .andExpect(jsonPath("$.amount").value(200.00))
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.paymentMethod").value("Credit Card"));
    }

    @Test
    void processPayment_InvalidInput() throws Exception {
        // Test with invalid JSON (missing required paymentMethod)
        mockMvc.perform(post("/api/payments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderId\": 100, \"amount\": 200.00, \"status\": \"COMPLETED\"}")) // Missing paymentMethod
                .andExpect(status().isBadRequest()); // Expect 400 due to @Valid validation failure
    }
}