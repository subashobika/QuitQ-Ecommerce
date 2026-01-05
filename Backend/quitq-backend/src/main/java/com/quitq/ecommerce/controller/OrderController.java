package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.OrderDTO;
import com.quitq.ecommerce.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(@RequestParam Long shippingAddressId) {
        logger.info("Request to place order with shippingAddressId: {}", shippingAddressId);
        OrderDTO savedOrder = orderService.placeOrder(shippingAddressId);
        logger.info("Order placed successfully with id: {}", savedOrder.getId());
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrders() {
        logger.info("Request to get orders for current user");
        List<OrderDTO> orders = orderService.getOrdersForCurrentUser();
        logger.info("Returning {} orders for current user", orders.size());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        logger.info("Request to get order with id: {}", id);
        OrderDTO order = orderService.getOrderById(id);
        logger.info("Returning order with id: {}", id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        String status = statusRequest.get("status");
        if (status == null) {
            logger.error("Update order status failed: status is missing for order id: {}", id);
            throw new IllegalArgumentException("Status is required");
        }
        logger.info("Request to update status of order id: {} to status: {}", id, status);
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
        logger.info("Order status updated successfully for order id: {}", id);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        logger.info("Request to delete order with id: {}", id);
        orderService.deleteOrder(id);
        logger.info("Order with id: {} deleted successfully", id);
        return ResponseEntity.ok("Order deleted successfully");
    }
    @GetMapping("/admin/all")
    public ResponseEntity<List<OrderDTO>> getAllOrdersForAdmin() {
        logger.info("Admin fetching all orders");
        List<OrderDTO> orders = orderService.getAllOrdersForAdmin();
        return ResponseEntity.ok(orders);
    }



}
