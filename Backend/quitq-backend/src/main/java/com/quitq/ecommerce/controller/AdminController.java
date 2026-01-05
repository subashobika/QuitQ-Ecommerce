package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.OrderDTO;
import com.quitq.ecommerce.dto.UserDTO;
import com.quitq.ecommerce.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        logger.info("Request received: Get all users");
        List<UserDTO> users = userService.getAllUsers();
        logger.info("Returning {} users", users.size());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        logger.info("Request received: Delete user with id {}", id);
        try {
            userService.deleteUser(id);
            logger.info("User with id {} deleted successfully", id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            logger.error("Error deleting user with id {}: {}", id, ex.getMessage());
            throw ex;
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getOrders() {
        logger.info("Request received: Get orders for admin");
        List<OrderDTO> orders = adminService.getAllOrders();
        logger.info("Returning {} orders", orders.size());
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        logger.info("Request received: Update order status. Order id: {}, status: {}", id, status);
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
        logger.info("Order id: {} status updated to {}", id, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStats> getDashboard() {
        logger.info("Request received: Get admin dashboard stats");
        DashboardStats stats = dashboardService.getAdminDashboardStats();
        logger.info("Returning dashboard stats");
        return ResponseEntity.ok(stats);
    }
}
