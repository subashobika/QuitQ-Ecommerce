package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.OrderItemDTO;
import com.quitq.ecommerce.service.OrderItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private static final Logger logger = LoggerFactory.getLogger(OrderItemController.class);

    @Autowired
    private OrderItemService orderItemService;

    @GetMapping
    public ResponseEntity<List<OrderItemDTO>> getAllOrderItems() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Fetching order items for user with email: {}", email);
        Long userId = orderItemService.getUserIdByEmail(email); // Assume method exists
        logger.info("Resolved userId: {} from email: {}", userId, email);
        List<OrderItemDTO> orderItems = orderItemService.getOrderItemsByUserId(userId);
        logger.info("Returning {} order items for userId: {}", orderItems.size(), userId);
        return ResponseEntity.ok(orderItems);
    }
}
