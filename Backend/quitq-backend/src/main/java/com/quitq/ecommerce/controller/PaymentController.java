package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.PaymentDTO;
import com.quitq.ecommerce.service.PaymentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentDTO> processPayment(@Valid @RequestBody PaymentDTO paymentDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Processing payment request for user with email: {}", email);
        Long userId = paymentService.getUserIdByEmail(email);
        logger.info("Resolved userId: {} from email: {}", userId, email);
        PaymentDTO paymentResponse = paymentService.processPayment(paymentDTO.getOrderId(), paymentDTO);
        logger.info("Payment processed for orderId: {} with payment id: {}", paymentDTO.getOrderId(), paymentResponse.getId());
        return ResponseEntity.ok(paymentResponse);
    }
}
